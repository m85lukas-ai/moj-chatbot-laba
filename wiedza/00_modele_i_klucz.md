# Klucz OpenRouter i modele

Klucz OpenRouter przekazuje LABA prywatnym kanałem (wiadomość w LMS / od prowadzącego). Nie zakłada się własnego płatnego konta OpenRouter. Klucz wpisuje się tylko w .env.local i w Environment Variables na Vercel; nigdy do czatu, commita, promptu ani zrzutu. Przy wycieku: poprosić o unieważnienie i nowy klucz.
Konto Claude Code/Codex służy do pisania kodu; klucz OpenRouter służy budowanej aplikacji — to dwa różne dostępy.

Modele do ćwiczeń (identyfikatory do OPENROUTER_MODEL, sprawdzone 2.11.2026, cena USD za 1 mln tokenów wej./wyj.):
- openai/gpt-6-luna — najtańszy start (0,10 / 0,50)
- google/gemini-3.8-flash — alternatywa (0,75 / 3,75)
- openai/gpt-6.1-terra — trudniejsze zadania (1,00 / 5,00)
- anthropic/claude-sonnet-5.5 — porównanie jakości (2,00 / 10,00)
Na start używa się modelu wskazanego przez prowadzącego; jeśli wybór jest dowolny — Luna. W .env.local tylko jedna linia OPENROUTER_MODEL, pełny identyfikator z ukośnikiem.
