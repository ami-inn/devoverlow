"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultValues, FieldValues, Path, useForm } from "react-hook-form";
import { ZodType } from "zod";
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

interface AuthFormProps<T extends FieldValues> {
  schema: ZodType<T>;
  formType: "sign-in" | "signup";
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: boolean }>;
}

const AuthForm = <T extends FieldValues>({
  formType,
  schema,
  defaultValues,
  onSubmit,
}: AuthFormProps<T>) => {
  const form = useForm<T>({
    // @ts-expect-error - zodResolver has issues with generic ZodType
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit = async (data: T) => {
    await onSubmit(data);
  };

  const buttonText = formType === "sign-in" ? "Sign In" : "Sign Up";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit as any)}
        className="space-y-8"
      >
        {Object.keys(defaultValues).map((fieldName) => (
          <FormField
            key={fieldName}
            control={form.control as any}
            name={fieldName as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="capitalize">{fieldName}</FormLabel>
                <FormControl>
                  <Input placeholder={`Enter your ${fieldName}`} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <Button type="submit">{buttonText}</Button>
      </form>
    </Form>
  );
};

export default AuthForm;
