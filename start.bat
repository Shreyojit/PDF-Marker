@echo off
echo Starting PDF Marker App...

start "Backend" cmd /k "cd /d %~dp0backend && npm run dev"
timeout /t 3 /nobreak >nul
start "Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo Both servers are starting.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Close the two terminal windows to stop the servers.
