import type { ComponentPropsWithoutRef, ElementType } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

/**
 * Builds a styled element. react-markdown also passes a `node` prop which must
 * not reach the DOM, so it is stripped here.
 */
function styled<T extends ElementType>(Tag: T, base: string) {
  function Styled({
    node: _node,
    className,
    ...props
  }: ComponentPropsWithoutRef<T> & { node?: unknown }) {
    const El = Tag as ElementType;
    void _node;
    return <El className={cn(base, className)} {...props} />;
  }
  return Styled;
}

// Styled per-element (no typography plugin needed). Raw HTML is not rendered,
// so untrusted README content can't inject markup.
const components: Components = {
  h1: styled("h1", "mb-2 mt-5 text-xl font-bold first:mt-0"),
  h2: styled("h2", "mb-2 mt-5 text-lg font-semibold first:mt-0"),
  h3: styled("h3", "mb-1.5 mt-4 text-base font-semibold first:mt-0"),
  h4: styled("h4", "mb-1 mt-3 text-sm font-semibold first:mt-0"),
  p: styled("p", "my-2 leading-relaxed"),
  ul: styled("ul", "my-2 list-disc space-y-1 pl-5"),
  ol: styled("ol", "my-2 list-decimal space-y-1 pl-5"),
  blockquote: styled("blockquote", "my-3 border-l-4 pl-3 text-muted-foreground"),
  hr: styled("hr", "my-4"),
  a: styled("a", "text-primary underline underline-offset-2"),
  code: styled("code", "rounded bg-muted px-1 py-0.5 font-mono text-[0.85em]"),
  pre: styled("pre", "my-3 overflow-x-auto rounded-lg bg-muted p-3 text-xs [&_code]:bg-transparent [&_code]:p-0"),
  table: ({ node: _node, ...props }) => {
    void _node;
    return (
      <div className="my-3 overflow-x-auto">
        <table className="w-full border-collapse text-sm" {...props} />
      </div>
    );
  },
  th: styled("th", "border px-2 py-1 text-left font-semibold"),
  td: styled("td", "border px-2 py-1"),
  img: ({ node: _node, alt, ...props }) => {
    void _node;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img alt={alt ?? ""} className="my-2 max-w-full rounded" loading="lazy" {...props} />
    );
  },
};

// Open every link in a new tab, safely.
components.a = ({ node: _node, href, children }) => {
  void _node;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary underline underline-offset-2"
    >
      {children}
    </a>
  );
};

export function Markdown({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <div className={cn("text-sm", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
