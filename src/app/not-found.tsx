import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="py-24 text-center">
      <p className="text-5xl font-bold">404</p>
      <p className="mt-3 text-muted-foreground">We couldn&apos;t find that page.</p>
      <Link href="/" className={cn(buttonVariants(), "mt-6 h-9 px-4")}>
        Back to GitSummarizer
      </Link>
    </div>
  );
}
