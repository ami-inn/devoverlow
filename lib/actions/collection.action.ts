"use server";

import mongoose, { PipelineStage } from "mongoose";
import { revalidatePath } from "next/cache";

import ROUTES from "@/constants/routes";
import { Collection, Question } from "@/database";

import action from "../handlers/action";
import handleError from "../handlers/error";
import {
  CollectionBaseSchema,
  PaginatedSearchParamsSchema,
} from "../validations";

export async function toggleSaveQuestion(
  params: CollectionBaseParams
): Promise<ActionResponse<{ saved: boolean }>> {
  const validationResult = await action({
    params,
    schema: CollectionBaseSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  try {
    const question = await Question.findById(questionId);
    if (!question) throw new Error("Question not found");

    const collection = await Collection.findOne({
      question: questionId,
      author: userId,
    });

    if (collection) {
      await Collection.findByIdAndDelete(collection._id);

      revalidatePath(ROUTES.QUESTION(questionId));

      return {
        success: true,
        data: {
          saved: false,
        },
      };
    }

    await Collection.create({
      question: questionId,
      author: userId,
    });

    revalidatePath(ROUTES.QUESTION(questionId));

    return {
      success: true,
      data: {
        saved: true,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function hasSavedQuestion(
  params: CollectionBaseParams
): Promise<ActionResponse<{ saved: boolean }>> {
  const validationResult = await action({
    params,
    schema: CollectionBaseSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  try {
    const collection = await Collection.findOne({
      question: questionId,
      author: userId,
    });

    return {
      success: true,
      data: {
        saved: !!collection,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getSavedQuestions(
  params: PaginatedSearchParams
): Promise<ActionResponse<{ collection: Collection[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const userId = validationResult.session?.user?.id;
  const { page = 1, pageSize = 10, query, filter } = params;

  const skip = (Number(page) - 1) * pageSize;
  const limit = pageSize;

  const sortOptions: Record<string, Record<string, 1 | -1>> = {
    mostrecent: { "question.createdAt": -1 },
    oldest: { "question.createdAt": 1 },
    mostvoted: { "question.upvotes": -1 },
    mostviewed: { "question.views": -1 },
    mostanswered: { "question.answers": -1 },
  };

  const sortCriteria = sortOptions[filter as keyof typeof sortOptions] || {
    "question.createdAt": -1,
  }; // default sorting by most recent sortoption is determined by the filter query parameter, if it's not provided or doesn't match any of the predefined options, it defaults to sorting by most recent questions

  try {
    // pipeline is constructed to fetch the user's saved questions along with the necessary data for each question, such as the author and tags, and also applies the search query if provided, allowing users to search within their saved questions based on keywords in the title or content, this way we can efficiently retrieve and display the user's saved questions with all the relevant information and filtering capabilities in place
    // aggregation pipeline is used to perform a more complex query that involves joining the Collection documents with the related Question, User, and Tag documents, and also allows for filtering based on the search query, this way we can retrieve all the necessary data for displaying the saved questions in one query, improving performance and enabling features like searching and sorting within the user's saved questions
    const pipeline: PipelineStage[] = [
      { $match: { author: new mongoose.Types.ObjectId(userId) } }, // we start by matching the Collection documents that belong to the current user, this ensures that we only retrieve the saved questions for the logged-in user
      {
        // next, we perform a $lookup to join the Collection documents with the related Question documents based on the questionId, this allows us to retrieve the details of each saved question, such as the title, content, author, tags, etc., which are necessary for displaying the saved questions in the UI
        $lookup: {
          from: "questions", // we specify the collection to join with, in this case, it's the "questions" collection where the question documents are stored
          localField: "question", // we specify the local field in the Collection documents that contains the reference to the question, this is typically the ObjectId of the question that was saved by the user
          foreignField: "_id", // we specify the foreign field in the Question documents that corresponds to the local field, this is usually the _id field of the question document, which is being referenced in the Collection document
          as: "question",   // we specify the name of the field in the resulting documents where the joined Question data will be stored, after the $lookup stage, each Collection document will have a new field called "question" that contains an array of matching Question documents (in this case, it should contain only one question since it's a one-to-one relationship), this allows us to access the details of the saved question in the subsequent stages of the aggregation pipeline and ultimately when we return the data to the client for rendering the saved questions list
        },
      },
      { $unwind: "$question" }, // since the $lookup returns an array of matching documents, we use $unwind to deconstruct the array and work with individual question documents in the subsequent stages of the pipeline
      {
        $lookup: { // we perform another $lookup to join the question's author field with the User collection to retrieve the author's details, this allows us to display information about the author of each saved question, such as their name and avatar, in the UI
          from: "users",
          localField: "question.author",
          foreignField: "_id",
          as: "question.author",
        },
      },
      { $unwind: "$question.author" }, // again, we use $unwind to deconstruct the array of matching author documents so that we can work with individual author details for each question in the subsequent stages of the pipeline
      {
        $lookup: { // we perform a final $lookup to join the question's tags field with the Tag collection to retrieve the details of each tag associated with the question, this allows us to display the tags for each saved question in the UI, providing additional context and categorization for the questions
          from: "tags",
          localField: "question.tags",
          foreignField: "_id",
          as: "question.tags",
        },
      },
    ];
    // it will return the total count of saved questions for the user, which is used to determine if there are more questions to load for pagination purposes, this way we can efficiently manage the pagination of the saved questions list and provide a better user experience when navigating through their saved questions

    // this operation is performed at the end of the pipeline after all the necessary data has been joined and filtered, so we can apply the search query to the question's title and content fields, allowing users to search within their saved questions based on keywords in the title or content
    // if the query parameter is provided, we add a $match stage to the aggregation pipeline that filters the results based on whether the question's title or content contains the search query, using a case-insensitive regular expression match ($regex with $options: "i"), this allows users to find saved questions that are relevant to their search terms, improving the usability of the saved questions feature

    if (query) {
        // if a search query is provided, we add a $match stage to the aggregation pipeline to filter the saved questions based on whether the question's title or content contains the search query, this allows users to search within their saved questions and find relevant results based on keywords in the title or content of the questions, enhancing the user experience by enabling them to quickly locate specific saved questions that match their interests or needs
      pipeline.push({
        $match: {
          $or: [
            { "question.title": { $regex: query, $options: "i" } }, // we use a case-insensitive regular expression match to filter questions where the title contains the search query, this allows users to find saved questions that are relevant to their search terms based on the question titles
            { "question.content": { $regex: query, $options: "i" } },
          ],
        },
      });
    }

    const [totalCount] = await Collection.aggregate([
      ...pipeline,
      { $count: "count" },
    ]); // we execute the aggregation pipeline with an additional $count stage at the end to get the total count of saved questions that match the criteria, this is important for implementing pagination on the client side, as it allows us to determine if there are more questions to load (isNext) based on whether the total count exceeds the number of questions already loaded (skip + questions.length)

    pipeline.push({ $sort: sortCriteria }, { $skip: skip }, { $limit: limit });
    pipeline.push({ $project: { question: 1, author: 1 } }); // we use $project to specify which fields we want to include in the final output of the aggregation, in this case, we only include the question and author fields from the Collection documents, this helps to optimize the query by only returning the necessary data for displaying the saved questions list, and it also allows us to structure the output in a way that is convenient for the client to consume when rendering the saved questions in the UI

    const questions = await Collection.aggregate(pipeline);

    

    const isNext = totalCount.count > skip + questions.length;

    return {
      success: true,
      data: {
        collection: JSON.parse(JSON.stringify(questions)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
