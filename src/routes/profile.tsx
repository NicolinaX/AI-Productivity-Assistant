import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserCircle } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "./email";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile & Settings · Aria" },
      { name: "description", content: "Customize your Aria preferences." },
    ],
  }),
  component: ProfilePage,
});

type Prefs = {
  name: string;
  email: string;
  role: string;
  reminders: boolean;
  weeklyReport: boolean;
  defaultTone: string;
};

const KEY = "aria.profile.v1";
const DEFAULT: Prefs = {
  name: "",
  email: "",
  role: "",
  reminders: true,
  weeklyReport: true,
  defaultTone: "professional",
};

function ProfilePage() {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setPrefs({ ...DEFAULT, ...JSON.parse(raw) });
    } catch {}
    setLoaded(true);
  }, []);

  function save() {
    localStorage.setItem(KEY, JSON.stringify(prefs));
    toast.success("Preferences saved");
  }

  const initials = prefs.name
    ? prefs.name.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase()
    : "U";

  if (!loaded) return null;

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <PageHeader
        icon={<UserCircle className="h-5 w-5" />}
        title="Profile & Settings"
        subtitle="Customize how Aria works for you."
      />

      <Card className="mt-8 border-border/60 bg-card/60">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-accent text-accent-foreground text-lg">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{prefs.name || "Your profile"}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {prefs.role || "Add a role to personalize suggestions"}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Name</Label>
              <Input value={prefs.name} onChange={(e) => setPrefs({ ...prefs, name: e.target.value })} />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={prefs.email} onChange={(e) => setPrefs({ ...prefs, email: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Label>Role</Label>
              <Input
                value={prefs.role}
                onChange={(e) => setPrefs({ ...prefs, role: e.target.value })}
                placeholder="e.g. Product Manager"
              />
            </div>
            <div className="sm:col-span-2">
              <Label>Default email tone</Label>
              <Input value={prefs.defaultTone} onChange={(e) => setPrefs({ ...prefs, defaultTone: e.target.value })} />
            </div>
          </div>

          <div className="mt-4 space-y-3 rounded-xl bg-secondary/60 p-4">
            <ToggleRow
              label="Smart reminders"
              desc="Get AI-generated reminders for upcoming deadlines."
              value={prefs.reminders}
              onChange={(v) => setPrefs({ ...prefs, reminders: v })}
            />
            <ToggleRow
              label="Weekly productivity report"
              desc="A short summary of your progress every Monday."
              value={prefs.weeklyReport}
              onChange={(v) => setPrefs({ ...prefs, weeklyReport: v })}
            />
          </div>

          <Button onClick={save} className="w-full sm:w-auto">Save preferences</Button>
        </CardContent>
      </Card>
    </div>
  );
}

function ToggleRow({
  label,
  desc,
  value,
  onChange,
}: {
  label: string;
  desc: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  );
}
