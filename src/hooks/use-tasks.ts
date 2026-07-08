import { useCallback, useEffect, useState } from "react";

export type Priority = "low" | "medium" | "high";
export type Task = {
  id: string;
  title: string;
  notes?: string;
  priority: Priority;
  deadline?: string; // ISO date
  completed: boolean;
  createdAt: string;
};

const KEY = "aria.tasks.v1";

function read(): Task[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Task[]) : [];
  } catch {
    return [];
  }
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setTasks(read());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(KEY, JSON.stringify(tasks));
  }, [tasks, hydrated]);

  const addTask = useCallback((t: Omit<Task, "id" | "createdAt" | "completed">) => {
    setTasks((prev) => [
      {
        ...t,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        completed: false,
      },
      ...prev,
    ]);
  }, []);

  const toggle = useCallback((id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }, []);

  const remove = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { tasks, addTask, toggle, remove, hydrated };
}
