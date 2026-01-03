"use client";
import AuthForm from "@/components/forms/AuthForm";
import { signInWithCredentials } from "@/lib/actions/auth.action";
import { SignInSchema } from "@/lib/validations";

const SignIn = () => {
  return (
    <div>
      <AuthForm
        formType="sign-in"
        schema={SignInSchema}
        defaultValues={{ email: "", password: "" }}
        onSubmit={signInWithCredentials}
      />
    </div>
  );
};

export default SignIn;
