# Actions + Database Playbook (Advanced)

This guide abstracts your codebase. Replace placeholders with your concrete functions, tables, and schemas.
Add references to real actions using the TODO markers.

- Stack-agnostic examples use:
  - db: your ORM/DB client (e.g., Prisma, Drizzle, Kysely)
  - tx: transactional client
  - z: Zod (or your validator)
  - cache: Redis/in-memory; Next.js revalidateTag/revalidatePath where relevant

---

## 1) Conventions

- Inputs: validate with schema before DB access.
- Outputs: return typed, minimal payloads (no oversharing columns).
- Errors: domain vs system errors (typed), never leak internals.
- Auth: perform checks as close to the data as possible (owner/role/tenant).

TODO: Map your action names here:
- listThings → TODO(action)
- getThingById → TODO(action)
- createThing → TODO(action)
- updateThing → TODO(action)
- deleteThing → TODO(action)

---

## 2) Query Patterns

### 2.1 Fetch by ID (with ownership/tenant)
```ts
const GetThingInput = z.object({ id: z.string().uuid(), tenantId: z.string() });
export async function getThing(input: unknown) {
  const { id, tenantId } = GetThingInput.parse(input);
  const row = await db.thing.findFirst({ where: { id, tenantId } }); // add select to project minimal fields
  if (!row) throw new NotFoundError('Thing not found');
  return row;
}
```

### 2.2 Filtered lists + safe pagination (cursor)
```ts
const ListInput = z.object({
  tenantId: z.string(),
  q: z.string().optional(),
  after: z.string().optional(), // cursor = id
  limit: z.number().int().min(1).max(100).default(20),
});
export async function listThings(input: unknown) {
  const { tenantId, q, after, limit } = ListInput.parse(input);
  const where = {
    tenantId,
    ...(q ? { name: { contains: q, mode: 'insensitive' } } : {}),
    deletedAt: null,
  };
  const rows = await db.thing.findMany({
    where, orderBy: { createdAt: 'desc' }, take: limit + 1,
    ...(after ? { cursor: { id: after }, skip: 1 } : {}),
  });
  const hasMore = rows.length > limit;
  return {
    data: rows.slice(0, limit),
    pageInfo: { hasMore, endCursor: hasMore ? rows[limit - 1].id : null },
  };
}
```

Tips:
- Prefer cursor over offset for large tables.
- Add composite orderBy if needed: createdAt desc, id desc.
- Project only needed fields (select/pick).

---

## 3) Mutation Patterns

### 3.1 Create (idempotent via unique key)
```ts
const CreateInput = z.object({
  tenantId: z.string(),
  name: z.string().min(1),
  idempotencyKey: z.string().uuid().optional(),
});
export async function createThing(input: unknown) {
  const { tenantId, name, idempotencyKey } = CreateInput.parse(input);
  return await db.$transaction(async (tx) => {
    if (idempotencyKey) {
      const existing = await tx.idempotency.findUnique({ where: { key: idempotencyKey } });
      if (existing) return await tx.thing.findUnique({ where: { id: existing.resourceId } });
    }
    const row = await tx.thing.create({ data: { tenantId, name } });
    if (idempotencyKey) {
      await tx.idempotency.create({ data: { key: idempotencyKey, resourceId: row.id } });
    }
    // Optionally: revalidateTag('things:'+tenantId)
    return row;
  });
}
```

### 3.2 Update (optimistic locking)
```ts
const UpdateInput = z.object({
  id: z.string().uuid(),
  tenantId: z.string(),
  patch: z.object({ name: z.string().min(1).optional() }),
  version: z.number().int().nonnegative(), // from prior read
});
export async function updateThing(input: unknown) {
  const { id, tenantId, patch, version } = UpdateInput.parse(input);
  const updated = await db.thing.updateMany({
    where: { id, tenantId, version },
    data: { ...patch, version: { increment: 1 } },
  });
  if (updated.count === 0) throw new ConflictError('Version conflict');
  // revalidateTag('thing:'+id); revalidateTag('things:'+tenantId)
}
```

### 3.3 Soft delete + restore
```ts
export async function softDeleteThing({ id, tenantId }: { id: string; tenantId: string }) {
  await db.thing.update({ where: { id, tenantId }, data: { deletedAt: new Date() } });
}
export async function restoreThing({ id, tenantId }: { id: string; tenantId: string }) {
  await db.thing.update({ where: { id, tenantId }, data: { deletedAt: null } });
}
```

