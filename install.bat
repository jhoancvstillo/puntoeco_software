@echo off

echo Starting backend setup...

:: Navegar a la carpeta backend
cd backend || (
    echo Error: 'backend' folder not found!
    exit /b 1
)

:: Verificar si Python está instalado
where python >nul 2>nul || (
    echo Error: Python is not installed. Install Python and try again.
    exit /b 1
)

:: Crear entorno virtual
echo Creating virtual environment...
python -m venv env || (
    echo Error creating virtual environment.
    exit /b 1
)

:: Activar entorno virtual
echo Activating virtual environment...
call env\Scripts\activate || (
    echo Error activating virtual environment.
    exit /b 1
)

:: Instalar dependencias
if exist requirements.txt (
    echo Installing dependencies from requirements.txt...
    pip install --upgrade pip
    pip install -r requirements.txt
) else (
    echo No requirements.txt found. Installing Django as default...
    pip install --upgrade pip
    pip install django
    pip freeze > requirements.txt
)

:: Migrar la base de datos
echo Running database migrations...
python manage.py migrate || (
    echo Error running migrations.
    exit /b 1
)

:: Crear superusuario (opcional)
set /p create_superuser=Do you want to create a superuser? (yes/no): 
if /i "%create_superuser%"=="yes" (
    python manage.py createsuperuser || (
        echo Error creating superuser.
        exit /b 1
    )
)

:: Correr el servidor
echo Starting Django development server...
python manage.py runserver || (
    echo Error starting development server.
    exit /b 1
)

echo Backend setup complete. Access your site at http://127.0.0.1:8000
pause
