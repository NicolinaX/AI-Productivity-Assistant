import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Send, User, RotateCcw, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { PageHeader } from "./email";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chat Assistant · Aria" },
      { name: "description", content: "Chat with Aria, your workplace productivity assistant." },
    ],
  }),
  component: ChatPage,
});

const KEY = "aria.chat.v1";

const SUGGESTIONS = [
  "Help me plan my day",
  "Write an email for me",
  "Summarize this document",
  "What tasks should I prioritize?",
] as const;

function ChatPage() {
  const [initial, setInitial] = useState<UIMessage[]>([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setInitial(JSON.parse(raw) as UIMessage[]);
    } catch {}
    setLoaded(true);
  }, []);

  if (!loaded) return null;
  return <ChatInner initial={initial} />;
}

function ChatInner({ initial }: { initial: UIMessage[] }) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage, status, setMessages } = useChat({
    messages: initial,
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [status]);

  const loading = status === "submitted" || status === "streaming";

  function submit() {
    const text = input.trim();
    if (!text || loading) return;
    sendMessage({ text });
    setInput("");
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-3.5rem)] max-w-4xl flex-col px-6 py-6">
      <div className="flex items-start justify-between">
        <PageHeader
          icon={<Bot className="h-5 w-5" />}
          title="AI Chat Assistant"
          subtitle="Aria helps you plan, write, and think — anytime."
        />
        <Button variant="ghost" size="sm" onClick={() => setMessages([])}>
          <RotateCcw className="mr-1 h-4 w-4" /> New chat
        </Button>
      </div>

      <Card className="mt-6 flex flex-1 flex-col overflow-hidden border-border/60 bg-card/60">
        <CardContent ref={scrollRef} className="flex-1 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/60 text-accent-foreground">
                <Bot className="h-7 w-7" />
              </div>
              <h3 className="mt-4 font-display text-xl">Hi, I'm Aria.</h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Ask me anything about your work — I can plan, write, and summarize.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage({ text: s })}
                    className="rounded-full border border-border/70 bg-background/70 px-3 py-1.5 text-xs transition-colors hover:bg-accent/60"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((m) => (
                <Message key={m.id} message={m} />
              ))}
              {status === "submitted" && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Aria is thinking…
                </div>
              )}
            </div>
          )}
        </CardContent>
        <div className="border-t border-border/60 bg-background/60 p-4">
          <div className="flex items-end gap-2">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
              placeholder="Ask Aria anything…"
              rows={1}
              className="min-h-[44px] resize-none"
            />
            <Button onClick={submit} disabled={loading || !input.trim()} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function Message({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";
  const text = message.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("");
  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isUser ? "bg-primary text-primary-foreground" : "bg-accent/70 text-accent-foreground"
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      {isUser ? (
        <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2 text-sm text-primary-foreground">
          {text}
        </div>
      ) : (
        <div className="prose prose-sm max-w-[80%] text-foreground prose-p:my-2 prose-headings:font-display prose-ul:my-2">
          <ReactMarkdown>{text}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