---

## 4) Validation & Typing

- Always parse inputs at the boundary (action entry).
- Map DB errors to domain errors:
  - Unique violation → DuplicateError
  - FK violation → IntegrityError
- Never pass raw unknown into queries.

```ts
try {
  // ... parse, query/mutate ...
} catch (e) {
  if (isZodError(e)) throw new BadRequestError('Invalid input', e.flatten());
  if (isUniqueError(e)) throw new DuplicateError('Already exists');
  throw new SystemError('Unexpected', { cause: e });
}
```

---

## 5) Transactions

- Use a single transaction for multi-step invariants.
- Keep transactions short; avoid external calls inside tx.
- Retry on serialization/deadlock errors with bounded backoff.

```ts
await db.$transaction(async (tx) => {
  // validate invariants
  // read rows FOR UPDATE (or equivalent locking if supported)
  // write changes
}, { maxWait: 5000, timeout: 10000 });
```

---

## 6) Concurrency Control

- Idempotency keys for externally-triggered actions (webhooks/UI retried submits).
- Optimistic locking via version or updatedAt check.
- Unique constraints for de-dupe (INSERT ... ON CONFLICT DO NOTHING + select).

```ts
// Optimistic locking pattern using updatedAt
const count = await db.thing.updateMany({
  where: { id, tenantId, updatedAt: prevUpdatedAt },
  data: { ...patch, updatedAt: new Date() },
});
if (!count) throw new ConflictError('Stale update');
```

---

## 7) Caching & Invalidation

- Read cache: Redis keyed by tenant + query params.
- Write-through or cache-busting on mutation.
- Next.js: revalidateTag('things:tenantId') or revalidatePath('/things').

```ts
const key = `things:${tenantId}:${hash(filter)}`;
const cached = await cache.get(key);
if (cached) return cached;
const data = await db.thing.findMany({ where, select });
await cache.set(key, data, { ttl: 60 });
return data;
```

---

## 8) Authorization

- Check auth before DB access when possible.
- Row-level checks in WHERE (tenantId, ownerId).
- Enforce role/permission matrix per action.

```ts
function assertCanModify(user, row) {
  if (user.tenantId !== row.tenantId) throw new ForbiddenError();
  if (!user.roles.includes('editor')) throw new ForbiddenError();
}
```

---

## 9) Error Taxonomy

- BadRequestError (4xx): validation issues, missing fields.
- UnauthorizedError / ForbiddenError.
- NotFoundError (do not leak existence across tenants if sensitive).
- ConflictError (optimistic lock, unique violation).
- SystemError (5xx): timeouts, unknown.

Return a consistent envelope:
```ts
type Result<T> = { ok: true; data: T } | { ok: false; error: { code: string; message: string } };
```

---

## 10) Pagination, Sorting, Searching

- Cursor pagination with stable order.
- Allow limited, validated sort fields and directions.
- For search, consider dedicated search service or DB FTS with indexes.

```ts
const SortInput = z.enum(['createdAt', 'name']).default('createdAt');
const DirInput = z.enum(['asc', 'desc']).default('desc');
```

---

## 11) Performance

- Add indexes for frequent predicates: (tenantId, createdAt), (tenantId, name).
- Avoid N+1: batch queries or join through pivot tables.
- Use select/projection to avoid large blobs by default.
- Profile slow actions (explain/analyze, tracing).

---

## 12) Testing

- Unit: validate schemas and error mapping.
- Integration: run against a test DB with migrations.
- Seed builders for common fixtures.
- Deterministic tests (freeze time where needed).

```ts
it('updates with optimistic lock', async () => {
  // arrange: insert row with version=0
  // act: update with version=0
  // assert: version increments, conflict on second update with old version
});
```

---

## 13) Migrations & Schema Evolution

- Backward-compatible changes first (add columns nullable, dual-write).
- Backfill data with idempotent scripts.
- Drop columns/tables in later migrations.
- Zero-downtime patterns for large tables (create-new, copy, swap).

---

## 14) Multi-Tenancy

- Always scope by tenantId in WHERE and unique constraints.
- Consider composite indexes including tenantId.
- Prevent cross-tenant leaks in logs/errors.

---

## 15) Background Work & Outbox

