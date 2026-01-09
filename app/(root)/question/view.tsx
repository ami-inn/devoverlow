'use client';
import { incrementViews } from "@/lib/actions/question.action";
import React, { useEffect } from "react";
import { toast } from "sonner";


// import this component and we can increment the count
// client side question view update
// for testing conly

const view = ({ questionId }: { questionId: string }) => {
  const handleIncrement = async () => {
    const result = await incrementViews({ questionId });
    if (result.success) {
      toast.success("View count incremented");
    } else {
      toast.error("Failed to increment view count");
    }
  };

  useEffect(() => {
    handleIncrement();
  }, []);
  return null;
};

export default view;

// first refresh the count will be zero to be one on two refresh
// need to refresh one more time to see the incremented view count
// initial page load - when a user visit the question details page, the server renders the page 
//  with the current view count from the database. this is because the page is a server component so its getting executed right on the server


// view count increment - after the page is loaded a setver action is called to increment the view count in the db
// this server action is called from the client side meaning only after the page has been rendered dom has been created and a client call is made through useeffect

// state dta issue: the problem arises because the page was rendered and served to the client before the view count was incrementd . this means that user doesnt see the updated view count immediately

// delayed update - thus the user would only see the updated view count if they navigate away and then return to the page or if they refresh the page again after the view count has been incremented in the db


// solution
// after the question updte we can revalidatepath to fetch the updated view count and re render the page with the latest data on the question.action
// its not good approach

// ideal approach

// call the view increment server action from the server component directly during the initial page render
// this way the view count is incremented before the page is rendered and served to the client ensuring that the user always sees the most up to date view count without needing to refresh or navigate away
// use after function from next/navigation to call the server action and wait for it to complete before rendering the page