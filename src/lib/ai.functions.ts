import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const MODEL = "google/gemini-3-flash-preview";

function getModel() {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  return createLovableAiGatewayProvider(key)(MODEL);
}

const EmailInput = z.object({
  context: z.string().min(1).max(4000),
  type: z.enum(["formal", "friendly", "follow-up", "apology", "request"]),
  tone: z.enum(["professional", "casual", "warm", "concise", "assertive"]),
  action: z.enum(["generate", "rewrite", "shorten", "expand", "improve"]).default("generate"),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => EmailInput.parse(d))
  .handler(async ({ data }) => {
    const prompt = `You are an expert email writer. ${
      data.action === "generate"
        ? `Write a ${data.type} email with a ${data.tone} tone.`
        : `${data.action.toUpperCase()} the following email, keeping it ${data.type} and ${data.tone}.`
    }

Input:
${data.context}

Return only the final email body with a subject line on the first line prefixed with "Subject: ".`;
    const { text } = await generateText({ model: getModel(), prompt });
    return { text };
  });

const MeetingInput = z.object({
  notes: z.string().min(1).max(20000),
});

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => MeetingInput.parse(d))
  .handler(async ({ data }) => {
    const prompt = `Analyze these meeting notes and produce a well-structured markdown summary with these sections:

## Summary
(2-3 sentence overview)

## Key Discussion Points
- bullet list

## Decisions Made
- bullet list

## Action Items
- **Owner** — Task — *Deadline (if any)*

## Deadlines
- bullet list of dated items

Notes:
${data.notes}`;
    const { text } = await generateText({ model: getModel(), prompt });
    return { text };
  });