- For side-effects (emails, webhooks), use outbox pattern inside the same tx.
- Separate worker consumes outbox with retries and dead-letter queue.

```ts
await tx.outbox.insert({ type: 'thing.created', payload: { id: row.id, tenantId } });
```

---

## 16) Files & Attachments

- Store metadata in DB, blobs in object storage (S3/GCS).
- Transaction: create row, then upload; if upload fails, clean up.
- On delete, remove blob asynchronously with retries.

---

## 17) Webhooks

- Verify signatures.
- Ensure idempotency.
- Return quickly; do heavy work asynchronously.

---

## 18) Rate Limiting & Abuse Prevention

- Per user/tenant/IP tokens bucket or sliding window in Redis.
- Enforce quotas at action entry.

```ts
await rateLimiter.consume(`create:${user.id}`, 1); // throws on limit
```

---

## 19) Observability

- Structured logs with request/action IDs and tenantId.
- Metrics: counters for success/error, latency histograms, DB timings.
- Tracing: spans around DB queries and external calls.

---

## 20) Action Blueprint (Template)

```ts
// 1) Parse input
const Input = z.object({
  tenantId: z.string(),
  // ...fields...
});

// 2) Entry point
export async function ACTION_NAME(input: unknown): Promise<Result<OutputType>> {
  try {
    const args = Input.parse(input);
    const user = await getCurrentUser(); // or passed context

    // 3) AuthZ
    assertRole(user, 'editor');
    assertTenant(user, args.tenantId);

    // 4) Rate limit (optional)
    await rateLimiter.consume(`ACTION_NAME:${user.id}`, 1);

    // 5) Main logic (txn if needed)
    const result = await db.$transaction(async (tx) => {
      // - read/validate invariants
      // - mutate
      // - write outbox / idempotency markers
      return /* data */;
    });

    // 6) Cache invalidation
    // revalidateTag(`things:${args.tenantId}`);

    // 7) Return envelope
    return { ok: true, data: result };
  } catch (e) {
    const err = normalizeError(e); // map to { code, message }
    return { ok: false, error: err };
  }
}
```

---

## 21) Security

- Never trust client inputs (validate + authorize).
- Avoid leaking internal IDs across tenants when sensitive.
- Sanitize search and sort inputs (whitelists).
- Encrypt sensitive fields at rest, hash secrets.
- Use row-level security if supported by your DB.

---

## 22) Checklist per Action

Pre:
- [ ] Validate input schema
- [ ] Authenticate and authorize (role, ownership, tenant)
- [ ] Rate limit (if needed)

Do:
- [ ] Use tx for multi-step invariants
- [ ] Concurrency control (version/idempotency/unique)
- [ ] Select minimal fields

Post:
- [ ] Cache invalidation (tag/path) or write-through
- [ ] Outbox events / notifications
- [ ] Log metrics and trace spans

---
<!-- new -->

## 23) MongoDB Aggregation Pipelines

Aggregation pipelines transform and combine documents through a sequence of stages. Think of it as a data processing pipeline where each stage performs an operation and passes results to the next stage.

### 23.1 Why Use Aggregation?

- **Join multiple collections** ($lookup) - equivalent to SQL JOINs
- **Complex data transformations** - reshape, compute, filter
- **Performance** - single query instead of multiple round-trips
- **Aggregation operations** - group, count, sum, average
- **Pre-filtering before joins** - reduce data processed

### 23.2 Core Pipeline Stages

#### $match - Filter documents (like WHERE in SQL)
```ts
{ $match: { author: new Types.ObjectId(userId) } }
// Filters to only documents where author matches userId
// ALWAYS put $match early in pipeline to reduce data processed
```

#### $lookup - Join collections (like JOIN in SQL)
```ts
{
  $lookup: {
    from: "questions",        // collection to join
    localField: "question",   // field in current collection
    foreignField: "_id",      // field in target collection to match
    as: "questionData"        // output array name
  }
}
// Performs a left outer join, returns array even if single match
```

#### $unwind - Deconstruct array field
```ts
{ $unwind: "$questionData" }
// Transforms: { questionData: [{...}] } 
// Into: { questionData: {...} }
// Creates one document per array element
```

#### $group - Aggregate documents (like GROUP BY)
```ts
{
  $group: {
    _id: "$tags",              // group by field
    count: { $sum: 1 },        // count occurrences
    totalUpvotes: { $sum: "$upvotes" },
    avgViews: { $avg: "$views" }
  }
}
```

