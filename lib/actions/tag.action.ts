import { QueryFilter } from "mongoose";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { PaginatedSearchParamsSchema } from "../validations";
import { Tag } from "@/database";
import dbConnect from "../mongoose";

/**
 * getTags implements page/pageSize pagination using skip/limit.
 * Flow:
 * 1) Validate input via schema.
 * 2) Build filterQuery from 'query' and 'filter'.
 * 3) Count total documents for isNext = total > skip + returnedCount.
 * 4) Fetch the current page: find().sort().skip(skip).limit(limit).
 *
 * Example:
 * - page=3, pageSize=10, query="js", filter="recent"
 * - skip=(3-1)*10=20, limit=10
 * - isNext = total > 20 + returnedCount (typically 30 when page is full)
 */
export const getTags = async (
  params: PaginatedSearchParams
): Promise<ActionResponse<{ tags: Tag[]; isNext: boolean }>> => {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { page = 1, pageSize = 10, query, filter } = params;

  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);

  const filterQuery: QueryFilter<typeof Tag> = {};

  if (query) {
    filterQuery.$or = [{ name: { $regex: query, $options: "i" } }];
  }

  // Sort criteria derived from 'filter' (popular/recent/oldest/name)
  let sortCriteria = {};

  switch (filter) {
    case "popular":
      sortCriteria = { questions: -1 };
      break;
    case "recent":
      sortCriteria = { createdAt: -1 };
      break;
    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;
    case "name":
      sortCriteria = { name: 1 };
      break;
    default:
      sortCriteria = { questions: -1 };
      break;
  }

  try {
    // Ensure the DB connection is ready before querying
    await dbConnect();

    // Total count for pagination and isNext calculation
    const totalTags = await Tag.countDocuments(filterQuery);

    // Current page fetch: ordered, then skip/limit applied
    const tags = await Tag.find(filterQuery)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    // isNext tells the UI if another page exists
    // Example: total=73, page=3, pageSize=10 => skip=20, returned=10 => isNext = 73 > 30 => true
    const isNext = totalTags > skip + tags.length;

    return {
      success: true,
      data: {
        tags: JSON.parse(JSON.stringify(tags)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

// Simple "top tags" fetch (non-paginated): sorts by questions desc and limits to 5
export const getTopTags = async (): Promise<ActionResponse<Tag[]>> => {
  try {
    await dbConnect();

    const tags = await Tag.find().sort({ questions: -1 }).limit(5);

    return {
      success: true,
      data: JSON.parse(JSON.stringify(tags)),
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};