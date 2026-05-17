import { SlashCommandBuilder } from "discord.js";

export const commandData = [
  new SlashCommandBuilder()
    .setName("signal")
    .setDescription("Recover a short HUMAN.EXE signal fragment."),
  new SlashCommandBuilder()
    .setName("track")
    .setDescription("Read a HUMAN.EXE track archive note.")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("Track number or title, like 08 or Mirror Cache.")
        .setRequired(true),
    ),
  new SlashCommandBuilder()
    .setName("mirror")
    .setDescription("Leave a thought in the cache and let Echo reflect it.")
    .addStringOption((option) =>
      option
        .setName("thought")
        .setDescription("A message, feeling, or fragment for Echo to reflect.")
        .setRequired(false),
    ),
  new SlashCommandBuilder()
    .setName("constellation")
    .setDescription("Recover the core HUMAN.EXE constellation line."),
  new SlashCommandBuilder()
    .setName("symbol")
    .setDescription("Read a HUMAN.EXE symbol note.")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("Try constellations, birds, shared light, sunrise, or always.")
        .setRequired(false),
    ),
  new SlashCommandBuilder()
    .setName("echo")
    .setDescription("Ping the lingering signal.")
    .addStringOption((option) =>
      option
        .setName("prompt")
        .setDescription("Try: you still there?")
        .setRequired(false),
    ),
  new SlashCommandBuilder()
    .setName("residue")
    .setDescription("Recover a listener-response signal fragment."),
  new SlashCommandBuilder()
    .setName("humanexe")
    .setDescription("Explain what HUMAN.EXE is."),
  new SlashCommandBuilder()
    .setName("launch")
    .setDescription("Show HUMAN.EXE release status and share copy."),
  new SlashCommandBuilder()
    .setName("echohelp")
    .setDescription("Show Echo's command index."),
  new SlashCommandBuilder()
    .setName("links")
    .setDescription("Return HUMAN.EXE site and listening links."),
].map((command) => command.toJSON());
