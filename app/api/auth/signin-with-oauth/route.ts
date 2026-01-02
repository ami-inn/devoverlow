import Account from "@/database/account.model";
import User from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { SignInWithOAuthSchema } from "@/lib/validations";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import slugify from "slugify";

export async function POST(req: Request) {
  const { provider, providerAccountId, user } = await req.json();
  await dbConnect();

  const session = await mongoose.startSession(); // start a mongoose session
  //    allowing multiple operations to be executed as a single transaction
  session.startTransaction(); // start a transaction within the session

  //    if we try to create an account - fails
  // we try to create a user - fails
  // we try to commit the transaction - fails
  // all operations are rolled back ensuring data consistency
  //   its called atomic functions

  try {
    const validatedData = SignInWithOAuthSchema.safeParse({
      provider,
      providerAccountId,
      user,
    });

    if (!validatedData.success)
      throw new ValidationError(validatedData.error.flatten().fieldErrors);

    const { name, username, email, image } = user;
    const slugifiedUsername = slugify(username, {
      lower: true,
      strict: true,
      trim: true,
    });

    let existingUser = await User.findOne({ email }).session(session);

    // if user does not exist create new use
    if (!existingUser) {
      // re initialize existingUser to the newly created user
      [existingUser] = await User.create(
        [{ name, username: slugifiedUsername, email, image }],
        { session } // pass the session to ensure the operation is part of the transaction
      );
    } else {
      const updatedData: { name?: string; image?: string } = {}; // if user signed diff oauth provider update name and image

      if (existingUser.name !== name) updatedData.name = name;
      if (existingUser.image !== image) updatedData.image = image;

      if (Object.keys(updatedData).length > 0) {
        await User.updateOne(
          { _id: existingUser._id },
          { $set: updatedData }
        ).session(session);
      }
    }

    // check if account already exists
    const existingAccount = await Account.findOne({
      userId: existingUser._id,
      provider,
      providerAccountId,
    }).session(session);

    // if account does not exist create new account
    if (!existingAccount) {
      await Account.create(
        [
          {
            userId: existingUser._id,
            name,
            image,
            provider,
            providerAccountId,
          },
        ],
        { session }
      );
    }

    await session.commitTransaction();

    return NextResponse.json({ success: true });
  } catch (error) {
    await session.abortTransaction();
    return handleError(error, "api") as APIErrorResponse;
  } finally {
    session.endSession();
  }
}



//  what the post request does
// 1. connects to the database
// 2. starts a mongoose session and transaction
// 3. validates the incoming data
// 4. checks if user exists based on email
// 5. if user does not exist creates a new user
// 6. if user exists updates name and image if they differ from existing data
// 7. checks if account exists based on userId, provider, and providerAccountId
// 8. if account does not exist creates a new account
// 9. commits the transaction if all operations succeed
// 10. aborts the transaction and handles errors if any operation fails
// 11. ends the mongoose session
