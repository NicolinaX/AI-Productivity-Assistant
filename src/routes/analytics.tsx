import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { useTasks } from "@/hooks/use-tasks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import { LineChart as LineIcon } from "lucide-react";
import { PageHeader } from "./email";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Productivity Analytics · Aria" },
      { name: "description", content: "Weekly productivity trends and progress reports." },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const { tasks, hydrated } = useTasks();

  const weekly = useMemo(() => {
    const days: { day: string; created: number; completed: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString(undefined, { weekday: "short" });
      const created = tasks.filter((t) => t.createdAt.slice(0, 10) === key).length;
      const completed = tasks.filter((t) => t.completed && t.createdAt.slice(0, 10) <= key).length;
      days.push({ day: label, created, completed });
    }
    return days;
  }, [tasks]);

  const done = tasks.filter((t) => t.completed).length;
  const score = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <PageHeader
        icon={<LineIcon className="h-5 w-5" />}
        title="Productivity Analytics"
        subtitle="How your week is trending."
      />

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Stat label="Total tasks" value={hydrated ? tasks.length : "—"} />
        <Stat label="Completed" value={hydrated ? done : "—"} />
        <Stat label="Productivity score" value={hydrated ? `${score}%` : "—"} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/60">
          <CardHeader><CardTitle>Tasks created this week</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekly}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Bar dataKey="created" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60">
          <CardHeader><CardTitle>Completion trend</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weekly}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Line type="monotone" dataKey="completed" stroke="var(--chart-2)" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Card className="border-border/60 bg-card/60">
      <CardContent className="p-5">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-2 font-display text-3xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}
