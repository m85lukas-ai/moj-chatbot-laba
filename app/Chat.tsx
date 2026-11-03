"use client";

import { useChat } from "@ai-sdk/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Gotowe polecenia — szybki start trybów nauki.
const MODES = [
  { label: "Wyjaśnij", text: "Tryb WYJAŚNIJ: czym różni się chatbot, workflow i agent?" },
  { label: "Quiz", text: "Tryb QUIZ: przepytaj mnie z ostatniej lekcji." },
  { label: "Sprawdź zadanie", text: "Tryb SPRAWDŹ ZADANIE: pomóż mi z zadaniem praktycznym 1. Co już mam, a czego brakuje?" },
  { label: "Co dalej?", text: "Tryb CO DALEJ: gdzie jestem w kursie i jak przygotować się do najbliższych zajęć?" },
];

export default function Chat() {
  const router = useRouter();
  const [text, setText] = useState("");
  const { messages, sendMessage, setMessages, status, error, stop } = useChat();

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    router.refresh();
  }

  const busy = status === "submitted" || status === "streaming";

  function send(value: string) {
    const trimmed = value.trim();
    if (!trimmed || busy) return;
    sendMessage({ text: trimmed });
    setText("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    send(text);
  }

  return (
    <main className="chat">
      <header className="top">
        <div>
          <h1>Tutor LABA</h1>
          <p className="subtitle">Kurs: Tworzenie i wdrażanie autonomicznych Agentów AI</p>
        </div>
        <div className="top-actions">
          <button type="button" className="logout" onClick={() => setMessages([])} disabled={busy}>
            Nowa rozmowa
          </button>
          <button type="button" className="logout" onClick={logout}>
            Wyjdź
          </button>
        </div>
      </header>
      <div className="modes" aria-label="Tryby nauki">
        {MODES.map((m) => (
          <button key={m.label} type="button" className="mode" disabled={busy} onClick={() => send(m.text)}>
            {m.label}
          </button>
        ))}
      </div>
      <div className="messages" aria-label="Rozmowa">
        {messages.length === 0 && (
          <div className="empty">
            Zapytaj o dowolny temat z kursu albo wybierz tryb powyżej.
            <br />
            Nowe notatki z lekcji dodawaj do folderu <code>wiedza/</code>.
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`message ${m.role === "user" ? "user" : "bot"}`}>
            {m.parts.map((part, i) => (part.type === "text" ? <span key={i}>{part.text}</span> : null))}
          </div>
        ))}
        {status === "submitted" && <div className="message bot waiting">Myślę…</div>}
        {error && <div className="error">{readError(error)}</div>}
      </div>
      <form className="input-row" onSubmit={handleSubmit}>
        <textarea
          rows={2}
          placeholder="Napisz pytanie… (Enter wysyła, Shift+Enter nowa linia)"
          value={text}
          maxLength={6000}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(text);
            }
          }}
        />
        {status === "streaming" ? (
          <button type="button" onClick={() => stop()}>
            Stop
          </button>
        ) : (
          <button type="submit" disabled={busy || !text.trim()}>
            Wyślij
          </button>
        )}
      </form>
    </main>
  );
}

// Błąd z serwera przychodzi jako tekst JSON, np. {"error":"..."}.
function readError(error: Error) {
  try {
    const parsed = JSON.parse(error.message);
    if (parsed.error) return parsed.error;
  } catch {}
  return error.message || "Coś poszło nie tak. Spróbuj ponownie.";
}