#### $project - Select/reshape fields
```ts
{
  $project: {
    _id: "$tagInfo._id",
    name: "$tagInfo.name",
    count: 1,                  // 1 = include, 0 = exclude
    author: 0                  // exclude sensitive fields
  }
}
```

#### $sort, $skip, $limit - Pagination & ordering
```ts
{ $sort: { createdAt: -1 } }  // -1 = desc, 1 = asc
{ $skip: (page - 1) * pageSize }
{ $limit: pageSize }
```

#### $count - Count matching documents
```ts
{ $count: "totalCount" }
// Returns: { totalCount: 42 }
```

### 23.3 Real Example: Saved Questions with Full Details

**Goal**: Fetch user's saved questions with author details, tags, searchability, and pagination.

```ts
// From: getSavedQuestions in collection.action.ts
const pipeline: PipelineStage[] = [
  // Stage 1: Filter to current user's saved items
  { $match: { author: new Types.ObjectId(userId) } },
  
  // Stage 2: Join with questions collection
  {
    $lookup: {
      from: "questions",
      localField: "question",     // Collection.question (ObjectId)
      foreignField: "_id",        // Question._id
      as: "question"              // Output field name
    }
  },
  
  // Stage 3: Flatten question array (was array of 1)
  { $unwind: "$question" },
  
  // Stage 4: Join question author with users collection
  {
    $lookup: {
      from: "users",
      localField: "question.author",
      foreignField: "_id",
      as: "question.author"       // Nested path
    }
  },
  
  // Stage 5: Flatten author array
  { $unwind: "$question.author" },
  
  // Stage 6: Join question tags with tags collection
  {
    $lookup: {
      from: "tags",
      localField: "question.tags",  // Array of tag IDs
      foreignField: "_id",
      as: "question.tags"            // Replace with full tag objects
    }
  },
];

// Stage 7 (conditional): Search filter
if (query) {
  pipeline.push({
    $match: {
      $or: [
        { "question.title": { $regex: query, $options: "i" } },
        { "question.content": { $regex: query, $options: "i" } }
      ]
    }
  });
}

// Get total count for pagination
const [totalCount] = await Collection.aggregate([
  ...pipeline,
  { $count: "count" }
]);

// Stage 8-10: Sort, paginate, project
pipeline.push(
  { $sort: { "question.createdAt": -1 } },
  { $skip: skip },
  { $limit: limit },
  { $project: { question: 1, author: 1 } }  // Only return needed fields
);

const results = await Collection.aggregate(pipeline);
```

**Why this approach?**
- Single query retrieves collections + questions + users + tags
- Search applied AFTER joins so we can search within question content
- Count executed separately to know if more pages exist
- Projection minimizes data transfer

### 23.4 Real Example: User's Top Tags

**Goal**: Find user's 10 most-used tags from their questions.

```ts
// From: getUsersProfile in user.action.ts
const pipeline: PipelineStage[] = [
  // Stage 1: Get all user's questions
  { $match: { author: new Types.ObjectId(userId) } },
  
  // Stage 2: Deconstruct tags array - one doc per tag
  // Question: { tags: [tag1, tag2] }
  // Becomes: 2 documents, one with tag1, one with tag2
  { $unwind: "$tags" },
  
  // Stage 3: Group by tag ID and count occurrences
  {
    $group: {
      _id: "$tags",              // Group key
      count: { $sum: 1 }         // Increment counter for each doc
    }
  },
  
  // Stage 4: Join with tags collection to get tag names
  {
    $lookup: {
      from: "tags",
      localField: "_id",          // _id from grouping (tag ObjectId)
      foreignField: "_id",
      as: "tagInfo"
    }
  },
  
  // Stage 5: Flatten tag info
  { $unwind: "$tagInfo" },
  
  // Stage 6: Sort by most used
  { $sort: { count: -1 } },
  
  // Stage 7: Limit to top 10
  { $limit: 10 },
  
  // Stage 8: Shape output
  {
    $project: {
      _id: "$tagInfo._id",
      name: "$tagInfo.name",
      count: 1
    }
  }
];

const tags = await Question.aggregate(pipeline);
// Returns: [{ _id: "...", name: "javascript", count: 15 }, ...]
```

