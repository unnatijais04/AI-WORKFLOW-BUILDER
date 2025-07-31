@echo off
echo Starting AI Workflow Builder...
echo.

echo Starting Backend Server...
cd server
start "Backend Server" cmd /k "venv\Scripts\activate && python main.py"

echo.
echo Starting Frontend...
cd ..\client
start "Frontend" cmd /k "npm start"

echo.
echo AI Workflow Builder is starting...
echo Backend will be available at: http://localhost:8000
echo Frontend will be available at: http://localhost:3000
echo.
echo Press any key to exit this launcher...
pause > nul 