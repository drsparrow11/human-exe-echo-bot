import "dotenv/config";
import { Client, Events, GatewayIntentBits } from "discord.js";
import { mirrorWithEcho } from "./ai.js";
import {
  constellationResponse,
  crisisBoundary,
  echoResponse,
  helpResponse,
  launchResponse,
  linksResponse,
  looksLikeCrisis,
  projectResponse,
  randomSignal,
  residueResponse,
  staticMirror,
  symbolResponse,
  trackResponse,
} from "./responders.js";

const token = process.env.DISCORD_TOKEN;

if (!token) {
  console.error("Missing DISCORD_TOKEN.");
  process.exit(1);
}

const allowedChannels = new Set(
  (process.env.ECHO_ALLOWED_CHANNELS || "")
    .split(",")
    .map((channel) => channel.trim())
    .filter(Boolean),
);

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

function canReplyInChannel(channelId) {
  return allowedChannels.size === 0 || allowedChannels.has(channelId);
}

function shouldAnswerMention(content) {
  const normalized = content.trim().toLowerCase();
  if (!normalized) return true;

  const invitationFragments = [
    "?",
    "echo",
    "human.exe",
    "humanexe",
    "track",
    "signal",
    "mirror",
    "constellation",
    "archive",
    "symbol",
    "remember",
    "reflect",
    "what",
    "why",
    "how",
    "can you",
    "tell me",
    "you still there",
    "are you there",
  ];

  return invitationFragments.some((fragment) => normalized.includes(fragment));
}

async function safeReply(interaction, content) {
  const trimmed = content.length > 1900 ? `${content.slice(0, 1880)}...` : content;
  await interaction.reply({ content: trimmed });
}

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Echo online as ${readyClient.user.tag}.`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  try {
    const command = interaction.commandName;

    if (command === "signal") {
      await safeReply(interaction, randomSignal());
      return;
    }

    if (command === "track") {
      await safeReply(interaction, trackResponse(interaction.options.getString("query", true)));
      return;
    }

    if (command === "mirror") {
      const thought = interaction.options.getString("thought") || "";
      if (looksLikeCrisis(thought)) {
        await safeReply(interaction, crisisBoundary());
        return;
      }

      await interaction.deferReply();
      const response = thought ? await mirrorWithEcho(thought) : staticMirror();
      await interaction.editReply(response);
      return;
    }

    if (command === "constellation") {
      await safeReply(interaction, constellationResponse());
      return;
    }

    if (command === "symbol") {
      await safeReply(interaction, symbolResponse(interaction.options.getString("name") || ""));
      return;
    }

    if (command === "echo") {
      await safeReply(interaction, echoResponse(interaction.options.getString("prompt") || ""));
      return;
    }

    if (command === "humanexe") {
      await safeReply(interaction, projectResponse());
      return;
    }

    if (command === "launch") {
      await safeReply(interaction, launchResponse());
      return;
    }

    if (command === "residue") {
      await safeReply(interaction, residueResponse());
      return;
    }

    if (command === "echohelp") {
      await safeReply(interaction, helpResponse());
      return;
    }

    if (command === "links") {
      await safeReply(interaction, linksResponse());
    }
  } catch (error) {
    console.error(error);

    const message = "Signal interference. Try again in a moment.";
    if (interaction.deferred) {
      await interaction.editReply(message);
    } else if (!interaction.replied) {
      await interaction.reply({ content: message, ephemeral: true });
    }
  }
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot || !message.mentions.has(client.user)) return;
  if (!canReplyInChannel(message.channelId)) return;

  const cleaned = message.content.replace(`<@${client.user.id}>`, "").replace(`<@!${client.user.id}>`, "").trim();
  if (!shouldAnswerMention(cleaned)) return;

  if (looksLikeCrisis(cleaned)) {
    await message.reply(crisisBoundary());
    return;
  }

  if (!cleaned) {
    await message.reply("I am here. Quietly.");
    return;
  }

  try {
    const response = await mirrorWithEcho(cleaned, { allowSilence: true });
    if (!response) return;

    await message.reply(response.length > 1900 ? `${response.slice(0, 1880)}...` : response);
  } catch (error) {
    console.error(error);
    await message.reply("Signal interference. I am still here.");
  }
});

client.login(token);