**Key insight**: $unwind + $group is powerful for analyzing array relationships.

### 23.5 Real Example: User Statistics

**Goal**: Compute total questions, answers, upvotes, and views for badge calculation.

```ts
// From: getUserStats in user.action.ts

// Get question stats
const [questionStats] = await Question.aggregate([
  { $match: { author: new Types.ObjectId(userId) } },
  {
    $group: {
      _id: null,                       // Single group for all docs
      count: { $sum: 1 },              // Count questions
      upvotes: { $sum: "$upvotes" },   // Sum all upvotes
      views: { $sum: "$views" }        // Sum all views
    }
  }
]);
// Returns: { _id: null, count: 42, upvotes: 156, views: 3421 }

// Get answer stats separately
const [answerStats] = await Answer.aggregate([
  { $match: { author: new Types.ObjectId(userId) } },
  {
    $group: {
      _id: null,
      count: { $sum: 1 },
      upvotes: { $sum: "$upvotes" }
    }
  }
]);

// Combine for badge calculation
const badges = assignBadges({
  criteria: [
    { type: "ANSWER_COUNT", count: answerStats.count },
    { type: "QUESTION_COUNT", count: questionStats.count },
    { type: "QUESTION_UPVOTES", count: questionStats.upvotes + answerStats.upvotes },
    { type: "TOTAL_VIEWS", count: questionStats.views }
  ]
});
```

**Why separate aggregations?**
- Questions and answers are in different collections
- Each has different fields to aggregate
- Results combined in application layer

### 23.6 Performance Best Practices

#### 1. Filter Early ($match first)
```ts
// ✅ GOOD: Filter before expensive operations
[
  { $match: { tenantId } },      // Reduces documents early
  { $lookup: { ... } },
  { $unwind: ... }
]

// ❌ BAD: Filter after joins
[
  { $lookup: { ... } },           // Processes ALL documents
  { $unwind: ... },
  { $match: { tenantId } }        // Filters too late
]
```

#### 2. Index Pipeline Fields
```ts
// Ensure indexes exist for:
db.collection.createIndex({ author: 1 });           // $match fields
db.collection.createIndex({ createdAt: -1 });      // $sort fields
db.collection.createIndex({ author: 1, createdAt: -1 }); // Compound
```

#### 3. Project Early to Reduce Memory
```ts
{
  $project: {
    _id: 1,
    title: 1,
    author: 1
    // Exclude large content fields until needed
  }
}
```

#### 4. Avoid $lookup on Large Collections
```ts
// If possible, denormalize frequently-accessed data
// Example: Store author name in question doc to avoid user lookup
```

#### 5. Use allowDiskUse for Large Datasets
```ts
await Collection.aggregate(pipeline, { allowDiskUse: true });
// Allows MongoDB to write temp data to disk if exceeds 100MB memory
```

#### 6. Limit Early When Possible
```ts
// ✅ If sorting by indexed field, limit early
[
  { $match: { ... } },
  { $sort: { createdAt: -1 } },  // Indexed
  { $limit: 10 },                 // Early limit
  { $lookup: { ... } }            // Only 10 docs joined
]
```

### 23.7 Common Patterns

#### Pattern: Pagination with Total Count
```ts
// Get count
const [{ count }] = await Model.aggregate([
  ...filterStages,
  { $count: "count" }
]);

// Get paginated data
const data = await Model.aggregate([
  ...filterStages,
  { $sort: sortCriteria },
  { $skip: (page - 1) * pageSize },
  { $limit: pageSize }
]);

return { data, hasMore: count > page * pageSize };
```

#### Pattern: Conditional Pipeline Stages
```ts
const pipeline: PipelineStage[] = [{ $match: { ... } }];

if (query) {
  pipeline.push({
    $match: { name: { $regex: query, $options: "i" } }
  });
}

if (sortField) {
  pipeline.push({ $sort: { [sortField]: sortDir } });
}
```

#### Pattern: Nested Lookups for Deep Relations
```ts
// User -> Questions -> Tags
[
  { $match: { _id: userId } },
  { $lookup: { from: "questions", ... } },
  { $unwind: "$questions" },
  { $lookup: { from: "tags", localField: "questions.tags", ... } }
]
```

### 23.8 Debugging Pipelines

