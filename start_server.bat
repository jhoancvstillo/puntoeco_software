@echo off
echo Starting Django and React servers...

:: Navegar a la carpeta del backend y ejecutar el servidor de Django
cd backend || (
    echo Error: 'backend' folder not found!
    exit /b 1
)
call env\Scripts\activate
start cmd /k "python manage.py runserver"

:: Navegar a la carpeta del frontend y ejecutar el servidor de React
cd ../frontend || (
    echo Error: 'frontend' folder not found!
    exit /b 1
)
start cmd /k "npm run dev"

echo Both servers are running. Access your site at http://127.0.0.1:8000 (Django) and http://localhost:5173 (React).
pause
