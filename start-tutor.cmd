@echo off
chcp 65001 >nul
title Tutor LABA
cd /d "%~dp0"

echo === Tutor LABA: przygotowanie ===
echo Folder: %cd%
echo.

where node >nul 2>nul
if errorlevel 1 goto nonode
node --version
call npm.cmd --version

if exist ".env.local" goto install
echo.
node scripts\env-init.mjs
echo.
echo Otwieram .env.local w Notatniku.
echo Wpisz po znaku = : klucz od LABA, model od prowadzacego i swoje haslo do czatu.
echo Zapisz plik (Ctrl+S), ZAMKNIJ Notatnik i wroc do tego okna.
start "" /wait notepad.exe ".env.local"

:install
echo.
echo === npm install (moze potrwac 1-2 minuty) ===
call npm.cmd install
if errorlevel 1 goto npmfail

echo.
echo === Uruchamiam serwer. Gdy zobaczysz "Ready", otworz http://localhost:3000 ===
echo Zatrzymanie: Ctrl+C. To okno zostaw otwarte, dopoki korzystasz z tutora.
echo.
call npm.cmd run dev
pause
goto :eof

:nonode
echo [BLAD] Brak Node.js. Zainstaluj node-v26.13.0-x64.msi z tego folderu.
pause
goto :eof

:npmfail
echo [BLAD] npm install sie nie udal. Przepisz komunikat powyzej do Claude (bez klucza i hasla).
pause
