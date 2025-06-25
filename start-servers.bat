@echo off
echo Starting Travel Rogue MERN Stack...

echo.
echo Starting Backend Server...
cd /d "c:\Users\Ashu LOQ\Desktop\Projects\travel-Rogue-2\backend"
start "Backend Server" cmd /k "npm start"

echo.
echo Waiting 3 seconds before starting frontend...
timeout /t 3 /nobreak > nul

echo.
echo Starting Frontend Server...
cd /d "c:\Users\Ashu LOQ\Desktop\Projects\travel-Rogue-2\frontend"
start "Frontend Server" cmd /k "npm start"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5001
echo Frontend: http://localhost:3000
pause