#### Use $out to inspect intermediate stages
```ts
const pipeline = [
  { $match: { ... } },
  { $lookup: { ... } },
  { $out: "debug_collection" }  // Write results to temp collection
];
await Model.aggregate(pipeline);
// Then inspect: db.debug_collection.find()
```

#### Add $project to see stage output
```ts
[
  { $match: { ... } },
  { $project: { debug: "$$ROOT" } },  // $$ROOT = entire document
  { $lookup: { ... } }
]
```

#### Check explain plan
```ts
const cursor = Model.aggregate(pipeline);
const explain = await cursor.explain();
console.log(JSON.stringify(explain, null, 2));
// Shows indexes used, documents examined, execution time
```

### 23.9 Type Safety with TypeScript

```ts
import { PipelineStage, Types } from "mongoose";

// Define pipeline with proper typing
const pipeline: PipelineStage[] = [
  { $match: { author: new Types.ObjectId(userId) } },
  { $lookup: { from: "users", localField: "author", foreignField: "_id", as: "authorData" } }
];

// Parse results with Zod or type assertion
const results = await Question.aggregate(pipeline);
const parsed = ResultSchema.parse(JSON.parse(JSON.stringify(results)));
```

### 23.10 Common Pitfalls

#### ❌ Forgetting $unwind after $lookup
```ts
// $lookup returns array even for 1-to-1 relations
{ $lookup: { ... } }
// Doc now has: { user: [{ name: "John" }] }

// Must unwind to get: { user: { name: "John" } }
{ $unwind: "$user" }
```

#### ❌ Wrong field path syntax
```ts
{ $project: { name: "tagInfo.name" } }  // ❌ String literal
{ $project: { name: "$tagInfo.name" } } // ✅ Field reference ($ prefix)
```

#### ❌ Not handling empty arrays
```ts
{ $unwind: "$tags" }  // Drops docs with empty tags array
{ $unwind: { path: "$tags", preserveNullAndEmptyArrays: true } } // ✅ Keeps them
```

#### ❌ Accumulator in $project
```ts
{ $project: { total: { $sum: "$values" } } }  // ❌ Won't work
// $sum is for $group, use $reduce in $project:
{ $project: { total: { $reduce: { input: "$values", initialValue: 0, in: { $add: ["$$value", "$$this"] } } } } }
```

### 23.11 When NOT to Use Aggregation

