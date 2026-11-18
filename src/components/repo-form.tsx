"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  normalizeInput,
  repoUrlSchema,
  type RepoUrlForm,
} from "@/lib/github-url";

interface Props {
  initialValue?: string;
  loading: boolean;
  onSubmit: (url: string) => void;
}

const EXAMPLES = ["vercel/next.js", "spring-projects/spring-boot", "facebook/react"];

export function RepoForm({ initialValue = "", loading, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RepoUrlForm>({
    resolver: zodResolver(repoUrlSchema),
    defaultValues: { url: initialValue },
  });

  const submit = handleSubmit(({ url }) => onSubmit(normalizeInput(url)));

  return (
    <div>
      <form onSubmit={submit} noValidate className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            {...register("url")}
            placeholder="https://github.com/owner/repo"
            aria-label="GitHub repository URL"
            aria-invalid={!!errors.url}
            autoComplete="off"
            spellCheck={false}
            className="pl-9"
          />
        </div>
        <Button type="submit" size="lg" disabled={loading} className="h-10 px-5">
          {loading && <LoaderCircle className="animate-spin" />}
          {loading ? "Summarizing…" : "Summarize"}
        </Button>
      </form>

      {errors.url && (
        <p role="alert" className="mt-2 text-sm text-destructive">
          {errors.url.message}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span>Try:</span>
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            disabled={loading}
            onClick={() => {
              setValue("url", `https://github.com/${ex}`);
              void submit();
            }}
            className="rounded-full border px-2.5 py-1 transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}
