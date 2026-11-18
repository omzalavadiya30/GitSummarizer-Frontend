"use client";

import { useState } from "react";
import { ChevronDown, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Markdown } from "@/components/markdown";
import { cn } from "@/lib/utils";

const RENDER_LIMIT = 30_000;

/** Collapsible view of the repository's raw README (fetched by the backend). */
export function ReadmePreview({ readme }: { readme: string | null }) {
  const [open, setOpen] = useState(false);
  if (!readme?.trim()) return null;

  return (
    <Card className="gap-0 p-0">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 p-5 text-left text-base font-semibold"
      >
        <FileText className="size-4 text-primary" />
        README
        <ChevronDown
          className={cn("ml-auto size-4 transition-transform", open && "rotate-180")}
        />
      </button>
      {open && (
        <div className="max-h-[32rem] overflow-y-auto border-t p-5">
          <Markdown>{readme.slice(0, RENDER_LIMIT)}</Markdown>
          {readme.length > RENDER_LIMIT && (
            <p className="mt-3 text-xs text-muted-foreground">
              README shortened — open the repository on GitHub to read the rest.
            </p>
          )}
        </div>
      )}
    </Card>
  );
}
