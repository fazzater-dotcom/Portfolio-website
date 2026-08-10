@echo off
REM ============================================================
REM  Mehdi Fazzat - Motion Designer : one-click launcher
REM  Double-click this file to start the site and open it in
REM  your browser. Requires Node.js (https://nodejs.org).
REM ============================================================
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo   Node.js is not installed.
  echo   Install it from https://nodejs.org  then double-click this file again.
  echo.
  pause
  exit /b
)

if not exist node_modules (
  echo Installing dependencies, this runs only once...
  call npm install
)

echo.
echo   Starting the site. Your browser will open at http://localhost:5173
echo   Keep this window open while you view the site. Close it to stop.
echo.

start "" http://localhost:5173
call npm run dev
