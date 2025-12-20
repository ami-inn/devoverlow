"use client";
import AuthForm from "@/components/forms/AuthForm";
import { signInSchema } from "@/lib/validations";

const SignIn = () => {
  return (
    <div>
      <AuthForm
        formType="sign-in"
        schema={signInSchema}
        defaultValues={{ email: "", password: "" }}
        onSubmit={(data) => Promise.resolve({ success: true, data })}
      />
    </div>
  );
};

export default SignIn;
