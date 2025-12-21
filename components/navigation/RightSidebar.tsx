import ROUTES from "@/constants/routes";
import Image from "next/image";
import Link from "next/link";
import TagCard from "../cards/TagCard";

const RightSidebar = () => {
  const hotQuestions = [
    {
      _id: "1",
      title: "How to create a custom hook in React?",
    },
    {
      _id: "2",
      title: "What is the difference between useState and useReducer?",
    },
    {
      _id: "3",
      title: "How to optimize React component performance?",
    },
    {
      _id: "4",
      title: "What are React Suspense and lazy loading?",
    },
    {
      _id: "5",
      title: "How to handle form validation in React?",
    },
    {
      _id: "6",
      title: "What is the Context API and when should I use it?",
    },
  ];

  const tags = [
    {
      _id: "1",
      name: "react",
      questions: 1200,
    },
    {
      _id: "2",
      name: "javascript",
      questions: 950,
    },
    {
      _id: "3",
      name: "typescript",
      questions: 800,
    },
    {
      _id: "4",
      name: "nextjs",
      questions: 600,
    },
    {
      _id: "5",
      name: "web-development",
      questions: 450,
    },
  ];  

  return (
    <section className="pt-36 custom-scrollbar background-light900_dark200 light-border sticky right-0 top-0 flex h-screen  w-[350px] flex-col gap-6 overflow-auto border-l p-6 shadow-light-300 dark:shadow-none  max-xl:hidden">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>

        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {hotQuestions.map((question) => (
            <Link
              key={question._id}
              href={ROUTES.QUESTION(question._id)}
              className="flex cursor-pointer items-center justify-between gap-7"
            >
              <p className="body-medium text-dark500_light700 line-clamp-2">
                {question.title}
              </p>

              <Image
                src="/icons/chevron-right.svg"
                alt="Chevron"
                width={20}
                height={20}
                className="invert-colors"
              />
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>

        <div className="mt-7 flex flex-col gap-4">
          {tags.map(({ _id, name, questions }) => (
            <TagCard
              key={_id}
              _id={_id}
              name={name}
              questions={questions}
              showCount
              compact
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
