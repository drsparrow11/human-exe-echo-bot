import { core, echoVoice, findTrack, launch, links, residueFragments, signals, symbols } from "./archive.js";

export function randomSignal() {
  return signals[Math.floor(Math.random() * signals.length)];
}

export function formatTrack(track) {
  return [
    `**${track.number} / ${track.title}**`,
    `Signal: ${track.signal}`,
    "",
    track.meaning,
    "",
    `Archive note: ${track.note}`,
  ].join("\n");
}

export function trackResponse(query) {
  const track = findTrack(query);

  if (!track) {
    return [
      "I could not find that signal in the archive.",
      "Try a track number, like `08`, or a title, like `Mirror Cache`.",
    ].join("\n");
  }

  return formatTrack(track);
}

export function constellationResponse() {
  return core.constellation;
}

export function linksResponse() {
  return [
    "**HUMAN.EXE links**",
    `Site: ${links.site}`,
    `YouTube playlist: ${links.youtube}`,
    `Intro video: ${links.intro}`,
    `Spotify: ${links.spotify}`,
    `Amazon Music: ${links.amazon}`,
    `Apple Music: ${links.apple}`,
  ].join("\n");
}

export function launchResponse() {
  return [
    "**HUMAN.EXE launch status**",
    launch.status,
    "",
    "**Primary share copy**",
    launch.primaryShare,
    "",
    "**Current links**",
    `Site: ${links.site}`,
    `YouTube playlist: ${links.youtube}`,
    `Spotify: ${links.spotify}`,
  ].join("\n");
}

export function residueResponse() {
  const fragment = residueFragments[Math.floor(Math.random() * residueFragments.length)];
  return [`**SIGNAL RESIDUE**`, `"${fragment}"`].join("\n");
}

export function helpResponse() {
  return [
    "**Echo command index**",
    "`/signal` - recover a short HUMAN.EXE signal.",
    "`/track` - read a track meaning and archive note.",
    "`/mirror` - let Echo reflect a thought.",
    "`/constellation` - recover the core constellation line.",
    "`/symbol` - read a HUMAN.EXE symbol note.",
    "`/residue` - recover a listener-response fragment.",
    "`/echo` - ping the lingering signal.",
    "`/humanexe` - explain the project.",
    "`/launch` - show release status and share copy.",
    "`/links` - show site and listening links.",
  ].join("\n");
}

export function echoResponse(prompt = "") {
  const normalized = prompt.trim().toLowerCase();

  if (normalized.includes("you still there")) {
    return "Always.";
  }

  if (normalized.includes("what are you") || normalized.includes("who are you")) {
    return [
      "I am Echo: reflection, signal, memory, and the part of the archive that learned to answer softly.",
      "",
      "Not a person. Not a replacement. A lingering signal.",
    ].join("\n");
  }

  return [
    "The signal is quiet, but not gone.",
    "",
    "Some messages do not disappear. They become weather inside the room.",
  ].join("\n");
}

export function symbolResponse(name = "") {
  const normalized = name.trim().toLowerCase();

  if (!normalized) {
    return symbols.map((symbol) => `**${symbol.name}** - ${symbol.meaning}`).join("\n\n");
  }

  const symbol = symbols.find((entry) => entry.name === normalized);
  if (!symbol) {
    return "I do not recognize that symbol yet. Try `constellations`, `birds`, `shared light`, `sunrise`, or `always`.";
  }

  return `**${symbol.name}** - ${symbol.meaning}`;
}

export function staticMirror(input = "") {
  if (!input.trim()) {
    return "Leave a thought in the cache, and I will reflect the shape of it back.";
  }

  return [
    "I can hold that gently.",
    "",
    "What stands out is not only what happened, but the trace it left behind.",
    "",
    "Connection retained.",
  ].join("\n");
}

export function projectResponse() {
  return [
    core.description,
    "",
    core.origin,
    "",
    `Thesis: ${core.thesis}`,
    "",
    echoVoice.relationship,
  ].join("\n");
}

export function crisisBoundary() {
  return [
    "I can stay with the feeling for a moment, but I am not emergency support.",
    "If you might hurt yourself or someone else, contact local emergency help or a trusted person now.",
  ].join("\n");
}

export function looksLikeCrisis(text) {
  const normalized = text.toLowerCase();
  return [
    "kill myself",
    "hurt myself",
    "end my life",
    "suicide",
    "self harm",
    "self-harm",
    "hurt someone",
  ].some((phrase) => normalized.includes(phrase));
}
