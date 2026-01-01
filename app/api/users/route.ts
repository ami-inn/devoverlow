import User from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validations";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await dbConnect();
    const users = await User.find();
    return NextResponse.json(
      {
        success: true,
        data: users,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
};

// create new user
export const POST = async (request: Request) => {
  try {
    await dbConnect();
    const body = await request.json();
    const validatedData = UserSchema.safeParse(body);
    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors); // throw validation error with details
    }
    const {email,username} = validatedData.data;
    const existingUser = await User.findOne({ $or: [ { email }, { username } ] });
    if (existingUser) {
      throw new Error('User with the same email or username already exists');
    }
    const newUser = await User.create(validatedData.data);

    return NextResponse.json(
      {
        success: true,
        data: newUser,
      },
      { status: 201 }
    );


  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
};
