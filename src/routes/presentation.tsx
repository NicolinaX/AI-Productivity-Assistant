import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Sparkles,
  Bot,
  Mail,
  FileText,
  ListChecks,
  Cpu,
  Rocket,
  Workflow,
  ShieldCheck,
  Zap,
  Users,
  Clock,
  Calendar,
  Cloud,
  Smartphone,
  Mic,
  ArrowRight,
  ArrowLeft,
  ChevronsRight,
  Home as HomeIcon,
  MonitorPlay,
  Layers,
  Target,
  Lightbulb,
  Code2,
  Palette,
  Braces,
  Presentation as PresentationIcon,
  MessageSquare,
  CheckCircle2,
  TrendingUp,
  Handshake,
  Network,
} from "lucide-react";

export const Route = createFileRoute("/presentation")({
  head: () => ({
    meta: [
      { title: "AI Workplace Productivity Assistant · Presentation" },
      {
        name: "description",
        content:
          "Project presentation for the AI Workplace Productivity Assistant by Nicolina Makele.",
      },
    ],
  }),
  component: PresentationPage,
});

type Slide = {
  id: string;
  render: () => React.ReactElement;
};

function PresentationPage() {
  const slides = useSlides();
  const [i, setI] = useState(0);

  const go = useCallback(
    (n: number) => setI((v) => Math.max(0, Math.min(slides.length - 1, v + n))),
    [slides.length],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") go(1);
      else if (e.key === "ArrowLeft" || e.key === "PageUp") go(-1);
      else if (e.key === "Home") setI(0);
      else if (e.key === "End") setI(slides.length - 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, slides.length]);

  const slide = slides[i];

  return (
    <div className="deck-root">
      <style>{deckCss}</style>
      <div className="deck-bg" aria-hidden />
      <div className="deck-grid" aria-hidden />

      <header className="deck-topbar">
        <div className="deck-brand">
          <span className="deck-brand-dot" />
          <span>AI Workplace Productivity Assistant</span>
        </div>
        <div className="deck-topbar-right">
          <span className="deck-count">
            {String(i + 1).padStart(2, "0")}{" "}
            <span className="deck-count-total">/ {slides.length}</span>
          </span>
        </div>
      </header>

      <main className="deck-stage">
        <section key={slide.id} className="deck-slide">
          {slide.render()}
        </section>
      </main>

      <footer className="deck-controls">
        <button
          onClick={() => go(-1)}
          disabled={i === 0}
          className="deck-btn"
          aria-label="Previous slide"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="deck-progress">
          <div className="deck-progress-fill" style={{ width: `${((i + 1) / slides.length) * 100}%` }} />
        </div>
        <button
          onClick={() => go(1)}
          disabled={i === slides.length - 1}
          className="deck-btn deck-btn-primary"
          aria-label="Next slide"
        >
          Next <ArrowRight className="h-4 w-4" />
        </button>
      </footer>
    </div>
  );
}

/* ------------------------------ Slides ------------------------------- */

function useSlides(): Slide[] {
  return useMemo(
    () => [
      { id: "title", render: SlideTitle },
      { id: "intro", render: SlideIntro },
      { id: "problem", render: SlideProblem },
      { id: "objectives", render: SlideObjectives },
      { id: "solution", render: SlideSolution },
      { id: "f-email", render: SlideEmail },
      { id: "f-meetings", render: SlideMeetings },
      { id: "f-tasks", render: SlideTasks },
      { id: "f-assistant", render: SlideAssistant },
      { id: "tech", render: SlideTech },
      { id: "how", render: SlideHow },
      { id: "demo", render: SlideDemo },
      { id: "benefits", render: SlideBenefits },
      { id: "future", render: SlideFuture },
      { id: "conclusion", render: SlideConclusion },
      { id: "thanks", render: SlideThanks },
    ],
    [],
  );
}

function Kicker({ icon: Icon, children }: { icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <div className="deck-kicker">
      <Icon className="h-3.5 w-3.5" />
      <span>{children}</span>
    </div>
  );
}

