@echo off
echo Starting Django and React servers with port checks...

:: === CHECK PORT 8000 (Django) ===
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000') do (
    echo Killing process on port 8000...
    taskkill /f /pid %%a >nul 2>&1
)

:: === START DJANGO SERVER ===
tasklist | findstr /i "python.exe" >nul && (
    echo Django server is already running. Skipping...
) || (
    echo Starting Django server...
    cd backend || (
        echo Error: 'backend' folder not found!
        exit /b 1
    )
    start "Django Server" cmd /k "call env\Scripts\activate && python manage.py runserver"
    cd ..
)

:: === CHECK PORT 5173 (React) ===
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do (
    echo Killing process on port 5173...
    taskkill /f /pid %%a >nul 2>&1
)

:: === START REACT SERVER ===
rem tasklist | findstr /i "node.exe" >nul && (
rem     echo React server is already running. Skipping...
rem ) || (
echo Starting React server...
cd frontend || (
    echo Error: 'frontend' folder not found!
    exit /b 1
)
start "React Server" cmd /k "npm run dev"
cd ..
rem )

:: === MINIMIZE WINDOWS ===
timeout /t 5 >nul
for /f "tokens=1,2 delims=," %%i in ('tasklist /v /fo csv ^| findstr /i "Django Server"') do (
    powershell -command "& {(Get-Process -Id %%j).MainWindowHandle | ForEach-Object {ShowWindowAsync $_ 2}}" >nul 2>&1
)
for /f "tokens=1,2 delims=," %%i in ('tasklist /v /fo csv ^| findstr /i "React Server"') do (
    powershell -command "& {(Get-Process -Id %%j).MainWindowHandle | ForEach-Object {ShowWindowAsync $_ 2}}" >nul 2>&1
)

:: === CONFIRMATION ===
echo Both servers are running in parallel and minimized. Access your site at:
echo - Django: http://127.0.0.1:8000
echo - React: http://localhost:5173
pause
