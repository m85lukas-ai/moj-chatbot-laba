// Tworzy .env.local, jeśli go nie ma. SESSION_SECRET powstaje lokalnie i nie jest wypisywany.
import { existsSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";

const file = ".env.local";
if (existsSync(file)) {
  console.log(".env.local juz istnieje - nie zmieniam go.");
} else {
  const secret = randomBytes(32).toString("hex");
  writeFileSync(
    file,
    ["OPENROUTER_API_KEY=", "OPENROUTER_MODEL=", "CHAT_PASSWORD=", `SESSION_SECRET=${secret}`, ""].join("\r\n"),
  );
  console.log("Utworzono .env.local z wygenerowanym SESSION_SECRET.");
}
