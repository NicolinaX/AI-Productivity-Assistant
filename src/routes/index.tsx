import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useTasks } from "@/hooks/use-tasks";
import {
  Mail,
  FileText,
  ListChecks,
  Bot,
  ArrowRight,
  CalendarDays,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useMemo } from "react";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function Dashboard() {
  const { tasks, hydrated } = useTasks();

  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const todayTasks = tasks.filter((t) => t.deadline?.slice(0, 10) === today);
    const completed = tasks.filter((t) => t.completed).length;
    const upcoming = tasks
      .filter((t) => !t.completed && t.deadline)
      .sort((a, b) => (a.deadline! < b.deadline! ? -1 : 1))
      .slice(0, 5);
    const score = tasks.length === 0 ? 0 : Math.round((completed / tasks.length) * 100);
    return { todayTasks, completed, upcoming, score, total: tasks.length };
  }, [tasks]);

  const features = [
    {
      title: "Smart Email Generator",
      desc: "Draft, rewrite, shorten or expand emails in seconds.",
      icon: Mail,
      to: "/email",
    },
    {
      title: "Meeting Notes Summarizer",
      desc: "Turn raw notes into decisions, actions & deadlines.",
      icon: FileText,
      to: "/meetings",
    },
    {
      title: "Task Planner & Scheduler",
      desc: "Prioritize and track your day with clarity.",
      icon: ListChecks,
      to: "/tasks",
    },
    {
      title: "AI Chat Assistant",
      desc: "Ask Aria anything — from planning to writing.",
      icon: Bot,
      to: "/chat",
    },
  ] as const;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <section className="mb-10">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4 text-accent-foreground" />
          <span>Your calm, capable workspace</span>
        </div>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Welcome User <span aria-hidden>👋</span>
        </h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground">
          Your AI-powered productivity assistant designed to help you manage emails,
          meetings, tasks, and daily work more efficiently.
        </p>
      </section>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Today's tasks" value={hydrated ? stats.todayTasks.length : "—"} icon={CalendarDays} />
        <StatCard label="Completed" value={hydrated ? stats.completed : "—"} icon={ListChecks} />
        <StatCard
          label="Upcoming deadlines"
          value={hydrated ? stats.upcoming.length : "—"}
          icon={CalendarDays}
        />
        <StatCard label="Productivity score" value={hydrated ? `${stats.score}%` : "—"} icon={TrendingUp}>
          <Progress value={stats.score} className="mt-3 h-1.5" />
        </StatCard>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        {features.map((f) => (
          <Link key={f.to} to={f.to} className="group">
            <Card className="h-full border-border/60 bg-card/60 transition-all hover:-translate-y-0.5 hover:shadow-md">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/60 text-accent-foreground">
                  <f.icon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">{f.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </CardHeader>
            </Card>
          </Link>
        ))}
      </section>

      <section className="mt-10 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/60 bg-card/60">
          <CardHeader>
            <CardTitle>Upcoming deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.upcoming.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nothing on the horizon.{" "}
                <Link to="/tasks" className="underline">
                  Add a task
                </Link>
                .
              </p>
            ) : (
              <ul className="divide-y divide-border/60">
                {stats.upcoming.map((t) => (
                  <li key={t.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium">{t.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Due {new Date(t.deadline!).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={t.priority === "high" ? "destructive" : "secondary"}>
                      {t.priority}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/60">
          <CardHeader>
            <CardTitle>Ask Aria</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Try: “Help me plan my day”, “Write a follow-up email”, or “Summarize this doc”.
            </p>
            <Button asChild className="w-full">
              <Link to="/chat">
                <Bot className="mr-2 h-4 w-4" /> Open assistant
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  children,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
  children?: React.ReactNode;
}) {
  return (
    <Card className="border-border/60 bg-card/60">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="mt-2 font-display text-3xl font-semibold">{value}</div>
        {children}
      </CardContent>
    </Card>
  );
}
