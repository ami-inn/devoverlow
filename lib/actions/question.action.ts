"use server";

import Question from "@/database/question.model";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { AskQuestionSchema } from "../validations";
import mongoose from "mongoose";
import { after } from "next/server";
import TagQuestion from "@/database/tag-question.model";
import Tag from "@/database/tag.model";

export async function createQuestion(
  params: CreateQuestionParams
): Promise<ActionResponse<Question>> {
  const validationResult = await action({
    params,
    schema: AskQuestionSchema,
    authorize: true,
  });
  console.log(validationResult,'validation result in create question');
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { title, content, tags } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    //  to create question
    const [question] = await Question.create(
      [{ title, content, author: userId }],
      { session }
    );

    if (!question) throw new Error("Failed to create the question");

    // get access to tagids
    const tagIds: mongoose.Types.ObjectId[] = [];
    const tagQuestionDocuments = []; // to hold tag-question relationships

    // process tags
    for (const tag of tags) {
      //  upsert tag and get its id
      //   if tag doesnt exist create it else update questions count
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $inc: { questions: 1 } }, // increment questions count
        { upsert: true, new: true, session }
      );

      //    collect tag id and prepare tag-question relationship
      tagIds.push(existingTag._id);
      //   prepare tag-question relationship
      tagQuestionDocuments.push({
        tag: existingTag._id,
        question: question._id,
      });
    }

    // insert tag-question relationships 
    // bulk insert for efficiency
    // we insert all at once instead of one by one
    await TagQuestion.insertMany(tagQuestionDocuments, { session });

    // update question with tag ids
    // update the question to include tag references
    await Question.findByIdAndUpdate(
      question._id,
      { $push: { tags: { $each: tagIds } } },
      { session }
    );

    // log the interaction
    // log the interaction
    // after(async () => {
    //   await createInteraction({
    //     action: "post",
    //     actionId: question._id.toString(),
    //     actionTarget: "question",
    //     authorId: userId as string,
    //   });
    // });

    await session.commitTransaction();

    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}
