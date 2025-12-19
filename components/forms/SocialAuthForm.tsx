"use client";

import { Button } from "../ui/button";
import Image from "next/image";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import ROUTES from "@/constants/routes";

// if you are using server side imporrt signIn from @/auth
// then use the form below to handle sign in
// import { signIn } from "@/auth";
// <form action = {async() => { await signIn("github", {callbackUrl: ROUTES.HOME})}>
// <Button type="submit">Sign in with GitHub</Button>
// </form>

const SocialAuthForm = () => {
  const buttonClass =
    "background-dark400_light900 body-medium rounded-2 text-dark200_light800 min-h-12 flex-1 px-4 py-3.5";

  const handleSignin = async (provider: "github" | "google") => {
    try {
      await signIn(provider, { callbackUrl: ROUTES.HOME });
    } catch (error) {
      console.log("Error during sign-in:", error);
      toast.error("Sign-In Error", {
        description: "Failed to sign in. Please try again.",
      });
    }
  };
  return (
    <div className="mt-10 flex flex-wrap gap-2.5">
      <Button className={buttonClass} onClick={() => handleSignin("github")}>
        <Image
          src={"/icons/github.svg"}
          width={20}
          height={20}
          alt="github icon"
          className="invert-colors mr-2.5 object-contain"
        />
        <span>Login with GitHub</span>
      </Button>

      <Button className={buttonClass} onClick={() => handleSignin("google")}>
        <Image
          src={"/icons/google.svg"}
          width={20}
          height={20}
          alt="google icon"
          className=" mr-2.5 object-contain"
        />
        <span>Login with Google</span>
      </Button>
    </div>
  );
};

export default SocialAuthForm;
