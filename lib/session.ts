import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "chat_session";
export const SESSION_MAX_AGE = 60 * 60 * 12; // 12 godzin

// Zwraca konfigurację albo null, gdy czegoś brakuje.
// Brak konfiguracji blokuje dostęp — nigdy nie wyłącza ochrony.
export function getAuthConfig() {
  const password = process.env.CHAT_PASSWORD;
  const secret = process.env.SESSION_SECRET;
  if (!password || !secret || secret.length < 32) return null;
  return { password, secret };
}

function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function safeEqual(a: string, b: string) {
  // Porównujemy skróty, żeby długość tekstu nie zdradzała niczego.
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function checkPassword(input: string, password: string) {
  return safeEqual(input, password);
}

// Token: "<czas wygaśnięcia>.<podpis>". Hasło nie trafia do cookie.
export function createSessionToken(secret: string) {
  const expires = String(Date.now() + SESSION_MAX_AGE * 1000);
  return `${expires}.${sign(expires, secret)}`;
}

export function isValidSession(token: string | undefined) {
  const config = getAuthConfig();
  if (!config || !token) return false;
  const [expires, signature] = token.split(".");
  if (!expires || !signature) return false;
  if (!safeEqual(signature, sign(expires, config.secret))) return false;
  return Number(expires) > Date.now();
}

export const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_MAX_AGE,
};
