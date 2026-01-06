"use server";

import Question, { IQuestionModel } from "@/database/question.model";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { AskQuestionSchema, EditQuestionSchema, GetQuestionSchema } from "../validations";
import mongoose from "mongoose";
import { after } from "next/server";
import TagQuestion from "@/database/tag-question.model";
import Tag, { ITag } from "@/database/tag.model";
import { cache } from "react";
// cache for get question it improves performance by storing results of previous fetches

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

// edit question
export async function editQuestion(
  params: EditQuestionParams
): Promise<ActionResponse<IQuestionModel>> {
  const validationResult = await action({
    params,
    schema: EditQuestionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { title, content, tags, questionId } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  // sesssion for to handle multiple operations atomically
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Fetch the question to be edited
    // populate tags to compare existing ones 
    // with populate it fetches full tag documents instead of just ids
    const question = await Question.findById(questionId).populate("tags");
    if (!question) throw new Error("Question not found");

    if (question.author.toString() !== userId) {
      throw new Error("You are not authorized to edit this question");
    }

    // Update title and content if they have changed
    if (question.title !== title || question.content !== content) {
      question.title = title;
      question.content = content;
      await question.save({ session });
    }

    // Determine tags to add and remove
    const tagsToAdd = tags.filter(
      (tag) =>
        // check if tag is not already associated with the question
      // some method checks if any existing tag matches the new tag (case insensitive)
        !question.tags.some(
          (t: ITag) => t.name.toLowerCase() === tag.toLowerCase()
        )
    );

    const tagsToRemove = question.tags.filter(
      (tag: ITag) =>
        !tags.some((t) => t.toLowerCase() === tag.name.toLowerCase())
    );

    // Add new tags
    const newTagDocuments = [];
    // Add tags the for loop to handle multiple tags
    // upsert each tag and create TagQuestion relationship
    if (tagsToAdd.length > 0) {
      for (const tag of tagsToAdd) {
        const newTag = await Tag.findOneAndUpdate(
          { name: { $regex: `^${tag}$`, $options: "i" } },
          { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
          { upsert: true, new: true, session }
        );

        if (newTag) {
          newTagDocuments.push({ tag: newTag._id, question: questionId });
          question.tags.push(newTag._id);
        }
      }
    }

    // Remove tags
    if (tagsToRemove.length > 0) {
      console.log(tagsToRemove,'tags to remove');
      const tagIdsToRemove = tagsToRemove.map((tag: ITag) => tag._id);

      await Tag.updateMany(
        { _id: { $in: tagIdsToRemove } },
        { $inc: { questions: -1 } },
        { session }
      );

      await TagQuestion.deleteMany(
        { tag: { $in: tagIdsToRemove }, question: questionId },
        { session }
      );

      // Update question's tags array to remove the disassociated tags
      question.tags = question.tags.filter(
        (tag: mongoose.Types.ObjectId) =>
          !tagIdsToRemove.some((id: mongoose.Types.ObjectId) =>
            id.equals(tag._id)
          )
      );
    }

    // Insert new TagQuestion documents
    if (newTagDocuments.length > 0) {
      await TagQuestion.insertMany(newTagDocuments, { session });
    }

    // Save the updated question
    await question.save({ session });
    await session.commitTransaction();

    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}


// get question
// using cache to improve performance 
// it stores results of previous fetches
export const getQuestion = cache(async function getQuestion(
  params: GetQuestionParams
): Promise<ActionResponse<Question>> {
  const validationResult = await action({
    params,
    schema: GetQuestionSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId } = validationResult.params!;

  try {
    const question = await Question.findById(questionId)
      .populate("tags", "_id name")
      .populate("author", "_id name image");

    if (!question) throw new Error("Question not found");

    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
});