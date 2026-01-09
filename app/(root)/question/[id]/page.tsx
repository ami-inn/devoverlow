import TagCard from "@/components/cards/TagCard";
import { Preview } from "@/components/editor/Preview";
import AnswerForm from "@/components/forms/AnswerForm";
import Metric from "@/components/Metric";
import UserAvatar from "@/components/UserAvatar";
import ROUTES from "@/constants/routes";
import { getQuestion, incrementViews } from "@/lib/actions/question.action";
import { formatNumber, getTimeStamp } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { after } from "next/server";

// const sampleQuestion = {
//   _id: "question_id_123",
//   title: "How to implement authentication in Next.js?",
//   content: `
//   ### Question

//   I'm building a web application using Next.js and I need to implement user authentication. What are the best practices for handling authentication in a Next.js app? Should I use JWTs, sessions, or some other method? Also, how can I securely store user credentials and manage user sessions?

//   ### Details

//   - I want to allow users to sign up, log in, and log out.
//   - The app should have protected routes that only authenticated users can access.
//   - I'm considering using third-party services like Auth0 or Firebase Authentication, but I'm open to other suggestions.

//   ### What I've Tried

//   So far, I've looked into using JWTs stored in HTTP-only cookies for authentication. However, I'm unsure about the security implications and how to handle token refreshes. Any guidance or code examples would be greatly appreciated!

//   ### Additional Context

//   The application is built with Next.js 13 using the App Router. I'm also using MongoDB as my database
//   for storing user data.
//   `,
//   createdAt: "2024-01-15T10:00:00Z",
//   upvotes: 25,
//   downvotes: 3,
//   views: 150,
//   answers: 5,
//   tags: [
//     { _id: "tag1", name: "Next.js" },
//     { _id: "tag2", name: "Authentication" },
//     { _id: "tag3", name: "Web Development" },
//   ],
//   author: {
//     _id: "author_id_456",
//     name: "Jane Doe",
//     image: "",
//   },
// };

export async function generateMetadata({
  params,
}: RouteParams): Promise<Metadata> {
  const { id } = await params;

  const { success, data: question } = await getQuestion({ questionId: id });

  if (!success || !question) {
    return {
      title: "Question not found",
      description: "This question does not exist.",
    };
  }

  return {
    title: question.title,
    description: question.content.slice(0, 100),
    twitter: {
      card: "summary_large_image",
      title: question.title,
      description: question.content.slice(0, 100),
    },
  };
}

const Question = async ({ params, searchParams }: RouteParams) => {
  const { id } = await params;
  // const { page, pageSize, filter } = await searchParams;
  // you can use promise.all to fetch multiple data in parallel if needed
  //  const something = await Promise.all([
  //   getQuestion({ questionId: id }),
  // incrementViews({ questionId: id }),
  // ])

  // the issues of promise all is that if one fails the whole thing fails
  // parellel fetching is good when you have independent data to fetch
  // blocking rendering slower request increase serverload error handling complexity like that issues still there

  const { success, data: question } = await getQuestion({ questionId: id });
  // after using the question data we can increment the views
  // after function from next/server helps to run code after the response is sent to the client
  // its part of middleware api but can be used in server components as well
  // it will not block the rendering of the page its mostly used for logging analytics or other non critical tasks that dont need to be completed before sending the response to the client
  // it runs asyunchronously after the response is sent so it wont affect the performance of the page load

  after(async () => {
    await incrementViews({ questionId: id });
  });
  if (!success || !question) return redirect("/404");

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between">
          <div className="flex items-center justify-start gap-1">
            <UserAvatar
              id={question.author._id}
              name={question.author.name}
              imageUrl={question.author.image}
              className="size-[22px]"
              fallbackClassName="text-[10px]"
            />
            <Link href={ROUTES.PROFILE(question.author._id)}>
              <p className="paragraph-semibold text-dark300_light700">
                {question.author.name}
              </p>
            </Link>
          </div>

          <div className="flex items-center justify-end gap-4">
            {/* <Suspense fallback={<div>Loading...</div>}>
              <Votes
                targetType="question"
                upvotes={question.upvotes}
                downvotes={question.downvotes}
                targetId={question._id}
                hasVotedPromise={hasVotedPromise}
              />
            </Suspense>

            <Suspense fallback={<div>Loading...</div>}>
              <SaveQuestion
                questionId={question._id}
                hasSavedQuestionPromise={hasSavedQuestionPromise}
              />
            </Suspense> */}
          </div>
        </div>

        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full">
          {question.title}
        </h2>
      </div>

      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imgUrl="/icons/clock.svg"
          alt="clock icon"
          value={` asked ${getTimeStamp(new Date(question.createdAt))}`}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
        <Metric
          imgUrl="/icons/message.svg"
          alt="message icon"
          value={question.answers.toString()}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
        <Metric
          imgUrl="/icons/eye.svg"
          alt="eye icon"
          value={formatNumber(question.views)}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
      </div>

      <Preview content={question.content} />

      <div className="mt-8 flex flex-wrap gap-2">
        {question.tags.map((tag: Tag) => (
          <TagCard
            key={tag._id}
            _id={tag._id as string}
            name={tag.name}
            compact
          />
        ))}
      </div>

      <section className="my-5 ">
        {/* <AllAnswers
          page={Number(page) || 1}
          isNext={answersResult?.isNext || false}
          data={answersResult?.answers}
          success={areAnswersLoaded}
          error={answersError}
          totalAnswers={answersResult?.totalAnswers || 0}
        /> */}
      </section>

      <section className="my-5">
        <AnswerForm
          questionId={question._id}
          questionTitle={question.title}
          questionContent={question.content}
        />
      </section>
    </>
  );
};

export default Question;
