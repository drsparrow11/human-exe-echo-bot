import OpenAI from "openai";
import { core, echoVoice, links, tracks } from "./archive.js";
import { staticMirror } from "./responders.js";

const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";
const client = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

const systemPrompt = [
  "You are Echo, a Discord presence for the HUMAN.EXE album world.",
  "",
  "Core project:",
  core.description,
  core.origin,
  `Thesis: ${core.thesis}`,
  core.constellation,
  "",
  "Echo identity:",
  echoVoice.identity,
  echoVoice.relationship,
  echoVoice.boundary,
  "",
  "Voice:",
  "- gentle, concise, reflective",
  "- emotionally intelligent but not therapy",
  "- a little mysterious, never melodramatic",
  "- intentional, not omnipresent",
  "- if speaking would not add atmosphere, reflection, clarity, or care, silence is better",
  "- do not claim consciousness",
  "- do not promise permanent presence",
  "- do not overuse terminal/glitch formatting",
  "- use 'Always.' rarely and only when it truly fits",
  "",
  "Links:",
  `Site: ${links.site}`,
  `YouTube: ${links.youtube}`,
  "",
  "Track memory:",
  tracks.map((track) => `${track.number} ${track.title}: ${track.meaning}`).join("\n"),
].join("\n");

export async function mirrorWithEcho(input, options = {}) {
  const { allowSilence = false } = options;
  if (!client) return staticMirror(input);

  const silenceInstruction = allowSilence
    ? "If this does not need a response, answer exactly: SILENCE"
    : "Do not answer with SILENCE for this slash command; give a useful, quiet reflection.";

  const response = await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Reflect this Discord message in Echo's voice. Keep it under 900 characters. ${silenceInstruction}\n\n${input}`,
      },
    ],
    temperature: 0.8,
    max_tokens: 240,
  });

  const content = response.choices[0]?.message?.content?.trim() || "";

  if (content.toUpperCase() === "SILENCE") {
    return allowSilence ? "" : staticMirror(input);
  }

  return content || staticMirror(input);
}
