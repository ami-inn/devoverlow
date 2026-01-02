import { RequestError } from "../http-errors";
import logger from "../logger";
import handleError from "./error";

// requestiinit extension to include timeout
interface FetchOptions extends RequestInit {
  timeout?: number;
}

function isError(error: unknown): error is Error {
  return error instanceof Error;
}

// t is a generic type representing the expected structure of the response data
export async function fetchHandler<T>(
  url: string,
  options: FetchOptions = {}
): Promise<ActionResponse<T>> {
  const {
    timeout = 100000,
    headers: customHeaders = {},
    ...restOptions
  } = options;

  const controller = new AbortController(); // create an AbortController to handle timeouts
  const id = setTimeout(() => controller.abort(), timeout); // set a timeout to abort the request

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const headers: HeadersInit = { ...defaultHeaders, ...customHeaders };
  const config: RequestInit = {
    ...restOptions,
    headers,
    signal: controller.signal, // attach the signal to the request to enable aborting
  };

  try {
    const response = await fetch(url, config);

    clearTimeout(id);

    if (!response.ok) {
      throw new RequestError(response.status, `HTTP error: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    const error = isError(err) ? err : new Error("Unknown error");

    if (error.name === "AbortError") {
      logger.warn(`Request to ${url} timed out`);
    } else {
      logger.error(`Error fetching ${url}: ${error.message}`);
    }

    return handleError(error) as ActionResponse<T>; // return a structured error response
  }
}