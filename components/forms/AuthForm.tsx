"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";
import ROUTES from "@/constants/routes";

interface AuthFormProps<T extends FieldValues> {
  formType: "sign-in" | "signup";
  schema: z.ZodType<T>;
  defaultValues: DefaultValues<T>;
  onSubmit: SubmitHandler<T>;
}

const AuthForm = <T extends FieldValues>({
  formType,
  schema,
  defaultValues,
  onSubmit,
}: AuthFormProps<T>) => {
  const form = useForm<T>({
    // @ts-expect-error - Generic ZodType causes resolver type mismatch
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleFormSubmit: SubmitHandler<T> = async (data) => {
    try {
      await onSubmit(data);
      toast.success(
        formType === "signup" ? "Signup Successful" : "Sign-In Successful"
      );
    } catch (error) {
      toast.error("Authentication Error", {
        description: "Failed to authenticate. Please try again.",
      });
    }
  };

   const buttonText = formType === "sign-in" ? "Sign In" : "Sign Up";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit as any)}
         className="mt-10 space-y-6"
      >
        {Object.keys(defaultValues).map((key) => (
          <FormField
            key={key}
            control={form.control as any}
            name={key as Path<T>}
            render={({ field }) => (
              <FormItem  className="flex w-full flex-col gap-2.5" >
                <FormLabel className="paragraph-medium text-dark400_light700">
                  {key.replace(/([A-Z])/g, " $1")}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type={
                      key.toLowerCase().includes("password")
                        ? "password"
                        : "text"
                    }
                    className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 no-focus min-h-12 rounded-1.5 border"
                    placeholder={`Enter your ${key}`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <Button type="submit"
         className="primary-gradient cursor-pointer paragraph-medium min-h-12 w-full rounded-2 px-4 py-3 font-inter !text-light-900"
        >
            {form.formState.isSubmitting
            ? buttonText === "Sign In"
              ? "Signin In..."
              : "Signing Up..."
            : buttonText}
        </Button>
           {formType === "sign-in" ? (
          <p>
            Don&apos;t have an account?{" "}
            <Link
              href={ROUTES.SIGN_UP}
              className="paragraph-semibold primary-text-gradient"
            >
              Sign up
            </Link>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <Link
              href={ROUTES.SIGN_IN}
              className="paragraph-semibold primary-text-gradient"
            >
              Sign in
            </Link>
          </p>
        )}
      </form>
    </Form>
  );
};

export default AuthForm;
