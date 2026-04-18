"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowRight01Icon,
  BookOpen01Icon,
  CheckmarkBadge02Icon,
  Edit02Icon,
  PlusSignIcon,
  TaskDaily01Icon,
} from "@hugeicons/core-free-icons"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

const STATS = [
  { label: "Total", value: 147, accent: false },
  { label: "Drafts", value: 38, accent: false },
  { label: "In Review", value: 12, accent: true },
  { label: "Approved", value: 89, accent: false },
] as const

const ACTIVITY = [
  {
    actor: "You",
    action: "submitted",
    target: "Discuss the doctrine of separation of powers...",
    time: "2h",
    icon: BookOpen01Icon,
  },
  {
    actor: "Dr. Adekoya",
    action: "approved",
    target: "Which section guarantees right to life?",
    time: "4h",
    icon: CheckmarkBadge02Icon,
  },
  {
    actor: "You",
    action: "edited",
    target: "Compare common law and customary law approaches...",
    time: "Yesterday",
    icon: Edit02Icon,
  },
  {
    actor: "Adebayo K.",
    action: "claimed",
    target: "Analyze the Onagoruwa v. State case...",
    time: "Yesterday",
    icon: TaskDaily01Icon,
  },
] as const

const COVERAGE_GAPS = [
  { topic: "Criminal Law", type: "Case Analysis", difficulty: "Practitioner", count: 0 },
  { topic: "Tax Law", type: "MCQ", difficulty: "Law School", count: 1 },
  { topic: "Constitutional Law", type: "Long Form", difficulty: "Practitioner", count: 2 },
] as const

function formatDate() {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date())
}

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return "Good morning"
  if (h < 18) return "Good afternoon"
  return "Good evening"
}

function dayOfYear() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const diff = now.getTime() - start.getTime()
  return Math.floor(diff / 86_400_000)
}

export default function DashboardPage() {
  const { user } = useAuth()
  const firstName = user?.name?.split(" ")[0] ?? "Researcher"

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 lg:px-10 lg:py-14">
      {/* Editorial header */}
      <div className="animate-fade-in flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span className="text-eyebrow text-primary">
            Issue No. {String(dayOfYear()).padStart(3, "0")}
          </span>
          <span className="rule-gold w-12" />
          <span className="text-eyebrow text-muted-foreground/70">
            {formatDate()}
          </span>
        </div>

        <h1 className="font-display mt-1 text-[44px] leading-[1.05] font-medium tracking-tight text-foreground sm:text-[56px]">
          {greeting()},{" "}
          <span className="font-display-italic text-primary">{firstName}</span>.
        </h1>

        <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          Your editorial workspace for shaping the legal AI benchmark. Below is
          today&rsquo;s situation across the bench.
        </p>
      </div>

      {/* Stats — editorial typographic emphasis */}
      <section className="animate-fade-in mt-12 [animation-delay:120ms]">
        <div className="flex items-baseline justify-between pb-4">
          <div className="flex items-baseline gap-3">
            <span className="font-display-italic tabular text-sm text-primary/70">
              I.
            </span>
            <h2 className="text-eyebrow text-muted-foreground">At a glance</h2>
          </div>
        </div>
        <div className="rule-gold mb-6" />

        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="group relative bg-card p-6 transition-colors hover:bg-accent/30"
            >
              <div className="flex items-baseline gap-2">
                <span className="font-display tabular text-[44px] leading-none font-medium text-foreground">
                  {stat.value}
                </span>
                {stat.accent && (
                  <span className="size-1.5 translate-y-[-12px] rounded-full bg-primary" />
                )}
              </div>
              <div className="mt-3 text-eyebrow text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Two-column editorial spread */}
      <div className="mt-14 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        {/* Activity feed */}
        <section className="animate-fade-in [animation-delay:240ms]">
          <div className="flex items-baseline justify-between pb-4">
            <div className="flex items-baseline gap-3">
              <span className="font-display-italic tabular text-sm text-primary/70">
                II.
              </span>
              <h2 className="text-eyebrow text-muted-foreground">
                Recent activity
              </h2>
            </div>
            <Link
              href="/questions"
              className="group flex items-center gap-1 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
            >
              View all
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={12}
                strokeWidth={1.8}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>
          <div className="rule-gold mb-2" />

          <ul className="flex flex-col">
            {ACTIVITY.map((item, i) => (
              <li
                key={i}
                className="group flex items-start gap-4 border-b border-border/60 py-4 last:border-b-0"
              >
                <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors group-hover:border-primary/30 group-hover:text-primary">
                  <HugeiconsIcon
                    icon={item.icon}
                    size={14}
                    strokeWidth={1.6}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] leading-relaxed text-foreground">
                    <span className="font-medium">{item.actor}</span>{" "}
                    <span className="text-muted-foreground">{item.action}</span>{" "}
                    <span className="font-display-italic">
                      &ldquo;{item.target}&rdquo;
                    </span>
                  </p>
                  <span className="text-eyebrow-sm mt-1 inline-block text-muted-foreground/60">
                    {item.time} ago
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Sidebar column: Coverage gaps + CTA */}
        <aside className="animate-fade-in flex flex-col gap-10 [animation-delay:360ms]">
          {/* CTA */}
          <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6">
            <div className="relative flex flex-col gap-3">
              <span className="text-eyebrow text-primary">A new draft</span>
              <h3 className="font-display text-[22px] leading-tight font-medium text-foreground">
                Author your next question.
              </h3>
              <p className="text-[13px] leading-relaxed text-muted-foreground">
                Build the benchmark, one well-crafted question at a time.
              </p>
              <Button asChild size="sm" className="mt-2 w-fit cursor-pointer">
                <Link href="/questions/new">
                  <HugeiconsIcon
                    icon={PlusSignIcon}
                    size={14}
                    strokeWidth={2}
                  />
                  New question
                </Link>
              </Button>
            </div>

            <div
              aria-hidden
              className="pointer-events-none absolute -right-12 -top-12 size-44 rounded-full bg-primary/10 blur-3xl"
            />
          </div>

          {/* Coverage gaps */}
          <div>
            <div className="flex items-baseline gap-3 pb-4">
              <span className="font-display-italic tabular text-sm text-primary/70">
                III.
              </span>
              <h2 className="text-eyebrow text-muted-foreground">
                Coverage gaps
              </h2>
            </div>
            <div className="rule-gold mb-2" />

            <ul className="flex flex-col">
              {COVERAGE_GAPS.map((gap, i) => (
                <li
                  key={i}
                  className="flex items-start justify-between gap-3 border-b border-border/60 py-3.5 last:border-b-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium text-foreground">
                      {gap.topic}
                    </p>
                    <p className="text-eyebrow-sm mt-1 text-muted-foreground/70">
                      {gap.type} · {gap.difficulty}
                    </p>
                  </div>
                  <span className="font-display tabular shrink-0 text-[20px] font-medium leading-none text-primary">
                    {gap.count}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      {/* Editorial footer */}
      <div className="animate-fade-in mt-16 flex items-baseline gap-3 [animation-delay:480ms]">
        <span className="rule-gold w-16" />
        <span className="text-eyebrow text-muted-foreground/60">
          Lawexa Bench &middot; Editorial Workspace
        </span>
      </div>
    </div>
  )
}
