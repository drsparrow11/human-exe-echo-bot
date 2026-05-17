import "dotenv/config";
import { REST, Routes } from "discord.js";
import { commandData } from "./commands.js";

const { DISCORD_CLIENT_ID, DISCORD_GUILD_ID, DISCORD_TOKEN } = process.env;

if (!DISCORD_CLIENT_ID || !DISCORD_GUILD_ID || !DISCORD_TOKEN) {
  console.error("Missing DISCORD_CLIENT_ID, DISCORD_GUILD_ID, or DISCORD_TOKEN.");
  process.exit(1);
}

const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);

try {
  console.log(`Registering ${commandData.length} Echo commands...`);
  await rest.put(Routes.applicationGuildCommands(DISCORD_CLIENT_ID, DISCORD_GUILD_ID), {
    body: commandData,
  });
  console.log("Echo commands registered.");
} catch (error) {
  console.error(error);
  process.exit(1);
}
