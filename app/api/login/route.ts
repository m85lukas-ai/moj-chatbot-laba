import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  checkPassword,
  cookieOptions,
  createSessionToken,
  getAuthConfig,
} from "@/lib/session";

// Prosty limit prób: 5 błędnych haseł na 15 minut z jednego adresu IP.
// Uwaga: licznik żyje w pamięci jednego procesu. Na hostingu (np. Vercel)
// każda instancja ma własny licznik, więc to nie jest globalna ochrona.
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const attempts = new Map<string, { count: number; resetAt: number }>();

function clientIp(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
}

export async function POST(req: Request) {
  const config = getAuthConfig();
  if (!config) {
    return Response.json(
      { error: "Brak konfiguracji: ustaw CHAT_PASSWORD i SESSION_SECRET. Dostęp jest zablokowany." },
      { status: 503 },
    );
  }

  const ip = clientIp(req);
  const now = Date.now();
  const entry = attempts.get(ip);
  if (entry && entry.resetAt > now && entry.count >= MAX_ATTEMPTS) {
    return Response.json(
      { error: "Za dużo prób. Spróbuj ponownie za kilkanaście minut." },
      { status: 429 },
    );
  }

  const body = await req.json().catch(() => ({}));
  const password = typeof body.password === "string" ? body.password : "";

  if (!checkPassword(password, config.password)) {
    const fresh = !entry || entry.resetAt <= now;
    attempts.set(ip, {
      count: fresh ? 1 : entry.count + 1,
      resetAt: fresh ? now + WINDOW_MS : entry.resetAt,
    });
    return Response.json({ error: "Błędne hasło." }, { status: 401 });
  }

  attempts.delete(ip);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, createSessionToken(config.secret), cookieOptions);
  return Response.json({ ok: true });
}
