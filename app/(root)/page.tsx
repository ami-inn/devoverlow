import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilter from "@/components/filters/HomeFilter";
import LocalSearch from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import Link from "next/link";
const questions = [
  {
    _id: "1",
    title: "How to center a div in CSS?",
    content:
      "I am trying to center a div both vertically and horizontally. What is the best way to do this?",
    tags: [
      { _id: "1", name: "css" },
      { _id: "2", name: "html" },
    ],
    author: { _id: "1", name: "John Doe", image: "", username: "" },
    upvotes: 10,
    downvotes: 0,
    answers: 20,
    views: 100,
    createdAt: new Date(),
  },
  {
    _id: "2",
    title: "What is the difference between let and var in JavaScript?",
    content:
      "Can someone explain the difference between let and var in JavaScript? When should I use one over the other?",
    tags: [
      { _id: "3", name: "javascript" },
      { _id: "4", name: "programming" },
    ],
    author: { _id: "2", name: "Jane Smith", image: "", username: "" },
    upvotes: 5,
    downvotes: 0,
    answers: 10,
    views: 50,
    createdAt: new Date(),
  },
  {
    _id: "3",
    title: "How to use async/await in JavaScript?",
    content:
      "I'm confused about how async/await works. Can someone provide a simple example?",
    tags: [
      { _id: "5", name: "javascript" },
      { _id: "6", name: "async" },
    ],
    author: { _id: "3", name: "Bob Johnson", image: "", username: "" },
    upvotes: 15,
    downvotes: 0,
    answers: 8,
    views: 120,
    createdAt: new Date(),
  },
  {
    _id: "4",
    title: "What are React hooks?",
    content:
      "I've heard about React hooks but don't understand what they are. Can someone explain?",
    tags: [
      { _id: "7", name: "react" },
      { _id: "8", name: "hooks" },
    ],
    author: { _id: "4", name: "Alice Brown", image: "", username: "" },
    upvotes: 25,
    downvotes: 0,
    answers: 15,
    views: 200,
    createdAt: new Date(),
  },
  {
    _id: "5",
    title: "How to deploy a Next.js app?",
    content:
      "What is the best way to deploy a Next.js application to production?",
    tags: [
      { _id: "9", name: "nextjs" },
      { _id: "10", name: "deployment" },
    ],
    author: { _id: "5", name: "Charlie Wilson", image: "", username: "" },
    upvotes: 30,
    downvotes: 0,
    answers: 12,
    views: 180,
    createdAt: new Date(),
  },
];
interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const Home = async ({ searchParams }: SearchParams) => {
  const { query = "", filter = "" } = await searchParams; // default to empty string if query is undefined

  const filteredQuestions = questions.filter((question) => {
    const matchesQuery = question.title
      .toLowerCase()
      .includes(query.toLowerCase());

    const matchesFilter = filter
      ? question.tags[0].name.toLowerCase() === filter.toLowerCase()
      : true;

    return matchesQuery && matchesFilter;
  });

  return (
    <>
      <section className="flex w-full flex-col-reverse sm:flex-row justify-between gap-4 sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Button
          className="primary-gradient min-h-[46px] px-4 py-3 text-light-900"
          asChild
        >
          <Link href={ROUTES.ASK_QUESTION}>Ask a Question</Link>
        </Button>
      </section>
      <section className="mt-11">
        <LocalSearch
          imgSrc="/icons/search.svg"
          placeholder="Search questions..."
          otherClasses="flex-1"
          route="/"
        />
      </section>

      <HomeFilter />

      <div className="mt-10 flex w-full flex-col gap-6">
        {filteredQuestions.map((question) => (
          <QuestionCard
            key={question._id}
            question={question}
            showActionBtns={false}
          />
        ))}
      </div>
    </>
  );
};

export default Home;
