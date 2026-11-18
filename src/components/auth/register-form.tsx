"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthCard } from "./auth-card";
import { Field, FormError } from "./field";
import { PasswordInput } from "./password-input";
import { useAuth } from "./auth-provider";
import { registerSchema, type RegisterValues } from "@/lib/auth/schemas";
import { authErrorMessage } from "@/lib/auth/types";
import { HOME_AFTER_LOGIN } from "@/lib/auth/constants";

export function RegisterForm() {
  const { register: signUp } = useAuth();
  const [redirecting, setRedirecting] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  async function onSubmit({ name, email, password }: RegisterValues) {
    try {
      await signUp({ name, email, password });
      setRedirecting(true);
      window.location.assign(HOME_AFTER_LOGIN);
    } catch (e) {
      setError("root", { message: authErrorMessage(e) });
    }
  }

  const busy = isSubmitting || redirecting;

  return (
    <AuthCard
      title="Create your account"
      description="Summarize any public GitHub repository in seconds."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <FormError message={errors.root?.message} />

        <Field label="Full name" error={errors.name?.message}>
          {({ id, describedBy, invalid }) => (
            <Input
              {...register("name")}
              id={id}
              autoComplete="name"
              placeholder="Ada Lovelace"
              aria-invalid={invalid}
              aria-describedby={describedBy}
            />
          )}
        </Field>

        <Field label="Email" error={errors.email?.message}>
          {({ id, describedBy, invalid }) => (
            <Input
              {...register("email")}
              id={id}
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={invalid}
              aria-describedby={describedBy}
            />
          )}
        </Field>

        <Field
          label="Password"
          error={errors.password?.message}
          hint="At least 8 characters, with a letter and a number."
        >
          {({ id, describedBy, invalid }) => (
            <PasswordInput
              {...register("password")}
              id={id}
              autoComplete="new-password"
              placeholder="Create a password"
              aria-invalid={invalid}
              aria-describedby={describedBy}
            />
          )}
        </Field>

        <Field label="Confirm password" error={errors.confirmPassword?.message}>
          {({ id, describedBy, invalid }) => (
            <PasswordInput
              {...register("confirmPassword")}
              id={id}
              autoComplete="new-password"
              placeholder="Repeat your password"
              aria-invalid={invalid}
              aria-describedby={describedBy}
            />
          )}
        </Field>

        <Button type="submit" size="lg" className="h-10 w-full" disabled={busy}>
          {busy && <LoaderCircle className="animate-spin" />}
          {redirecting ? "Redirecting…" : isSubmitting ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </AuthCard>
  );
}
