import { existsSync, readFileSync } from "node:fs";
import { execSync } from "node:child_process";

if (existsSync(".env")) {
  const envText = readFileSync(".env", "utf8");
  for (const line of envText.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const equalsIndex = trimmed.indexOf("=");
    if (equalsIndex === -1) continue;

    const key = trimmed.slice(0, equalsIndex).trim();
    const value = trimmed.slice(equalsIndex + 1).trim();
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}

function checkCommand(command) {
  try {
    execSync(`${command} --version`, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function status(label, ok, detail = "") {
  const mark = ok ? "OK" : "MISSING";
  console.log(`${mark.padEnd(8)} ${label}${detail ? ` - ${detail}` : ""}`);
}

console.log("Echo setup check\n");

status("package.json", existsSync("package.json"));
status(".env", existsSync(".env"), existsSync(".env") ? "loaded by dotenv" : "copy .env.example to .env");
status("node", checkCommand("node"));
status("npm", checkCommand("npm"), "needed for npm install/register/start scripts");

status("DISCORD_TOKEN", Boolean(process.env.DISCORD_TOKEN));
status("DISCORD_CLIENT_ID", Boolean(process.env.DISCORD_CLIENT_ID));
status("DISCORD_GUILD_ID", Boolean(process.env.DISCORD_GUILD_ID));
status("OPENAI_API_KEY", Boolean(process.env.OPENAI_API_KEY), "optional");
status("ECHO_ALLOWED_CHANNELS", Boolean(process.env.ECHO_ALLOWED_CHANNELS), "optional");

console.log("\nIf Discord values are missing, create a Discord application/bot and fill .env.");
console.log("If npm is missing, install Node.js from https://nodejs.org/ and reopen PowerShell.");
