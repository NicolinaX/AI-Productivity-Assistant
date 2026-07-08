import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { summarizeMeeting } from "@/lib/ai.functions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, FileText, Upload, Download, Wand2 } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { PageHeader } from "./email";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer · Aria" },
      { name: "description", content: "Turn raw meeting notes into decisions, action items, and deadlines." },
    ],
  }),
  component: MeetingsPage,
});

function MeetingsPage() {
  const call = useServerFn(summarizeMeeting);
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setNotes(text);
    toast.success(`Loaded ${file.name}`);
  }

  async function onSubmit() {
    if (!notes.trim()) {
      toast.error("Paste or upload some notes first.");
      return;
    }
    setLoading(true);
    try {
      const res = await call({ data: { notes } });
      setOutput(res.text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function exportMd() {
    const blob = new Blob([output], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `meeting-summary-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <PageHeader
        icon={<FileText className="h-5 w-5" />}
        title="Meeting Notes Summarizer"
        subtitle="Paste transcripts or upload notes to get summaries, decisions & action items."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Notes</CardTitle>
            <div>
              <input
                ref={fileRef}
                type="file"
                accept=".txt,.md,.vtt,.srt"
                onChange={onFile}
                className="hidden"
              />
              <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                <Upload className="mr-1 h-4 w-4" /> Upload
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={16}
              placeholder="Paste your meeting transcript or notes here…"
            />
            <Button onClick={onSubmit} disabled={loading} className="w-full">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
              {loading ? "Summarizing…" : "Summarize meeting"}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Summary</CardTitle>
            {output && (
              <Button variant="ghost" size="sm" onClick={exportMd}>
                <Download className="mr-1 h-4 w-4" /> Export
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {output ? (
              <div className="prose prose-sm max-w-none prose-headings:font-display prose-headings:tracking-tight prose-h2:text-lg prose-h2:mt-4 prose-h2:mb-2 prose-p:my-2 prose-ul:my-2">
                <ReactMarkdown>{output}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Your structured summary will appear here.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
