@echo off
title ElectraPredict AI Launcher
cd /d "%~dp0"

echo ===================================================
echo     Launching ElectraPredict AI Full-Stack App
echo ===================================================
echo.

:: 1. Check & start Backend (port 8000)
netstat -ano | findstr ":8000 " >nul
if %errorlevel% neq 0 (
    echo [1/2] Starting Python FastAPI Backend on port 8000...
    start "ElectraPredict Backend" /min cmd /c "cd /d "%~dp0backend" && python -m uvicorn app.main:app --port 8000"
    timeout /t 3 /nobreak >nul
) else (
    echo [1/2] Backend already running on port 8000.
)

:: 2. Check & start Frontend (port 5173)
netstat -ano | findstr ":5173 " >nul
if %errorlevel% neq 0 (
    echo [2/2] Starting React Vite Frontend on port 5173...
    start "ElectraPredict Frontend" /min cmd /c "cd /d "%~dp0frontend" && npm.cmd run dev"
    timeout /t 3 /nobreak >nul
) else (
    echo [2/2] Frontend already running on port 5173.
)

:: 3. Open browser
echo.
echo Opening ElectraPredict AI in your default web browser...
start http://localhost:5173

echo.
echo Application is running!
echo Frontend: http://localhost:5173
echo Backend:  http://127.0.0.1:8000/docs
echo.
timeout /t 5
