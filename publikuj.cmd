@echo off
chcp 65001 >nul
title Publikacja na GitHub
cd /d "%~dp0"
set REPO=https://github.com/m85lukas-ai/moj-chatbot-laba.git

echo === Publikacja Tutora LABA na GitHub ===
echo Repo: %REPO%
echo.

where git >nul 2>nul
if errorlevel 1 goto nogit
git --version

if exist ".git" goto hasgit
git init -b main
:hasgit

rem Autor commitow tylko w tym repo (adres noreply GitHuba, bez prywatnego e-maila)
git config user.name "m85lukas-ai"
git config user.email "m85lukas-ai@users.noreply.github.com"

git add -A

echo.
echo === Kontrola bezpieczenstwa ===
git ls-files --cached | findstr /I /R "\.env$ \.env\.local" >nul
if not errorlevel 1 goto secretfile
git grep --cached -n -I -E "sk-or-v1-[A-Za-z0-9]{20,}" >nul 2>nul
if not errorlevel 1 goto secretkey
echo OK: .env.local i klucze NIE trafia do repozytorium.
echo.
echo Pliki do wyslania:
git ls-files --cached
echo.

git diff --cached --quiet
if not errorlevel 1 goto nochanges
git commit -q -m "Tutor LABA: chatbot Next.js + AI SDK + OpenRouter ze streamingiem i haslem" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
:nochanges

git remote get-url origin >nul 2>nul
if errorlevel 1 git remote add origin %REPO%
git remote set-url origin %REPO%

echo.
echo === Wysylam na GitHub (moze pojawic sie okno logowania GitHub - zaloguj sie w przegladarce) ===
git push -u origin main
if errorlevel 1 goto pushfail

echo.
echo GOTOWE. Kod jest na: https://github.com/m85lukas-ai/moj-chatbot-laba
for /f %%h in ('git rev-parse --short HEAD') do echo Commit: %%h
pause
goto :eof

:nogit
echo [BLAD] Brak Git. Zainstaluj Git-2.56.0.4-64-bit.exe z tego folderu i uruchom ponownie.
pause
goto :eof

:secretfile
echo [STOP] Plik .env lub .env.local trafilby do repozytorium. Nic nie zostalo wyslane. Napisz do Claude.
git reset -q
pause
goto :eof

:secretkey
echo [STOP] W kodzie wykryto cos, co wyglada na klucz OpenRouter. Nic nie zostalo wyslane. Napisz do Claude.
git reset -q
pause
goto :eof

:pushfail
echo [BLAD] Wysylanie sie nie udalo. Przepisz komunikat powyzej do Claude (bez hasel i tokenow).
pause
