@echo off
title French Master Academy - Static App
cd /d "%~dp0"

echo ================================================
echo   French Master Academy - akadamiyat itqan
echo ================================================
echo.

where node >nul 2>nul
if %errorlevel%==0 goto :run

echo [i] Node.js not found - opening index.html directly in your browser...
echo     (The app works fully this way! Node is only needed for the Wi-Fi/hotspot feature.)
start "" "%~dp0index.html"
exit /b

:run
echo Starting local server... your browser will open automatically.
echo To share with phones on the same Wi-Fi, use the hotspot URL shown in the window.
node server.js
pause
