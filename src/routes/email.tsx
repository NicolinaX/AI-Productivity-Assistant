import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { generateEmail } from "@/lib/ai.functions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Mail, Copy, Wand2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator · Aria" },
      { name: "description", content: "Draft, rewrite, shorten or expand professional emails with AI." },
    ],
  }),
  component: EmailPage,
});

type EmailType = "formal" | "friendly" | "follow-up" | "apology" | "request";
type Tone = "professional" | "casual" | "warm" | "concise" | "assertive";
type Action = "generate" | "rewrite" | "shorten" | "expand" | "improve";

function EmailPage() {
  const call = useServerFn(generateEmail);
  const [context, setContext] = useState("");
  const [type, setType] = useState<EmailType>("formal");
  const [tone, setTone] = useState<Tone>("professional");
  const [action, setAction] = useState<Action>("generate");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  async function onSubmit() {
    if (!context.trim()) {
      toast.error("Add some context or paste an email first.");
      return;
    }
    setLoading(true);
    try {
      const res = await call({ data: { context, type, tone, action } });
      setOutput(res.text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <PageHeader
        icon={<Mail className="h-5 w-5" />}
        title="Smart Email Generator"
        subtitle="Turn a few notes into a polished email — or refine one you already wrote."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/60">
          <CardHeader>
            <CardTitle>Compose</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Action</Label>
                <Select value={action} onValueChange={(v) => setAction(v as Action)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="generate">Generate</SelectItem>
                    <SelectItem value="rewrite">Rewrite</SelectItem>
                    <SelectItem value="shorten">Shorten</SelectItem>
                    <SelectItem value="expand">Expand</SelectItem>
                    <SelectItem value="improve">Improve</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Type</Label>
                <Select value={type} onValueChange={(v) => setType(v as EmailType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="follow-up">Follow-up</SelectItem>
                    <SelectItem value="apology">Apology</SelectItem>
                    <SelectItem value="request">Request</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Tone</Label>
              <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="warm">Warm</SelectItem>
                  <SelectItem value="concise">Concise</SelectItem>
                  <SelectItem value="assertive">Assertive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>
                {action === "generate" ? "What is the email about?" : "Paste your email"}
              </Label>
              <Textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder={
                  action === "generate"
                    ? "e.g. Follow up with Alex about the Q3 budget review; propose Tuesday at 10am."
                    : "Paste the email here…"
                }
                rows={10}
                className="mt-1"
              />
            </div>
            <Button onClick={onSubmit} disabled={loading} className="w-full">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
              {loading ? "Working…" : action === "generate" ? "Generate email" : `Apply: ${action}`}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Result</CardTitle>
            {output && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(output);
                  toast.success("Copied to clipboard");
                }}
              >
                <Copy className="mr-1 h-4 w-4" /> Copy
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {output ? (
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
                {output}
              </pre>
            ) : (
              <p className="text-sm text-muted-foreground">
                Your generated email will appear here.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function PageHeader({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <header>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/60 text-accent-foreground">
          {icon}
        </div>
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
    </header>
  );
}
