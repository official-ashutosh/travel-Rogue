@echo off
echo Starting Travel Rogue Application...
echo.

echo [1/3] Starting Backend Server...
cd /d "c:\Users\Ashu LOQ\Desktop\Projects\travel-Rogue\backend"
start "Backend Server" cmd /k "npm start"

echo [2/3] Waiting for backend server to start...
timeout /t 5 /nobreak > nul

echo [3/3] Starting Frontend Development Server...
cd /d "c:\Users\Ashu LOQ\Desktop\Projects\travel-Rogue\frontend"
start "Frontend Server" cmd /k "npm start"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to close this window...
pause > nul
