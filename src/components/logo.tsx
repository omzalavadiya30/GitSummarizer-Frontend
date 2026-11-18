import Link from "next/link";
import { GitBranch } from "lucide-react";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 font-semibold">
      <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
        <GitBranch className="size-4" />
      </span>
      GitSummarizer
    </Link>
  );
}
