"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LinkIcon, LoaderCircle } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { AuthCard } from "./auth-card";
import { Field, FormError } from "./field";
import { PasswordInput } from "./password-input";
import { resetSchema, type ResetValues } from "@/lib/auth/schemas";
import { authService } from "@/lib/auth/service";
import { authErrorMessage } from "@/lib/auth/types";
import { cn } from "@/lib/utils";

export function ResetPasswordForm() {
  const router = useRouter();
  const token = useSearchParams().get("token") ?? "";
  const [done, setDone] = useState(false);
  const [tokenInvalid, setTokenInvalid] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onSubmit({ password }: ResetValues) {
    try {
      await authService.resetPassword({ token, password });
      setDone(true);
      router.replace("/login?reset=success");
    } catch (e) {
      if (e instanceof Error && "code" in e && e.code === "INVALID_TOKEN") setTokenInvalid(true);
      else setError("root", { message: authErrorMessage(e) });
    }
  }

  if (!token || tokenInvalid) {
    return (
      <AuthCard
        title="Reset link not valid"
        description="This password reset link is missing, invalid or has expired."
      >
        <div className="space-y-3 text-center">
          <LinkIcon className="mx-auto size-10 text-muted-foreground" />
          <Link href="/forgot-password" className={cn(buttonVariants(), "h-10 w-full")}>
            Request a new link
          </Link>
          <Link href="/login" className="block text-sm text-primary hover:underline">
            Back to sign in
          </Link>
        </div>
      </AuthCard>
    );
  }

  const busy = isSubmitting || done;

  return (
    <AuthCard title="Set a new password" description="Choose a strong password you haven't used before.">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <FormError message={errors.root?.message} />

        <Field
          label="New password"
          error={errors.password?.message}
          hint="At least 8 characters, with a letter and a number."
        >
          {({ id, describedBy, invalid }) => (
            <PasswordInput
              {...register("password")}
              id={id}
              autoComplete="new-password"
              placeholder="New password"
              aria-invalid={invalid}
              aria-describedby={describedBy}
            />
          )}
        </Field>

        <Field label="Confirm new password" error={errors.confirmPassword?.message}>
          {({ id, describedBy, invalid }) => (
            <PasswordInput
              {...register("confirmPassword")}
              id={id}
              autoComplete="new-password"
              placeholder="Repeat new password"
              aria-invalid={invalid}
              aria-describedby={describedBy}
            />
          )}
        </Field>

        <Button type="submit" size="lg" className="h-10 w-full" disabled={busy}>
          {busy && <LoaderCircle className="animate-spin" />}
          {done ? "Redirecting…" : isSubmitting ? "Updating…" : "Update password"}
        </Button>
      </form>
    </AuthCard>
  );
}
