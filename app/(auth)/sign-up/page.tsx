"use client";
import AuthForm from "@/components/forms/AuthForm";
import { signUpWithCredentials } from "@/lib/actions/auth.action";
import { SignUpSchema } from "@/lib/validations";

const Signup = () => {
  return (
    <div>
      <AuthForm
        formType="signup"
        schema={SignUpSchema}
        defaultValues={{
          name: "",
          username: "",
          email: "",
          password: "",
        }}
        onSubmit={signUpWithCredentials}
  
      />
    </div>
  );
};

export default Signup;
