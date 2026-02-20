"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { use, useState } from "react";


import { createVote } from "@/lib/actions/vote.action";
import { formatNumber } from "@/lib/utils";

interface Params {
  targetType: "question" | "answer";
  targetId: string;
  upvotes: number;
  downvotes: number;
  hasVotedPromise: Promise<ActionResponse<HasVotedResponse>>;
}

const Votes = ({
  upvotes,
  downvotes,
  hasVotedPromise,
  targetId,
  targetType,
}: Params) => {
  const session = useSession();
  const userId = session.data?.user?.id;
  console.log(targetId, targetType, upvotes, downvotes, hasVotedPromise,'djfklasfjdkl');

  const { success, data } = use(hasVotedPromise); // use hook to unwrap the promise and get the hasVoted data, we can use this data to determine whether to show the upvoted/downvoted icons and to handle vote toggling logic in handleVote function
//  the advantage of passing the hasVotedPromise from the parent component is that we can fetch the hasVoted data in parallel with other data fetching in the parent component (like fetching question and answers data), this way we don't have to wait for the hasVoted check to complete before showing the question content, and we can show a loading state for the vote buttons until we get the hasVoted data, which can improve the overall user experience by reducing the perceived loading time of the page
  const [isLoading, setIsLoading] = useState(false);

  const { hasUpvoted, hasDownvoted } = data || {};

  const handleVote = async (voteType: "upvote" | "downvote") => {
    if (!userId)
    //   return toast({
    //     title: "Please login to vote",
    //     description: "Only logged-in users can vote.",
    //   });

    setIsLoading(true);

    try {
      const result = await createVote({
        targetId,
        targetType,
        voteType,
      });

      if (!result.success) {
        // return toast({
        //   title: "Failed to vote",
        //   description: result.error?.message,
        //   variant: "destructive",
        // });
      }

      const successMessage =
        voteType === "upvote"
          ? `Upvote ${!hasUpvoted ? "added" : "removed"} successfully`
          : `Downvote ${!hasDownvoted ? "added" : "removed"} successfully`;

    //   toast({
    //     title: successMessage,
    //     description: "Your vote has been recorded.",
    //   });
    } catch {
    //   toast({
    //     title: "Failed to vote",
    //     description: "An error occurred while voting. Please try again later.",
    //     variant: "destructive",
    //   });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-center gap-2.5">
      <div className="flex-center gap-1.5">
        <Image
          src={
            success && hasUpvoted ? "/icons/upvoted.svg" : "/icons/upvote.svg"
          }
          width={18}
          height={18}
          alt="upvote"
          className={`cursor-pointer ${isLoading && "opacity-50"}`}
          aria-label="Upvote"
          onClick={() => !isLoading && handleVote("upvote")}
        />

        <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
          <p className="subtle-medium text-dark400_light900">
            {formatNumber(upvotes)}
          </p>
        </div>
      </div>

      <div className="flex-center gap-1.5">
        <Image
          src={
            success && hasDownvoted
              ? "/icons/downvoted.svg"
              : "/icons/downvote.svg"
          }
          width={18}
          height={18}
          alt="downvote"
          className={`cursor-pointer ${isLoading && "opacity-50"}`}
          aria-label="Downvote"
          onClick={() => !isLoading && handleVote("downvote")}
        />

        <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
          <p className="subtle-medium text-dark400_light900">
            {formatNumber(downvotes)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Votes;