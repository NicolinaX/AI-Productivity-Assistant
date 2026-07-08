import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useTasks, type Priority } from "@/hooks/use-tasks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ListChecks, Plus, Trash2, Bell } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "./email";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Task Planner · Aria" },
      { name: "description", content: "Plan tasks with priorities, deadlines, and progress tracking." },
    ],
  }),
  component: TasksPage,
});

function TasksPage() {
  const { tasks, addTask, toggle, remove, hydrated } = useTasks();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [deadline, setDeadline] = useState("");

  const groups = useMemo(() => {
    const active = tasks.filter((t) => !t.completed);
    const done = tasks.filter((t) => t.completed);
    const priorityRank: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
    const today = new Date().toISOString().slice(0, 10);

    const daily = active
      .filter((t) => t.deadline?.slice(0, 10) === today)
      .sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority]);

    const weekly = active
      .filter((t) => {
        if (!t.deadline) return false;
        const d = new Date(t.deadline);
        const now = new Date();
        const diff = (d.getTime() - now.getTime()) / 86400000;
        return diff >= 0 && diff <= 7;
      })
      .sort((a, b) => (a.deadline! < b.deadline! ? -1 : 1));

    return { active, done, daily, weekly };
  }, [tasks]);

  const score = tasks.length ? Math.round((groups.done.length / tasks.length) * 100) : 0;

  function onAdd() {
    if (!title.trim()) return;
    addTask({
      title: title.trim(),
      priority,
      deadline: deadline || undefined,
    });
    setTitle("");
    setDeadline("");
    toast.success("Task added");
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <PageHeader
        icon={<ListChecks className="h-5 w-5" />}
        title="AI Task Planner & Scheduler"
        subtitle="Capture tasks, set priorities, and see your day at a glance."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1 border-border/60 bg-card/60">
          <CardHeader>
            <CardTitle>New task</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label>Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onAdd()}
                placeholder="Prepare Q3 report"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Priority</Label>
                <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Deadline</Label>
                <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
              </div>
            </div>
            <Button onClick={onAdd} className="w-full">
              <Plus className="mr-1 h-4 w-4" /> Add task
            </Button>

            <div className="mt-4 rounded-lg bg-secondary/60 p-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{groups.done.length}/{tasks.length}</span>
              </div>
              <Progress value={score} className="mt-2 h-1.5" />
              <p className="mt-2 text-xs text-muted-foreground">
                Productivity score: <span className="font-medium text-foreground">{score}%</span>
              </p>
            </div>

            <div className="rounded-lg border border-dashed border-border/70 p-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Bell className="h-4 w-4" /> Smart reminders
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Aria highlights upcoming deadlines and overdue items in the lists on the right.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-border/60 bg-card/60">
          <CardContent className="pt-6">
            <Tabs defaultValue="today">
              <TabsList>
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="week">This week</TabsTrigger>
                <TabsTrigger value="all">All active</TabsTrigger>
                <TabsTrigger value="done">Completed</TabsTrigger>
              </TabsList>
              {!hydrated ? (
                <p className="mt-6 text-sm text-muted-foreground">Loading tasks…</p>
              ) : (
                <>
                  <TabsContent value="today"><TaskList list={groups.daily} onToggle={toggle} onRemove={remove} empty="No tasks scheduled for today." /></TabsContent>
                  <TabsContent value="week"><TaskList list={groups.weekly} onToggle={toggle} onRemove={remove} empty="Nothing due in the next 7 days." /></TabsContent>
                  <TabsContent value="all"><TaskList list={groups.active} onToggle={toggle} onRemove={remove} empty="No active tasks. Enjoy the calm." /></TabsContent>
                  <TabsContent value="done"><TaskList list={groups.done} onToggle={toggle} onRemove={remove} empty="No completed tasks yet." /></TabsContent>
                </>
              )}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function TaskList({
  list,
  onToggle,
  onRemove,
  empty,
}: {
  list: ReturnType<typeof useTasks>["tasks"];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  empty: string;
}) {
  if (list.length === 0)
    return <p className="mt-6 text-sm text-muted-foreground">{empty}</p>;
  return (
    <ul className="mt-4 divide-y divide-border/60">
      {list.map((t) => {
        const overdue = t.deadline && !t.completed && new Date(t.deadline) < new Date(new Date().toDateString());
        return (
          <li key={t.id} className="flex items-center gap-3 py-3">
            <Checkbox checked={t.completed} onCheckedChange={() => onToggle(t.id)} />
            <div className="flex-1">
              <p className={t.completed ? "text-muted-foreground line-through" : "font-medium"}>
                {t.title}
              </p>
              {t.deadline && (
                <p className={`text-xs ${overdue ? "text-destructive" : "text-muted-foreground"}`}>
                  Due {new Date(t.deadline).toLocaleDateString()}{overdue ? " · overdue" : ""}
                </p>
              )}
            </div>
            <Badge variant={t.priority === "high" ? "destructive" : t.priority === "medium" ? "default" : "secondary"}>
              {t.priority}
            </Badge>
            <Button variant="ghost" size="icon" onClick={() => onRemove(t.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </li>
        );
      })}
    </ul>
  );
}
