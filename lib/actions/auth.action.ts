"use server";
import User from "@/database/user.model";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { SignInSchema, SignUpSchema } from "../validations";
import mongoose from "mongoose";
import Account from "@/database/account.model";
import bcrypt from "bcrypt";
import { NotFoundError } from "../http-errors";
import { signIn } from "@/auth";

export async function signUpWithCredentials(
  params: AuthCredentials
): Promise<ActionResponse> {
  //  validate params using action utility with SignUpSchema for validation
  const validationResult = await action({
    params,
    schema: SignUpSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { name, username, email, password } = validationResult.params!;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingUser = await User.findOne({ email }).session(session);

    if (existingUser) {
      throw new Error("User already exists");
    }

    const existingUsername = await User.findOne({ username }).session(session);

    if (existingUsername) {
      throw new Error("Username already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    // why the array syntax - to ensure the operation is part of the transaction
    // if we dont use array syntax and create multiple users at the same time with same email or username
    // there could be race condition leading to duplicate entries
    // using array syntax with session ensures uniqueness constraints are respected
    // it will return an array of created users
    // it s look  like this because mongoose create method can create multiple documents at once
    // ex - User.create([{},{},{}]) you get back an array of created users like [user1,user2,user3]
    const [newUser] = await User.create([{ username, name, email }], {
      session,
    });
    // it will ret

    await Account.create(
      [
        {
          userId: newUser._id,
          name,
          provider: "credentials",
          providerAccountId: email,
          password: hashedPassword,
        },
      ],
      { session }
    );
    await session.commitTransaction();

    await signIn("credentials", { email, password, redirect: false });

    return { success: true };
  } catch (error) {
    await session.abortTransaction();

    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

// sign in with credentials
export async function signInWithCredentials(
  params: Pick<AuthCredentials, "email" | "password">
): Promise<ActionResponse> {
  const validationResult = await action({ params, schema: SignInSchema });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { email, password } = validationResult.params!;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) throw new NotFoundError("User");

    const existingAccount = await Account.findOne({
      provider: "credentials",
      providerAccountId: email,
    });

    if (!existingAccount) throw new NotFoundError("Account");

    const passwordMatch = await bcrypt.compare(
      password,
      existingAccount.password
    );

    if (!passwordMatch) throw new Error("Password does not match");

    await signIn("credentials", { email, password, redirect: false });

    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
