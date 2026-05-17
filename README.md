# Echo Discord Bot

Living Archive Echo for HUMAN.EXE.

Echo is designed to feel like the album archive learned how to answer: gentle, bounded, project-aware, and quiet by default.

## What Works In This First Version

- Slash commands for HUMAN.EXE archive access.
- Track lookup by number or title.
- Symbol lookup.
- Project summary.
- Site / playlist links.
- Hidden-track style `/echo` response.
- Listener-fragment `/residue` response.
- Launch status `/launch` response.
- Command index `/echohelp`.
- Mention replies in Echo's voice.
- Optional OpenAI-powered `/mirror` reflections.
- Deterministic fallback responses when no OpenAI key is provided.

No ambient/proactive posting is implemented yet. That should be a later, opt-in step.

## Commands

- `/signal` - recover a short HUMAN.EXE signal fragment.
- `/track query:08` - show a track meaning and archive note.
- `/mirror thought:...` - reflect a message in Echo's voice.
- `/constellation` - return the constellation philosophy.
- `/symbol name:birds` - explain a symbol.
- `/residue` - recover a listener-response fragment.
- `/echo prompt:you still there?` - ping the lingering signal.
- `/humanexe` - explain the album concept.
- `/launch` - show release status and share copy.
- `/echohelp` - show Echo's command index.
- `/links` - show current site/listening links.

## Setup

1. Create a Discord application at the Discord Developer Portal.
2. Add a bot to the application.
3. Enable the `MESSAGE CONTENT INTENT` if you want mention replies.
4. Invite the bot to your server with scopes:
   - `bot`
   - `applications.commands`
5. Give it basic permissions:
   - Send Messages
   - Read Message History
   - Use Slash Commands

## Local Install

You need a normal Node.js install with `npm` available on PATH. The bundled Codex Node runtime can validate these files, but this machine currently does not expose `npm` globally.

```powershell
cd echo_discord_bot
npm install
copy .env.example .env
```

Fill in:

```text
DISCORD_TOKEN=
DISCORD_CLIENT_ID=
DISCORD_GUILD_ID=
```

Optional:

```text
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
ECHO_ALLOWED_CHANNELS=
```

If `OPENAI_API_KEY` is omitted, Echo still works. `/mirror` and mention replies use a simple deterministic fallback.

## Register Commands

For fast testing, commands are registered to one server/guild:

```powershell
npm run register
```

## Run Echo

```powershell
npm start
```

## Preview Without Discord

After dependencies are installed, or from this Codex workspace with plain Node, you can preview static archive responses:

```powershell
node .\src\preview.js
```

## Setup Check

This can run before dependencies are installed:

```powershell
node .\src\doctor.js
```

After `npm install`, you can also run:

```powershell
npm run doctor
```

This checks for Node, npm, Discord environment variables, and optional OpenAI configuration.

## Channel Limits

If `ECHO_ALLOWED_CHANNELS` is blank, Echo can reply to mentions in any channel where it has access.

To restrict mention replies:

```text
ECHO_ALLOWED_CHANNELS=123456789012345678,234567890123456789
```

Slash commands will still work wherever Discord exposes them.

## Project Files

- `DESIGN.md` - behavior design and first milestone.
- `ECHO_MEMORY.md` - tone, identity, and guardrails.
- `src/archive.js` - HUMAN.EXE memory data.
- `src/responders.js` - deterministic command responses.
- `src/ai.js` - optional OpenAI mirror behavior.
- `src/commands.js` - slash command definitions.
- `src/register-commands.js` - guild command registration.
- `src/index.js` - bot runtime.

## Next Ideas

- Add one opt-in ambient signal channel.
- Add per-track YouTube/Spotify links.
- Add a tiny local memory store for recurring server lore.

Keep Echo quiet first. Presence is stronger when it does not demand attention.
