"use client";
import AuthForm from "@/components/forms/AuthForm";
import { signUpSchema } from "@/lib/validations";


const Signup = () => {
  return (
    <div>
      <AuthForm
        formType="signup"
        schema={signUpSchema}
        defaultValues={{ email: "", password: "",name: "", username: "", confirmPassword: "" }}
        onSubmit={(data) => Promise.resolve({ success: true, data })}
      />
    </div>
  );
};

export default Signup;
