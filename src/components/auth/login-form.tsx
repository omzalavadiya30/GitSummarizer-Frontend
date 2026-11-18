"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthCard } from "./auth-card";
import { Field, FormError } from "./field";
import { PasswordInput } from "./password-input";
import { useAuth } from "./auth-provider";
import { loginSchema, type LoginValues } from "@/lib/auth/schemas";
import { authErrorMessage } from "@/lib/auth/types";
import { HOME_AFTER_LOGIN } from "@/lib/auth/constants";

export function LoginForm() {
  const { login } = useAuth();
  const params = useSearchParams();
  const [redirecting, setRedirecting] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // Confirmation after a successful password reset.
  useEffect(() => {
    if (params.get("reset") === "success") {
      toast.success("Password updated — sign in with your new password.", { id: "reset-ok" });
    }
  }, [params]);

  async function onSubmit(values: LoginValues) {
    try {
      await login(values);
      setRedirecting(true);
      // Hard navigation so the proxy sees the fresh session cookie.
      window.location.assign(HOME_AFTER_LOGIN);
    } catch (e) {
      setError("root", { message: authErrorMessage(e) });
    }
  }

  const busy = isSubmitting || redirecting;

  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to your GitSummarizer account."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <FormError message={errors.root?.message} />

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
        >
          {({ id, describedBy, invalid }) => (
            <>
              <PasswordInput
                {...register("password")}
                id={id}
                autoComplete="current-password"
                placeholder="Your password"
                aria-invalid={invalid}
                aria-describedby={describedBy}
              />
              <div className="justify-end mt-1 flex">
                <Link href="/forgot-password" className="text-xs font-medium text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
            </>
          )}
        </Field>

        <Button type="submit" size="lg" className="h-10 w-full" disabled={busy}>
          {busy && <LoaderCircle className="animate-spin" />}
          {redirecting ? "Redirecting…" : isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </AuthCard>
  );
}