function SlideTitle() {
  return (
    <div className="s-title">
      <div className="s-title-left">
        <Kicker icon={Sparkles}>University Project · 2026</Kicker>
        <h1 className="deck-h1">
          AI Workplace <br />
          <span className="deck-grad">Productivity Assistant</span>
        </h1>
        <p className="deck-lead">
          Using Artificial Intelligence to improve workplace efficiency —
          automating emails, meetings, tasks, and everyday work.
        </p>
        <div className="s-title-meta">
          <div>
            <div className="s-title-label">Presented by</div>
            <div className="s-title-value">Nicolina Makele</div>
          </div>
          <div>
            <div className="s-title-label">Module</div>
            <div className="s-title-value">Applied AI · Product Demo</div>
          </div>
        </div>
      </div>
      <div className="s-title-right">
        <div className="orb orb-a" />
        <div className="orb orb-b" />
        <div className="s-title-card">
          <div className="s-title-card-row">
            <Bot className="h-5 w-5" />
            <span>Aria · your AI copilot</span>
          </div>
          <div className="s-title-card-grid">
            {[Mail, FileText, ListChecks, MessageSquare].map((I, k) => (
              <div key={k} className="s-title-card-tile">
                <I className="h-5 w-5" />
              </div>
            ))}
          </div>
          <div className="s-title-card-bar">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    </div>
  );
}

