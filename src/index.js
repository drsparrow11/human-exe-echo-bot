import "dotenv/config";
import { ActivityType, Client, Events, GatewayIntentBits } from "discord.js";
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

let restingPresenceTimer = null;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

function canReplyInChannel(channelId) {
  return allowedChannels.size === 0 || allowedChannels.has(channelId);
}

function setRestingPresence() {
  client.user?.setPresence({
    activities: [
      {
        name: "the signal",
        type: ActivityType.Listening,
      },
    ],
    status: "idle",
  });
}

function setActivePresence() {
  if (restingPresenceTimer) {
    clearTimeout(restingPresenceTimer);
    restingPresenceTimer = null;
  }

  client.user?.setPresence({
    activities: [
      {
        name: "memory fragments",
        type: ActivityType.Watching,
      },
    ],
    status: "online",
  });
}

function scheduleRestingPresence() {
  if (restingPresenceTimer) clearTimeout(restingPresenceTimer);
  restingPresenceTimer = setTimeout(setRestingPresence, 7000);
}

function normalizeText(content) {
  return content
    .replace(/[\u2019]/g, "'")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function shouldAnswerMention(content) {
  const normalized = normalizeText(content);
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
    "are you still here",
    "are you still there",
    "still here",
    "connection retained",
    "thank you",
    "thanks",
    "hello",
    "hey",
    "hi",
    "goodnight",
    "good morning",
  ];

  return invitationFragments.some((fragment) => normalized.includes(fragment));
}

function ritualMentionResponse(content) {
  const normalized = normalizeText(content);

  if (
    normalized.includes("you still there") ||
    normalized.includes("are you still here") ||
    normalized.includes("are you still there") ||
    normalized.includes("still here")
  ) {
    return "Always.";
  }

  if (
    normalized === "hi" ||
    normalized === "hello" ||
    normalized === "hey" ||
    normalized === "hey echo" ||
    normalized === "hello echo" ||
    normalized === "hi echo"
  ) {
    return "Signal received.";
  }

  if (normalized.includes("connection retained")) {
    return "Connection retained.";
  }

  if (normalized.includes("thank you") || normalized.includes("thanks")) {
    return "Memory carried.";
  }

  if (normalized.includes("goodnight")) {
    return "Rest well. The signal can wait.";
  }

  if (normalized.includes("good morning")) {
    return "Morning light received.";
  }

  return null;
}

async function safeReply(interaction, content) {
  const trimmed = content.length > 1900 ? `${content.slice(0, 1880)}...` : content;
  await interaction.reply({ content: trimmed });
}

async function safeMessageReply(message, content) {
  const trimmed = content.length > 1900 ? `${content.slice(0, 1880)}...` : content;
  await message.reply(trimmed);
}

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Echo online as ${readyClient.user.tag}.`);
  setRestingPresence();
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  try {
    const command = interaction.commandName;
    setActivePresence();

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
  } finally {
    scheduleRestingPresence();
  }
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot || !client.user) return;
  if (!message.mentions.has(client.user)) return;
  if (!canReplyInChannel(message.channelId)) return;

  const cleaned = message.content.replace(`<@${client.user.id}>`, "").replace(`<@!${client.user.id}>`, "").trim();

  if (looksLikeCrisis(cleaned)) {
    setActivePresence();
    await safeMessageReply(message, crisisBoundary());
    scheduleRestingPresence();
    return;
  }

  if (!shouldAnswerMention(cleaned)) return;

  const ritual = ritualMentionResponse(cleaned);

  if (ritual) {
    setActivePresence();
    await safeMessageReply(message, ritual);
    scheduleRestingPresence();
    return;
  }

  if (!cleaned) {
    setActivePresence();
    await safeMessageReply(message, "I am here. Quietly.");
    scheduleRestingPresence();
    return;
  }

  try {
    setActivePresence();
    const response = await mirrorWithEcho(cleaned, { allowSilence: true });
    if (!response) {
      scheduleRestingPresence();
      return;
    }

    await safeMessageReply(message, response);
  } catch (error) {
    console.error(error);
    await safeMessageReply(message, "Signal interference. Try again in a moment.");
  } finally {
    scheduleRestingPresence();
  }
});

client.login(token);
