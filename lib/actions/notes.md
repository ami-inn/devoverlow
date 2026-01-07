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

## 23) TODO: Map to Your Actions

- TODO(listThings): confirm filters, pagination, indexes, cache tags
- TODO(getThingById): confirm projection, NotFound vs Forbidden semantics
- TODO(createThing): idempotency key strategy and unique constraints
- TODO(updateThing): optimistic locking/version field presence
- TODO(deleteThing): soft delete vs hard delete, cleanup linked data
- TODO(searchThings): FTS strategy and index configuration

Once you drop your actual actions here, mirror each against the checklist and patterns above.