function SlideIntro() {
  return (
    <div className="s-two">
      <div>
        <Kicker icon={Lightbulb}>Introduction</Kicker>
        <h2 className="deck-h2">A calm, capable AI coworker.</h2>
        <p className="deck-body">
          The <b>AI Workplace Productivity Assistant</b> is a web application that
          helps employees and students automate repetitive administrative work
          using modern AI models — from drafting emails to summarising meetings
          and planning tasks.
        </p>
        <p className="deck-body">
          It brings four everyday workplace tools together in a single,
          minimalist interface designed for daily use.
        </p>
      </div>
      <div className="s-cards">
        {[
          { i: Mail, t: "Email drafting" },
          { i: FileText, t: "Meeting notes" },
          { i: ListChecks, t: "Task planning" },
          { i: Bot, t: "AI assistant" },
        ].map((c) => (
          <div key={c.t} className="s-card">
            <c.i className="h-5 w-5" />
            <div className="s-card-t">{c.t}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideProblem() {
  const items = [
    {
      i: Mail,
      t: "Time-consuming communication",
      d: "Employees spend hours each week drafting, rewriting and formatting emails.",
    },
    {
      i: FileText,
      t: "Manual meeting documentation",
      d: "Notes are long, unstructured and rarely turn into clear action items.",
    },
    {
      i: ListChecks,
      t: "Poor task organisation",
      d: "Priorities, deadlines and daily plans get lost across tools and inboxes.",
    },
  ];
  return (
    <div>
      <Kicker icon={Target}>The Problem</Kicker>
      <h2 className="deck-h2">Repetitive work is eating the working day.</h2>
      <div className="s-grid-3">
        {items.map((it) => (
          <div key={it.t} className="s-panel">
            <div className="s-panel-icon">
              <it.i className="h-5 w-5" />
            </div>
            <div className="s-panel-t">{it.t}</div>
            <div className="s-panel-d">{it.d}</div>
          </div>
        ))}
      </div>
      <div className="s-stat-row">
        <Stat value="60%" label="of the week spent on admin tasks" />
        <Stat value="23" label="context switches per hour on average" />
        <Stat value="1 in 3" label="meetings without clear action items" />
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="s-stat">
      <div className="s-stat-v">{value}</div>
      <div className="s-stat-l">{label}</div>
    </div>
  );
}

function SlideObjectives() {
  const items = [
    { i: TrendingUp, t: "Improve productivity" },
    { i: Zap, t: "Automate repetitive tasks" },
    { i: Clock, t: "Save time every day" },
    { i: MessageSquare, t: "Improve workplace communication" },
    { i: Calendar, t: "Assist with daily planning" },
  ];
  return (
    <div>
      <Kicker icon={Rocket}>Project Objectives</Kicker>
      <h2 className="deck-h2">What we set out to achieve.</h2>
      <div className="s-obj-grid">
        {items.map((it, k) => (
          <div key={it.t} className="s-obj">
            <div className="s-obj-num">0{k + 1}</div>
            <div className="s-obj-icon">
              <it.i className="h-5 w-5" />
            </div>
            <div className="s-obj-t">{it.t}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideSolution() {
  return (
    <div className="s-two">
      <div>
        <Kicker icon={ShieldCheck}>The Solution</Kicker>
        <h2 className="deck-h2">One AI-powered workspace.</h2>
        <p className="deck-body">
          A web-based AI assistant that unifies the most time-consuming daily
          tasks into a single, elegant interface — powered by large language
          models and designed around real workflows.
        </p>
        <ul className="deck-list">
          <li><CheckCircle2 className="h-4 w-4" /> Automates writing, summarising and planning</li>
          <li><CheckCircle2 className="h-4 w-4" /> Works from any browser — no install</li>
          <li><CheckCircle2 className="h-4 w-4" /> Learns from user tone, priorities and context</li>
          <li><CheckCircle2 className="h-4 w-4" /> Keeps humans in control — review before send</li>
        </ul>
      </div>
      <div className="s-flow">
        {[
          { i: Users, t: "User" },
          { i: Cpu, t: "AI Engine" },
          { i: Sparkles, t: "Output" },
        ].map((n, k, arr) => (
          <div key={n.t} className="s-flow-node">
            <div className="s-flow-ring">
              <n.i className="h-5 w-5" />
            </div>
            <span>{n.t}</span>
            {k < arr.length - 1 && <ChevronsRight className="s-flow-arrow" />}
          </div>
        ))}
      </div>
    </div>
  );
}

function FeatureSlide({
  n,
  icon: Icon,
  title,
  tagline,
  points,
}: {
  n: number;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  tagline: string;
  points: string[];
}) {
  return (
    <div className="s-two">
      <div>
        <Kicker icon={Layers}>Feature 0{n}</Kicker>
        <h2 className="deck-h2">{title}</h2>
        <p className="deck-body">{tagline}</p>
        <ul className="deck-list">
          {points.map((p) => (
            <li key={p}><CheckCircle2 className="h-4 w-4" /> {p}</li>
          ))}
        </ul>
      </div>
      <div className="s-feature-visual">
        <div className="s-feature-icon">
          <Icon className="h-10 w-10" />
        </div>
        <div className="s-feature-lines">
          <span /><span /><span /><span />
        </div>
      </div>
    </div>
  );
}

function SlideEmail() {
  return (
    <FeatureSlide
      n={1}
      icon={Mail}
      title="Smart Email Generator"
      tagline="Draft, rewrite and polish professional emails in seconds."
      points={[
        "Generates professional emails from a short prompt",
        "Choose tone (formal, friendly, persuasive) and purpose",
        "Rewrite, shorten, expand or improve any draft",
        "Cuts communication time by up to 70%",
      ]}
    />
  );
}

function SlideMeetings() {
  return (
    <FeatureSlide
      n={2}
      icon={FileText}
      title="Meeting Notes Summarizer"
      tagline="Turn raw transcripts into clean, structured minutes."
      points={[
        "Converts long notes and transcripts into concise summaries",
        "Extracts key discussion points and decisions",
        "Identifies action items, owners and deadlines",
        "Exports to Markdown for sharing",
      ]}
    />
  );
}

function SlideTasks() {
  return (
    <FeatureSlide
      n={3}
      icon={ListChecks}
      title="AI Task Planner & Scheduler"
      tagline="Organise the day around what matters most."
      points={[
        "Organises tasks with priority and deadlines",
        "Prioritises workload using AI suggestions",
        "Tracks progress and completion rate",
        "Helps users manage time and focus",
      ]}
    />
  );
}

function SlideAssistant() {
  return (
    <FeatureSlide
      n={4}
      icon={Bot}
      title="AI Assistant"
      tagline="A conversational copilot for everyday work."
      points={[
        "Provides workplace guidance in natural language",
        "Answers productivity and process questions",
        "Helps users complete tasks step-by-step",
        "Streams responses in real time",
      ]}
    />
  );
}

function SlideTech() {
  const stack = [
    { i: Sparkles, t: "Lovable AI", d: "Application development platform" },
    { i: Cpu, t: "OpenAI API", d: "AI capabilities & responses" },
    { i: Code2, t: "React", d: "Frontend framework" },
    { i: Braces, t: "TypeScript", d: "Type-safe programming language" },
    { i: Palette, t: "Tailwind CSS", d: "UI styling system" },
  ];
  return (
    <div>
      <Kicker icon={Cpu}>Technologies Used</Kicker>
      <h2 className="deck-h2">Built on a modern AI stack.</h2>
      <div className="s-tech-grid">
        {stack.map((s) => (
          <div key={s.t} className="s-tech">
            <div className="s-tech-icon"><s.i className="h-5 w-5" /></div>
            <div>
              <div className="s-tech-t">{s.t}</div>
              <div className="s-tech-d">{s.d}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideHow() {
  const steps = [
    { i: Users, t: "User Input", d: "Prompt, notes or task" },
    { i: Cpu, t: "AI Processing", d: "LLM analyses & generates" },
    { i: Sparkles, t: "Generated Response", d: "Draft, summary or plan" },
    { i: CheckCircle2, t: "User Review", d: "Edit, approve, send" },
  ];
  return (
    <div>
      <Kicker icon={Workflow}>How The System Works</Kicker>
      <h2 className="deck-h2">A simple, transparent workflow.</h2>
      <div className="s-workflow">
        {steps.map((s, k) => (
          <div key={s.t} className="s-workflow-step">
            <div className="s-workflow-num">0{k + 1}</div>
            <div className="s-workflow-icon"><s.i className="h-5 w-5" /></div>
            <div className="s-workflow-t">{s.t}</div>
            <div className="s-workflow-d">{s.d}</div>
            {k < steps.length - 1 && <ArrowRight className="s-workflow-arrow" />}
          </div>
        ))}
      </div>
      <div className="s-workflow-note">
        <Network className="h-4 w-4" />
        Human-in-the-loop: every AI output is reviewed before it leaves the app.
      </div>
    </div>
  );
}

function SlideDemo() {
  const shots = [
    { i: HomeIcon, t: "Home page" },
    { i: Mail, t: "Email Generator" },
    { i: FileText, t: "Meeting Summarizer" },
    { i: ListChecks, t: "Task Planner" },
    { i: Bot, t: "AI Assistant" },
  ];
  return (
    <div>
      <Kicker icon={MonitorPlay}>Application Demo</Kicker>
      <h2 className="deck-h2">Screens from the live product.</h2>
      <div className="s-demo-grid">
        {shots.map((s) => (
          <div key={s.t} className="s-demo">
            <div className="s-demo-bar">
              <span /><span /><span />
            </div>
            <div className="s-demo-body">
              <s.i className="h-8 w-8 opacity-70" />
              <div className="s-demo-t">{s.t}</div>
              <div className="s-demo-hint">Screenshot placeholder</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideBenefits() {
  const items = [
    { i: TrendingUp, t: "Increased productivity" },
    { i: Zap, t: "Reduced repetitive work" },
    { i: Clock, t: "Faster communication" },
    { i: ListChecks, t: "Better organisation" },
    { i: Sparkles, t: "Easy-to-use interface" },
  ];
  return (
    <div>
      <Kicker icon={ShieldCheck}>Benefits</Kicker>
      <h2 className="deck-h2">Real gains for real workdays.</h2>
      <div className="s-obj-grid">
        {items.map((it, k) => (
          <div key={it.t} className="s-obj">
            <div className="s-obj-num">0{k + 1}</div>
            <div className="s-obj-icon"><it.i className="h-5 w-5" /></div>
            <div className="s-obj-t">{it.t}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideFuture() {
  const items = [
    { i: Calendar, t: "Calendar integration" },
    { i: Mic, t: "Voice assistant" },
    { i: Users, t: "User accounts" },
    { i: Cloud, t: "Cloud storage" },
    { i: Smartphone, t: "Mobile application" },
  ];
  return (
    <div>
      <Kicker icon={Rocket}>Future Improvements</Kicker>
      <h2 className="deck-h2">The roadmap ahead.</h2>
      <div className="s-future-grid">
        {items.map((it) => (
          <div key={it.t} className="s-future">
            <it.i className="h-6 w-6" />
            <div className="s-future-t">{it.t}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideConclusion() {
  return (
    <div className="s-two">
      <div>
        <Kicker icon={PresentationIcon}>Conclusion</Kicker>
        <h2 className="deck-h2">AI, applied to everyday work.</h2>
        <p className="deck-body">
          The AI Workplace Productivity Assistant demonstrates how modern AI can
          be practically integrated into daily workflows — not as a novelty, but
          as a quiet, reliable coworker.
        </p>
        <p className="deck-body">
          By automating what is repetitive, it gives people back time for what
          is meaningful: thinking, creating and collaborating.
        </p>
      </div>
      <div className="s-quote">
        <div className="s-quote-mark">“</div>
        <p>
          The best technology disappears into the work — and gives the day
          back to the person doing it.
        </p>
        <div className="s-quote-by">— Project vision</div>
      </div>
    </div>
  );
}

function SlideThanks() {
  return (
    <div className="s-thanks">
      <Kicker icon={Handshake}>Thank you</Kicker>
      <h1 className="deck-h1">
        Thank you. <span className="deck-grad">Any questions?</span>
      </h1>
      <p className="deck-lead">
        Nicolina Makele · AI Workplace Productivity Assistant
      </p>
      <div className="s-thanks-tiles">
        {[Mail, FileText, ListChecks, Bot].map((I, k) => (
          <div key={k} className="s-thanks-tile">
            <I className="h-5 w-5" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------- CSS -------------------------------- */

const deckCss = `
.deck-root {
  --deck-bg: #060b1a;
  --deck-bg-2: #0a1230;
  --deck-fg: #e9eefc;
  --deck-muted: #9aa7c7;
  --deck-line: rgba(255,255,255,0.08);
  --deck-card: rgba(255,255,255,0.04);
  --deck-card-2: rgba(255,255,255,0.06);
  --deck-accent: #6ea8ff;
  --deck-accent-2: #b48cff;
  position: fixed;
  inset: 0;
  color: var(--deck-fg);
  font-family: "Inter", ui-sans-serif, system-ui, sans-serif;
  overflow: hidden;
  background: radial-gradient(120% 80% at 10% 0%, #10205a 0%, var(--deck-bg) 55%, #04081a 100%);
}
.deck-bg {
  position: absolute; inset: 0;
  background:
    radial-gradient(600px 400px at 85% 15%, rgba(110,168,255,0.18), transparent 60%),
    radial-gradient(500px 400px at 10% 90%, rgba(180,140,255,0.14), transparent 60%);
  pointer-events: none;
}
.deck-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse at center, black 40%, transparent 80%);
  pointer-events: none;
}
.deck-topbar {
  position: relative;
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 32px;
  border-bottom: 1px solid var(--deck-line);
  z-index: 2;
}
.deck-brand { display: flex; align-items: center; gap: 10px; font-weight: 600; letter-spacing: -0.01em; }
.deck-brand-dot {
  width: 10px; height: 10px; border-radius: 999px;
  background: linear-gradient(135deg, var(--deck-accent), var(--deck-accent-2));
  box-shadow: 0 0 24px rgba(110,168,255,0.6);
}
.deck-count { font-variant-numeric: tabular-nums; color: var(--deck-fg); font-weight: 600; }
.deck-count-total { color: var(--deck-muted); font-weight: 400; }
.deck-stage {
  position: relative; z-index: 2;
  height: calc(100vh - 140px);
  display: flex; align-items: center; justify-content: center;
  padding: 24px 48px;
}
.deck-slide {
  width: 100%; max-width: 1200px;
  animation: deckIn 480ms cubic-bezier(.2,.7,.2,1);
}
@keyframes deckIn {
  from { opacity: 0; transform: translateY(12px) scale(0.995); }
  to   { opacity: 1; transform: none; }
}
.deck-controls {
  position: relative; z-index: 2;
  display: flex; align-items: center; gap: 16px;
  padding: 16px 32px;
  border-top: 1px solid var(--deck-line);
}
.deck-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 9px 14px; border-radius: 10px;
  background: var(--deck-card); color: var(--deck-fg);
  border: 1px solid var(--deck-line);
  font-size: 13px; font-weight: 500;
  transition: all 200ms;
}
.deck-btn:hover:not(:disabled) { background: var(--deck-card-2); transform: translateY(-1px); }
.deck-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.deck-btn-primary {
  background: linear-gradient(135deg, var(--deck-accent), var(--deck-accent-2));
  color: #0a0f24; border-color: transparent; font-weight: 600;
}
.deck-progress { flex: 1; height: 4px; background: var(--deck-line); border-radius: 999px; overflow: hidden; }
.deck-progress-fill {
  height: 100%; background: linear-gradient(90deg, var(--deck-accent), var(--deck-accent-2));
  transition: width 400ms cubic-bezier(.2,.7,.2,1);
}

/* Typography */
.deck-kicker {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 6px 12px; border-radius: 999px;
  background: rgba(110,168,255,0.1);
  border: 1px solid rgba(110,168,255,0.25);
  color: var(--deck-accent);
  font-size: 12px; font-weight: 600; letter-spacing: 0.02em; text-transform: uppercase;
  margin-bottom: 20px;
}
.deck-h1 {
  font-family: "Fraunces", Georgia, serif;
  font-size: clamp(44px, 6vw, 72px);
  line-height: 1.02; letter-spacing: -0.03em; font-weight: 600;
  margin: 0 0 20px;
}
.deck-h2 {
  font-family: "Fraunces", Georgia, serif;
  font-size: clamp(32px, 4vw, 48px);
  line-height: 1.05; letter-spacing: -0.02em; font-weight: 600;
  margin: 0 0 20px;
}
.deck-grad {
  background: linear-gradient(135deg, var(--deck-accent), var(--deck-accent-2));
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.deck-lead {
  font-size: clamp(16px, 1.4vw, 20px); line-height: 1.55;
  color: var(--deck-muted); max-width: 640px; margin: 0 0 24px;
}
.deck-body {
  font-size: 16px; line-height: 1.65; color: var(--deck-muted);
  margin: 0 0 14px; max-width: 560px;
}
.deck-body b { color: var(--deck-fg); font-weight: 600; }
.deck-list { list-style: none; padding: 0; margin: 16px 0 0; display: grid; gap: 10px; }
.deck-list li { display: flex; align-items: center; gap: 10px; color: var(--deck-fg); font-size: 15px; }
.deck-list svg { color: var(--deck-accent); flex-shrink: 0; }

/* Layouts */
.s-two { display: grid; grid-template-columns: 1.1fr 1fr; gap: 48px; align-items: center; }
@media (max-width: 900px) { .s-two { grid-template-columns: 1fr; gap: 32px; } }

/* Title slide */
.s-title { display: grid; grid-template-columns: 1.2fr 1fr; gap: 48px; align-items: center; }
.s-title-left { position: relative; z-index: 2; }
.s-title-meta { display: flex; gap: 40px; margin-top: 32px; }
.s-title-label { font-size: 11px; color: var(--deck-muted); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px; }
.s-title-value { font-size: 16px; font-weight: 600; }
.s-title-right { position: relative; height: 380px; }
.orb { position: absolute; border-radius: 999px; filter: blur(60px); }
.orb-a { width: 260px; height: 260px; background: rgba(110,168,255,0.5); top: 20px; left: 30px; }
.orb-b { width: 220px; height: 220px; background: rgba(180,140,255,0.4); bottom: 20px; right: 20px; }
.s-title-card {
  position: absolute; inset: 40px; z-index: 2;
  background: rgba(10,18,48,0.7); backdrop-filter: blur(20px);
  border: 1px solid var(--deck-line); border-radius: 20px;
  padding: 22px; display: flex; flex-direction: column; gap: 18px;
  box-shadow: 0 30px 80px -20px rgba(0,0,0,0.6);
}
.s-title-card-row { display: flex; align-items: center; gap: 10px; font-weight: 600; color: var(--deck-accent); font-size: 14px; }
.s-title-card-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
.s-title-card-tile {
  aspect-ratio: 1; border-radius: 12px;
  background: linear-gradient(135deg, rgba(110,168,255,0.15), rgba(180,140,255,0.1));
  border: 1px solid var(--deck-line);
  display: flex; align-items: center; justify-content: center;
  color: var(--deck-fg);
}
.s-title-card-bar { display: grid; grid-template-columns: 2fr 1.5fr 1fr; gap: 6px; margin-top: auto; }
.s-title-card-bar span { height: 6px; border-radius: 999px; background: var(--deck-line); }
.s-title-card-bar span:first-child { background: linear-gradient(90deg, var(--deck-accent), var(--deck-accent-2)); }

/* Cards grid (intro) */
.s-cards { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
.s-card {
  padding: 22px; border-radius: 16px;
  background: var(--deck-card); border: 1px solid var(--deck-line);
  display: flex; flex-direction: column; gap: 12px;
  transition: all 260ms;
}
.s-card:hover { background: var(--deck-card-2); transform: translateY(-2px); border-color: rgba(110,168,255,0.3); }
.s-card svg { color: var(--deck-accent); }
.s-card-t { font-weight: 600; font-size: 15px; }

/* 3-col panels */
.s-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 8px; }
@media (max-width: 900px) { .s-grid-3 { grid-template-columns: 1fr; } }
.s-panel {
  padding: 22px; border-radius: 16px;
  background: var(--deck-card); border: 1px solid var(--deck-line);
}
.s-panel-icon {
  width: 40px; height: 40px; border-radius: 10px;
  background: rgba(110,168,255,0.12); color: var(--deck-accent);
  display: flex; align-items: center; justify-content: center; margin-bottom: 14px;
}
.s-panel-t { font-weight: 600; font-size: 16px; margin-bottom: 6px; }
.s-panel-d { color: var(--deck-muted); font-size: 14px; line-height: 1.5; }

/* Stats */
.s-stat-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 24px; }
@media (max-width: 900px) { .s-stat-row { grid-template-columns: 1fr; } }
.s-stat {
  padding: 20px; border-radius: 14px;
  background: linear-gradient(135deg, rgba(110,168,255,0.08), rgba(180,140,255,0.04));
  border: 1px solid rgba(110,168,255,0.15);
}
.s-stat-v {
  font-family: "Fraunces", Georgia, serif;
  font-size: 36px; font-weight: 600; letter-spacing: -0.02em;
  background: linear-gradient(135deg, var(--deck-accent), var(--deck-accent-2));
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.s-stat-l { color: var(--deck-muted); font-size: 13px; margin-top: 4px; }

/* Objectives */
.s-obj-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; margin-top: 8px; }
@media (max-width: 1000px) { .s-obj-grid { grid-template-columns: repeat(2, 1fr); } }
.s-obj {
  padding: 22px 18px; border-radius: 16px;
  background: var(--deck-card); border: 1px solid var(--deck-line);
  display: flex; flex-direction: column; gap: 12px;
  transition: all 260ms;
}
.s-obj:hover { background: var(--deck-card-2); transform: translateY(-3px); }
.s-obj-num {
  font-family: "Fraunces", Georgia, serif;
  font-size: 13px; color: var(--deck-accent); letter-spacing: 0.1em; font-weight: 600;
}
.s-obj-icon {
  width: 36px; height: 36px; border-radius: 10px;
  background: linear-gradient(135deg, rgba(110,168,255,0.2), rgba(180,140,255,0.15));
  color: var(--deck-fg);
  display: flex; align-items: center; justify-content: center;
}
.s-obj-t { font-weight: 600; font-size: 14px; line-height: 1.35; }

/* Flow (solution) */
.s-flow { display: flex; align-items: center; justify-content: center; gap: 12px; padding: 20px; }
.s-flow-node { display: flex; flex-direction: column; align-items: center; gap: 12px; position: relative; }
.s-flow-node span { font-size: 13px; font-weight: 600; color: var(--deck-fg); }
.s-flow-ring {
  width: 88px; height: 88px; border-radius: 999px;
  background: linear-gradient(135deg, rgba(110,168,255,0.15), rgba(180,140,255,0.1));
  border: 1px solid rgba(110,168,255,0.3);
  display: flex; align-items: center; justify-content: center;
  color: var(--deck-accent);
  box-shadow: 0 0 40px rgba(110,168,255,0.2);
}
.s-flow-arrow { color: var(--deck-muted); width: 24px; height: 24px; margin: 0 8px; }

/* Feature slide visual */
.s-feature-visual {
  position: relative; aspect-ratio: 1; max-width: 380px; margin-left: auto;
  border-radius: 24px;
  background: linear-gradient(135deg, rgba(110,168,255,0.12), rgba(180,140,255,0.08));
  border: 1px solid var(--deck-line);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 40px; gap: 24px;
  overflow: hidden;
}
.s-feature-visual::before {
  content: ""; position: absolute; width: 200px; height: 200px; border-radius: 999px;
  background: radial-gradient(circle, rgba(110,168,255,0.4), transparent 70%);
  top: -60px; right: -60px; filter: blur(30px);
}
.s-feature-icon {
  width: 96px; height: 96px; border-radius: 24px;
  background: linear-gradient(135deg, var(--deck-accent), var(--deck-accent-2));
  color: #0a0f24;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 20px 60px -10px rgba(110,168,255,0.5);
  z-index: 1;
}
.s-feature-lines { display: flex; flex-direction: column; gap: 8px; width: 70%; z-index: 1; }
.s-feature-lines span { height: 8px; border-radius: 999px; background: rgba(255,255,255,0.1); }
.s-feature-lines span:nth-child(1) { width: 100%; background: rgba(255,255,255,0.2); }
.s-feature-lines span:nth-child(2) { width: 80%; }
.s-feature-lines span:nth-child(3) { width: 90%; }
.s-feature-lines span:nth-child(4) { width: 60%; }

/* Tech */
.s-tech-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
@media (max-width: 900px) { .s-tech-grid { grid-template-columns: 1fr; } }
.s-tech {
  padding: 20px; border-radius: 14px;
  background: var(--deck-card); border: 1px solid var(--deck-line);
  display: flex; gap: 14px; align-items: flex-start;
  transition: all 260ms;
}
.s-tech:hover { border-color: rgba(110,168,255,0.3); transform: translateY(-2px); }
.s-tech-icon {
  width: 40px; height: 40px; border-radius: 10px;
  background: rgba(110,168,255,0.12); color: var(--deck-accent);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.s-tech-t { font-weight: 600; font-size: 15px; }
.s-tech-d { color: var(--deck-muted); font-size: 13px; margin-top: 2px; }

/* Workflow */
.s-workflow { display: flex; align-items: stretch; gap: 8px; margin-top: 16px; flex-wrap: nowrap; }
.s-workflow-step {
  flex: 1; padding: 22px 18px; border-radius: 16px;
  background: var(--deck-card); border: 1px solid var(--deck-line);
  display: flex; flex-direction: column; gap: 8px; position: relative;
}
.s-workflow-num {
  font-family: "Fraunces", Georgia, serif; font-size: 12px;
  color: var(--deck-accent); letter-spacing: 0.1em; font-weight: 600;
}
.s-workflow-icon {
  width: 36px; height: 36px; border-radius: 10px;
  background: linear-gradient(135deg, rgba(110,168,255,0.2), rgba(180,140,255,0.15));
  color: var(--deck-fg);
  display: flex; align-items: center; justify-content: center;
}
.s-workflow-t { font-weight: 600; font-size: 15px; margin-top: 4px; }
.s-workflow-d { color: var(--deck-muted); font-size: 13px; }
.s-workflow-arrow {
  position: absolute; right: -18px; top: 50%; transform: translateY(-50%);
  width: 20px; height: 20px; color: var(--deck-accent); z-index: 2;
  background: var(--deck-bg); border-radius: 999px; padding: 2px;
}
.s-workflow-note {
  margin-top: 24px; padding: 14px 18px; border-radius: 12px;
  background: rgba(110,168,255,0.08); border: 1px solid rgba(110,168,255,0.2);
  color: var(--deck-fg); font-size: 14px;
  display: inline-flex; align-items: center; gap: 10px;
}
.s-workflow-note svg { color: var(--deck-accent); }

/* Demo */
.s-demo-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.s-demo-grid > :nth-child(4), .s-demo-grid > :nth-child(5) { grid-column: span 1; }
@media (max-width: 900px) { .s-demo-grid { grid-template-columns: 1fr; } }
.s-demo {
  border-radius: 14px; overflow: hidden;
  background: var(--deck-card); border: 1px solid var(--deck-line);
  transition: all 260ms;
}
.s-demo:hover { transform: translateY(-3px); border-color: rgba(110,168,255,0.3); }
.s-demo-bar {
  display: flex; gap: 6px; padding: 10px 14px;
  border-bottom: 1px solid var(--deck-line);
  background: rgba(0,0,0,0.2);
}
.s-demo-bar span { width: 10px; height: 10px; border-radius: 999px; background: var(--deck-line); }
.s-demo-body {
  aspect-ratio: 16 / 10;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px;
  background: linear-gradient(135deg, rgba(110,168,255,0.05), rgba(180,140,255,0.03));
}
.s-demo-t { font-weight: 600; font-size: 14px; }
.s-demo-hint { color: var(--deck-muted); font-size: 12px; }

/* Future */
.s-future-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; }
@media (max-width: 1000px) { .s-future-grid { grid-template-columns: repeat(2, 1fr); } }
.s-future {
  padding: 24px 18px; border-radius: 16px;
  background: var(--deck-card); border: 1px solid var(--deck-line);
  display: flex; flex-direction: column; align-items: center; gap: 14px;
  text-align: center;
  transition: all 260ms;
}
.s-future:hover { transform: translateY(-3px); background: var(--deck-card-2); }
.s-future svg { color: var(--deck-accent); }
.s-future-t { font-weight: 600; font-size: 14px; }

/* Quote */
.s-quote {
  padding: 40px; border-radius: 20px; position: relative;
  background: linear-gradient(135deg, rgba(110,168,255,0.08), rgba(180,140,255,0.05));
  border: 1px solid var(--deck-line);
}
.s-quote-mark {
  font-family: "Fraunces", Georgia, serif; font-size: 100px;
  line-height: 0.5; color: var(--deck-accent); opacity: 0.5;
  position: absolute; top: 24px; left: 24px;
}
.s-quote p {
  font-family: "Fraunces", Georgia, serif;
  font-size: 22px; line-height: 1.4; font-style: italic;
  margin: 24px 0 20px; color: var(--deck-fg);
}
.s-quote-by { color: var(--deck-muted); font-size: 13px; letter-spacing: 0.02em; }

/* Thanks */
.s-thanks { text-align: center; display: flex; flex-direction: column; align-items: center; }
.s-thanks .deck-kicker { margin: 0 auto 24px; }
.s-thanks-tiles { display: flex; gap: 14px; margin-top: 32px; }
.s-thanks-tile {
  width: 60px; height: 60px; border-radius: 16px;
  background: linear-gradient(135deg, rgba(110,168,255,0.15), rgba(180,140,255,0.1));
  border: 1px solid var(--deck-line);
  display: flex; align-items: center; justify-content: center;
  color: var(--deck-accent);
  transition: all 300ms;
}
.s-thanks-tile:hover { transform: translateY(-4px) scale(1.05); border-color: var(--deck-accent); }
`;
