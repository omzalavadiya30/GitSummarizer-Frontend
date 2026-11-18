import { PublicHeader } from "@/components/public-header";
import { Logo } from "@/components/logo";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <Logo />
          <p>Summaries are AI-generated — verify important details on GitHub.</p>
        </div>
      </footer>
    </>
  );
}
