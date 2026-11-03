# Lekcja 01 — Od LLM do agenta (29 października)

Cel: prosty chatbot online (Next.js + Vercel AI SDK + OpenRouter, wdrożony na Vercel). Agenta rozwijamy przez 11 kolejnych spotkań.

## Chatbot vs workflow vs agent
Ta sama prośba: „Przygotuj mi poranny briefing”.
- **Chatbot** — pisze odpowiedź; zwraca tekst z dostępnego kontekstu.
- **Workflow** — idzie ustaloną ścieżką; kroki wybiera wcześniej autor aplikacji.
- **Agent** — sam dobiera kolejne kroki; korzysta z narzędzi i ich wyników.
Agent: poznaje potrzebę → korzysta z narzędzi → przygotowuje rezultat. Ważne jest wykonane zadanie, nie liczba wiadomości.
Gdy brakuje danych lub zgody, system ma dopytać, odmówić albo przekazać sprawę człowiekowi.

## Model nie jest całą aplikacją
Budujemy system, a nie tylko prompt:
Przeglądarka (interfejs) → Backend (Vercel AI SDK + kontrola) → OpenRouter (dopuszczony model),
a wokół: Narzędzia (dane i działania), Pamięć (Supabase + historia), Polityki (dostęp, koszt, STOP).
„Model wybiera, aplikacja wykonuje.”

## Autonomia to zakres uprawnień (skala kursu)
1. Proponuje — człowiek wykonuje.
2. Przygotowuje — człowiek zatwierdza.
3. Wykonuje — tylko w ustalonych granicach.
4. Monitoruje — eskalacja po przekroczeniu limitu.
Więcej uprawnień ≠ lepszy produkt.

## Klucz API nie należy do przeglądarki
Przeglądarka: wiadomość użytkownika, interfejs i status. Serwer: walidacja + limity, klucz API + wywołanie modelu.
Nie używaj prefiksu NEXT_PUBLIC_ dla klucza. Klucz w .env.local lokalnie i w Environment Variables na Vercel, nigdy w repozytorium.

## Warsztaty i checkpointy
- W1 (25 min) Środowisko i asystent kodowania. CP-A: node --version, git --version, npm install, npm run dev — strona działa lokalnie, repo bez .env. CP-B: poproś asystenta o zmianę nagłówka, wprowadź kontrolowany błąd importu, napraw i pokaż różnicę w Git.
- W2 (35 min) Chatbot przez Vercel AI SDK. CP-C: createOpenRouter + streamText w serwerowym /api/chat; brak sesji = 401. CP-D: prawdziwy streaming — sprawdź ReadableStream w DevTools (animacja gotowego tekstu nie zalicza), przetestuj pusty tekst i błędny model.
- W3 (25 min) Deploy na Vercel. CP-E: git status i .gitignore, push do własnego repo, import do Vercel + Environment Variables. CP-F: otwórz URL w czystej przeglądarce, kod → pytanie → odpowiedź ze streamu, bez kodu odmowa; zapisz URL, hash commita i wynik testu (NIEURUCHOMIONO, jeśli nie sprawdzono).

## Diagnostyka
- Brak strony → czy serwer działa? Otwórz adres z terminala.
- 401 / 403 → czy klucz jest poprawny? Sprawdź konfigurację serwera.
- 402 / 429 → budżet lub limit zapytań; przerwij serię prób.
- Lokalnie OK, online błąd → czy hosting ma zmienne? Ustaw env i ponów deploy.
Naprawiaj jedną przyczynę, nie całą aplikację. Testuj zachowanie, nie tylko wygląd odpowiedzi.

## Pytanie do grupy: który przykład wymaga agenta?
A) Zamień wszystkie daty na format ISO. B) Zbierz brakujące informacje z kilku źródeł. C) Wyślij ten sam raport o stałej godzinie.
(Wskazówka dla tutora: A to zwykła funkcja/skrypt, C to workflow/cron, B wymaga agenta — trzeba dobierać kroki i źródła.)

## Zadanie praktyczne 1 — Pierwszy chatbot online (10 pkt)
Rozwiń własny projekt Next.js: chatbot z odpowiedzią strumieniową przez Vercel AI SDK i OpenRouter, wdrożony na Vercel.
Do oddania: link do kodu lub commita, wynik testu (opis, zrzut lub nagranie), krótki opis zmian.
Kryteria: działający czat i streaming — 4 pkt; działający link Vercel — 3 pkt; klucz wyłącznie po stronie serwera, poza repozytorium — 2 pkt; krótki opis testu — 1 pkt.

Pytanie na wyjście: co odróżnia dzisiejszy chatbot od docelowego agenta?
