"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, LoaderCircle, MailCheck } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthCard } from "./auth-card";
import { Field, FormError } from "./field";
import { forgotSchema, type ForgotValues } from "@/lib/auth/schemas";
import { authService } from "@/lib/auth/service";
import { authErrorMessage } from "@/lib/auth/types";
import { cn } from "@/lib/utils";

export function ForgotPasswordForm() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [devLink, setDevLink] = useState<string | undefined>();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit({ email }: ForgotValues) {
    try {
      const res = await authService.forgotPassword(email);
      setDevLink(res.devResetLink);
      setSentTo(email);
    } catch (e) {
      setError("root", { message: authErrorMessage(e) });
    }
  }

  const backToLogin = (
    <Link href="/login" className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
      <ArrowLeft className="size-3.5" /> Back to sign in
    </Link>
  );

  if (sentTo) {
    return (
      <AuthCard title="Check your email" footer={backToLogin}>
        <div className="space-y-4 text-center text-sm">
          <MailCheck className="mx-auto size-10 text-primary" />
          <p className="text-muted-foreground">
            If an account exists for <span className="font-medium text-foreground">{sentTo}</span>
            and email delivery is configured, a reset link will arrive. It expires in 30 minutes.
          </p>

          {devLink && (
            <div className="rounded-lg border border-dashed p-3 text-left">
              <p className="mb-2 text-xs text-muted-foreground">
                Development mode — use this reset link:
              </p>
              <Link href={devLink} className={cn(buttonVariants(), "h-9 w-full")}>
                Reset my password
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => setSentTo(null)}
            className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
          >
            Use a different email
          </button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Forgot your password?"
      description="Enter your email and we'll send you a reset link."
      footer={backToLogin}
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
        <Button type="submit" size="lg" className="h-10 w-full" disabled={isSubmitting}>
          {isSubmitting && <LoaderCircle className="animate-spin" />}
          {isSubmitting ? "Sending…" : "Send reset link"}
        </Button>
      </form>
    </AuthCard>
  );
}
