import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { cookies } from "next/headers";
import { SESSION_COOKIE, isValidSession } from "@/lib/session";
import { buildInstructions } from "@/lib/tutor";

// Limity wejścia: chronią budżet klucza od LABA.
const MAX_MESSAGES = 40;
const MAX_CHARS_PER_MESSAGE = 6000;

function textLength(message: UIMessage) {
  return message.parts.reduce((sum, part) => sum + (part.type === "text" ? part.text.length : 0), 0);
}

export async function POST(req: Request) {
  // Najpierw sesja — bez niej nie wywołujemy modelu.
  const cookieStore = await cookies();
  if (!isValidSession(cookieStore.get(SESSION_COOKIE)?.value)) {
    return Response.json({ error: "Brak dostępu. Wpisz hasło." }, { status: 401 });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL;

  if (!apiKey || !model) {
    return Response.json(
      { error: "Brak konfiguracji: uzupełnij OPENROUTER_API_KEY i OPENROUTER_MODEL w .env.local i uruchom serwer ponownie." },
      { status: 500 },
    );
  }

  const body = await req.json().catch(() => null);
  const messages: UIMessage[] = Array.isArray(body?.messages) ? body.messages : [];

  if (messages.length === 0) {
    return Response.json({ error: "Pusta wiadomość." }, { status: 400 });
  }
  if (messages.length > MAX_MESSAGES) {
    return Response.json(
      { error: `Rozmowa jest za długa (limit ${MAX_MESSAGES} wiadomości). Kliknij „Nowa rozmowa”.` },
      { status: 400 },
    );
  }
  if (messages.some((m) => textLength(m) > MAX_CHARS_PER_MESSAGE)) {
    return Response.json(
      { error: `Wiadomość jest za długa (limit ${MAX_CHARS_PER_MESSAGE} znaków). Skróć ją albo wyślij w częściach.` },
      { status: 400 },
    );
  }

  const openrouter = createOpenRouter({ apiKey });

  const result = streamText({
    model: openrouter(model),
    instructions: buildInstructions(),
    messages: await convertToModelMessages(messages),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      onError: () => "Model nie odpowiedział. Sprawdź klucz i nazwę modelu, potem spróbuj ponownie.",
    }),
  });
}
