'use server'

import { ZodSchema,ZodError } from "zod";
import { Session } from "next-auth";
import { UnauthorizedError,ValidationError } from "../http-errors";
import dbConnect from "../mongoose";
import { auth } from "@/auth";
// t means generic type that will be used to type the params and schema
type ActionOptions<T> = {
  params?: T;
  schema?: ZodSchema<T>;
  authorize?: boolean;
};

// 1. Checking whether the schema and params are provided and validated.
// 2. Checking whether the user is authorized.
// 3. Connecting to the database.
// 4. Returning the params and session.


async function action<T>({
  params,
  schema,
  authorize = false,
}: ActionOptions<T>) {
  if (schema && params) {
    try {
        //  validate params against the schema
      schema.parse(params);
    } catch (error) {
      if (error instanceof ZodError) {
        return new ValidationError(
          error.flatten().fieldErrors as Record<string, string[]>
        );
      } else {
        return new Error("Schema validation failed");
      }
    }
  }

//   generate new session if authorize is true
  let session: Session | null = null;

  if (authorize) {
    session = await auth(); // get the current session to check if user is logged in

    if (!session) {
      return new UnauthorizedError(); 
    }
  }

  await dbConnect();

  return { params, session };
}

export default action;