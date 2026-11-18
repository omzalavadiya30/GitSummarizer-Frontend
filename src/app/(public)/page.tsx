import { Bookmark, Check, FileText, GitFork, ListChecks, Rocket, Search, Sparkles, Star } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Beginner-friendly overview",
    text: "Dense READMEs become a clear explanation of what the project is and who it's for.",
  },
  {
    icon: ListChecks,
    title: "Features & prerequisites",
    text: "See the key capabilities and exactly what you need installed before you start.",
  },
  {
    icon: Rocket,
    title: "Readable release notes",
    text: "Cryptic commit logs are translated into plain, business-friendly release notes.",
  },
  {
    icon: Bookmark,
    title: "History & saved repos",
    text: "Every repository you summarize is kept on your dashboard. Bookmark the ones that matter.",
  },
];

const steps = [
  { n: "1", title: "Paste a repo URL", text: "Any public GitHub repository works." },
  { n: "2", title: "We read the code's story", text: "The README and recent commits are fetched through the GitHub API." },
  { n: "3", title: "Get your summary", text: "An AI turns it into structured, easy-to-scan highlights." },
];

const audiences = [
  { who: "Students & junior developers", what: "Understand open-source projects without wading through dense docs." },
  { who: "Product managers", what: "Turn technical commits into release notes stakeholders can read." },
  { who: "Open-source maintainers", what: "Generate quick overviews and changelogs to onboard new contributors." },
];

const highlights = [
  "Free to use",
  "Works with any public repository",
  "Summaries saved to your dashboard",
];

const faqs = [
  {
    q: "Which repositories can I summarize?",
    a: "Any public GitHub repository. Private repositories are not supported.",
  },
  {
    q: "What do I get in a summary?",
    a: "A beginner-friendly overview, key features, prerequisites and release notes written from the latest commits. You also see the recent commits and the original README.",
  },
  {
    q: "Which URL formats work?",
    a: "Yes. A full URL, github.com/owner/repo, or just owner/repo all work. A link to a specific commit is highlighted in the commit list.",
  },
  {
    q: "Are my past searches kept?",
    a: "Yes. Every summary is saved to your history. Bookmark the ones you want to keep, search them, or export them as JSON.",
  },
];

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-112 bg-[radial-gradient(60%_60%_at_50%_0%,color-mix(in_oklch,var(--primary)_18%,transparent),transparent)]"
        />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="size-3.5 text-primary" /> AI-powered repository briefings
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
              Understand any GitHub repo{" "}
              <span className="text-primary">in seconds</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Stop digging through long READMEs and cryptic commit logs. GitSummarizer turns
              any public repository into a clear overview, key features, prerequisites and
              release notes.
            </p>
            <ul className="mt-8 space-y-2.5 text-sm">
              {highlights.map((h) => (
                <li key={h} className="flex items-center gap-2">
                  <span className="grid size-5 place-items-center rounded-full bg-primary/10 text-primary">
                    <Check className="size-3.5" />
                  </span>
                  {h}
                </li>
              ))}
            </ul>
          </div>

          {/* Static product preview */}
          <div aria-hidden className="relative">
            <div className="rounded-2xl bg-card p-5 shadow-xl ring-1 ring-foreground/10">
              <div className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-muted-foreground">
                <Search className="size-4" /> github.com/vercel/next.js
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="font-bold">vercel/next.js</p>
                <div className="flex gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Star className="size-3" /> 130k</span>
                  <span className="inline-flex items-center gap-1"><GitFork className="size-3" /> 28k</span>
                </div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                A React framework for building fast, full-stack web applications with
                routing, rendering and data fetching built in.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {["Key features", "Prerequisites"].map((t) => (
                  <div key={t} className="rounded-lg border p-3">
                    <p className="mb-2 text-xs font-semibold">{t}</p>
                    {[0, 1, 2].map((i) => (
                      <p key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Check className="size-3 text-emerald-500" />
                        <span className="h-2 w-full max-w-24 rounded bg-muted" />
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
            Everything you need to grasp a codebase
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-xl bg-card p-5 ring-1 ring-foreground/10">
                <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">How it works</h2>
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <li key={s.n} className="flex gap-4">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {s.n}
              </span>
              <div>
                <h3 className="font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Audiences */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">Built for</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {audiences.map((a) => (
              <div key={a.who} className="rounded-xl bg-card p-5 ring-1 ring-foreground/10">
                <h3 className="font-semibold">{a.who}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{a.what}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
          Frequently asked questions
        </h2>
        <div className="mt-8 divide-y rounded-xl bg-card ring-1 ring-foreground/10">
          {faqs.map(({ q, a }) => (
            <details key={q} className="group p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                {q}
                <span aria-hidden className="text-muted-foreground transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-2 text-sm text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}