import TagCard from "@/components/cards/TagCard";
import { Preview } from "@/components/editor/Preview";
import Metric from "@/components/Metric";
import UserAvatar from "@/components/UserAvatar";
import ROUTES from "@/constants/routes";
import { formatNumber, getTimeStamp } from "@/lib/utils";
import Link from "next/link";

const sampleQuestion = {
  _id: "question_id_123",
  title: "How to implement authentication in Next.js?",
  content: `
  ### Question
  
  I'm building a web application using Next.js and I need to implement user authentication. What are the best practices for handling authentication in a Next.js app? Should I use JWTs, sessions, or some other method? Also, how can I securely store user credentials and manage user sessions?
  
  ### Details
  
  - I want to allow users to sign up, log in, and log out.
  - The app should have protected routes that only authenticated users can access.
  - I'm considering using third-party services like Auth0 or Firebase Authentication, but I'm open to other suggestions.
  
  ### What I've Tried
  
  So far, I've looked into using JWTs stored in HTTP-only cookies for authentication. However, I'm unsure about the security implications and how to handle token refreshes. Any guidance or code examples would be greatly appreciated!
  
  ### Additional Context
  
  The application is built with Next.js 13 using the App Router. I'm also using MongoDB as my database
  for storing user data.
  `,
  createdAt: "2024-01-15T10:00:00Z",
  upvotes: 25,
  downvotes: 3,
  views: 150,
  answers: 5,
  tags: [
    { _id: "tag1", name: "Next.js" },
    { _id: "tag2", name: "Authentication" },
    { _id: "tag3", name: "Web Development" },
  ],
  author: {
    _id: "author_id_456",
    name: "Jane Doe",
    image: "",
  },
};

const Question = async ({ params }: RouteParams) => {
  const { id } = await params;

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between">
          <div className="flex items-center justify-start gap-1">
            <UserAvatar
              id={sampleQuestion.author._id}
              name={sampleQuestion.author.name}
              imageUrl={sampleQuestion.author.image}
              className="size-[22px]"
              fallbackClassName="text-[10px]"
            />
            <Link href={ROUTES.PROFILE(sampleQuestion.author._id)}>
              <p className="paragraph-semibold text-dark300_light700">
                {sampleQuestion.author.name}
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
          {sampleQuestion.title}
        </h2>
      </div>

      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imgUrl="/icons/clock.svg"
          alt="clock icon"
          value={` asked ${getTimeStamp(new Date(sampleQuestion.createdAt))}`}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
        <Metric
          imgUrl="/icons/message.svg"
          alt="message icon"
          value={sampleQuestion.answers.toString()}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
        <Metric
          imgUrl="/icons/eye.svg"
          alt="eye icon"
          value={formatNumber(sampleQuestion.views)}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
      </div>

      <Preview content={sampleQuestion.content} />

      <div className="mt-8 flex flex-wrap gap-2">
        {sampleQuestion.tags.map((tag: Tag) => (
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
        {/* <AnswerForm
          questionId={question._id}
          questionTitle={question.title}
          questionContent={question.content}
        /> */}
      </section>
    </>
  );
};

export default Question;