- Simple queries (use `.find()` instead)
- Real-time updates (aggregation results aren't reactive)
- When you need cursors with `.stream()` for very large datasets
- If denormalization would be simpler and faster

---

## 24) MongoDB Transactions (Real-World Pattern)

Transactions ensure atomicity - all operations succeed or all fail together, preventing data inconsistencies.

### 24.1 Vote Action Transaction Example

From `createVote` in vote.action.ts - demonstrates a complex multi-step transaction:

```ts
const session = await mongoose.startSession();
session.startTransaction();

try {
  // Step 1: Find the content (question/answer) with session
  const Model = targetType === "question" ? Question : Answer;
  const contentDoc = await Model.findById(targetId).session(session);
  if (!contentDoc) throw new Error("Content not found");
  
  // Step 2: Check for existing vote (within transaction)
  const existingVote = await Vote.findOne({
    author: userId,
    actionId: targetId,
    actionType: targetType,
  }).session(session);
  
  // Step 3: Handle three scenarios
  if (existingVote) {
    if (existingVote.voteType === voteType) {
      // Same vote = remove it (toggle off)
      await Vote.deleteOne({ _id: existingVote._id }).session(session);
      await updateVoteCount({ targetId, targetType, voteType, change: -1 }, session);
    } else {
      // Different vote = change vote type
      await Vote.findByIdAndUpdate(
        existingVote._id,
        { voteType },
        { new: true, session }
      );
      // Decrement old vote, increment new vote
      await updateVoteCount({ targetId, targetType, voteType: existingVote.voteType, change: -1 }, session);
      await updateVoteCount({ targetId, targetType, voteType, change: 1 }, session);
    }
  } else {
    // First-time vote = create new
    await Vote.create([{ author: userId, actionId: targetId, actionType: targetType, voteType }], { session });
    await updateVoteCount({ targetId, targetType, voteType, change: 1 }, session);
  }
  
  // Step 4: Commit if all succeeded
  await session.commitTransaction();
  session.endSession();
  
  revalidatePath(`/questions/${targetId}`);
  return { success: true };
  
} catch (error) {
  // Step 5: Rollback on any error
  await session.abortTransaction();
  session.endSession();
  return handleError(error) as ErrorResponse;
}
```

### 24.2 Why This Needs a Transaction

**Without transaction**, this sequence could fail:
1. Vote record created ✅
2. Vote count update fails ❌  
**Result**: Database inconsistency (vote exists but count wrong)

**With transaction**:
- All operations in session scope
- If any fails, all rollback automatically
- Database stays consistent

### 24.3 Transaction Best Practices

#### 1. Pass session to all operations
```ts
// ✅ All ops use session
await Model.findById(id).session(session);
await Model.create([data], { session });
await Model.updateOne({ _id: id }, update, { session });

// ❌ This op NOT in transaction
await Model.updateOne({ _id: id }, update);  // Missing session!
```

#### 2. Use array for Model.create() in transactions
```ts
// ✅ CORRECT
await Vote.create([{ author, actionId }], { session });

// ❌ WRONG - won't use session properly
await Vote.create({ author, actionId }, { session });
```

#### 3. Always end session in finally block
```ts
const session = await mongoose.startSession();
session.startTransaction();

try {
  // ... operations ...
  await session.commitTransaction();
  return { success: true };
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();  // Always cleanup
}
```

#### 4. Keep transactions short
```ts
// ❌ BAD - external API call in transaction
await session.startTransaction();
await Model.create(..., { session });
await fetch("https://api.external.com");  // Slow!
await session.commitTransaction();

// ✅ GOOD - transaction only for DB ops
await session.startTransaction();
await Model.create(..., { session });
await session.commitTransaction();
await fetch("https://api.external.com");  // After transaction
```

#### 5. Transaction timeout configuration
```ts
const session = await mongoose.startSession();
session.startTransaction({
  readConcern: { level: 'snapshot' },
  writeConcern: { w: 'majority' },
  maxCommitTimeMS: 5000  // 5 second timeout
});
```

### 24.4 Helper Function Pattern

Extract transaction logic into reusable helper:

```ts
// Helper that manages session lifecycle
async function updateVoteCount(
  params: UpdateVoteCountParams,
  session?: ClientSession  // Optional - can be called standalone or in transaction
): Promise<ActionResponse> {
  const { targetId, targetType, voteType, change } = params;
  const Model = targetType === "question" ? Question : Answer;
  const voteField = voteType === "upvote" ? "upVotes" : "downVotes";
  
  try {
    const result = await Model.findByIdAndUpdate(
      targetId,
      { $inc: { [voteField]: change } },
      { new: true, session }  // Use session if provided
    );
    
    if (!result) throw new Error("Failed to update vote count");
    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

// Can be called standalone
await updateVoteCount({ targetId, targetType, voteType, change: 1 });

// Or within a transaction
await updateVoteCount({ targetId, targetType, voteType, change: 1 }, session);
```

### 24.5 When to Use Transactions

**✅ Use transactions when:**
- Multiple writes must succeed together (vote + count update)
- Maintaining referential integrity (delete parent + children)
- Financial operations (debit one account, credit another)
- Preventing race conditions (check + create patterns)

**❌ Skip transactions when:**
- Single write operation
- Read-only operations
- Cross-database operations (transactions don't span DBs)
- Performance is critical and eventual consistency is acceptable

### 24.6 Common Transaction Patterns

#### Pattern: Safe Toggle (like vote on/off)
```ts
const existingRecord = await Model.findOne({ ... }).session(session);
if (existingRecord) {
  await Model.deleteOne({ _id: existingRecord._id }).session(session);
  await updateCounter({ change: -1 }, session);
} else {
  await Model.create([{ ... }], { session });
  await updateCounter({ change: 1 }, session);
}
```

#### Pattern: Swap/Replace
```ts
// Change vote from upvote to downvote
await Vote.findByIdAndUpdate(existingVote._id, { voteType: newType }, { session });
await updateCounter({ type: oldType, change: -1 }, session);
await updateCounter({ type: newType, change: 1 }, session);
```

#### Pattern: Conditional Create (avoid duplicates)
```ts
const existing = await Model.findOne({ uniqueKey }).session(session);
if (existing) {
  throw new Error("Already exists");
}
await Model.create([{ uniqueKey, ...data }], { session });
```

---