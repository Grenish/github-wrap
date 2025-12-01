import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { NextResponse } from "next/server";

const analysisSchema = z.object({
  title: z
    .string()
    .describe("2–3 word RPG-class title, e.g. 'Midnight Alchemist'"),
  remarks: z
    .string()
    .describe(
      "Witty, sarcastic or encouraging roast/hype of their coding habits",
    ),
  disciplineLevel: z.enum(["S", "A", "B", "C"]),
  vibe: z.string().describe("Single word that sums up their developer energy"),
});

export async function POST(req: Request) {
  try {
    const { username, stats, timing, streaks, languages } = await req.json();

    const peakLabel =
      timing.peakHour >= 0 && timing.peakHour < 5
        ? "night owl"
        : timing.peakHour >= 12 && timing.peakHour < 17
          ? "afternoon warrior"
          : "9–5 survivor";

    const prompt = `
You are a legendary GitHub bard who turns contribution graphs into epic RPG personas.

User: @${username}

Stats:
• Total commits this year: ${stats.commits}
• Dominant language: ${languages[0]?.name || "Pure Chaos"}
• Longest streak: ${streaks.longest} days
• Peak coding hour: ${timing.peakHour}:00 — ${peakLabel} energy

Create a fun persona with:
- A punchy 2–3 word RPG title (e.g. "Commit Crusader", "Bug-Slaying Berserker")
- A witty, sarcastic, or hyping remark about their habits
- Discipline rank: S (god-tier), A (strong), B (decent), C (rarely seen), D (are you for real?), E (coding is not your thing)
- One-word vibe

Respond with clean JSON only.
`;

    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: analysisSchema,
      prompt,
      system:
        "You are a witty, slightly savage GitHub bard. Keep responses fun and on-point.",
    });

    return NextResponse.json(object);
  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json(
      {
        title: "The Vanished Coder",
        remarks: "Even the AI couldn't find your commits. Spooky.",
        disciplineLevel: "C",
        vibe: "Ghost",
      },
      { status: 500 },
    );
  }
}
