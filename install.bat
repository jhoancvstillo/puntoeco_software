@echo off

echo Starting backend and frontend setup...

:: === BACKEND SETUP ===
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
if not exist env (
    echo Creating virtual environment...
    python -m venv env || (
        echo Error creating virtual environment.
        exit /b 1
    )
) else (
    echo Virtual environment already exists. Skipping creation.
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
    pip install -r requirements.txt || (
        echo Error installing dependencies.
        exit /b 1
    )
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
:ask_superuser
set /p create_superuser=Do you want to create a superuser? (yes/no): 

if /i "%create_superuser%"=="yes" (
    python manage.py createsuperuser || (
        echo Error creating superuser.
        exit /b 1
    )
) else if /i "%create_superuser%"=="no" (
    echo Skipping superuser creation.
) else (
    echo Invalid option. Please type "yes" or "no".
    goto ask_superuser
)

:: Correr el servidor Django
echo Starting Django development server...
start cmd /k "call env\Scripts\activate && python manage.py runserver"

cd ..

:: === FRONTEND SETUP ===
:: Navegar a la carpeta frontend
cd frontend || (
    echo Error: 'frontend' folder not found!
    exit /b 1
)

:: Verificar si Node.js está instalado
where node >nul 2>nul || (
    echo Error: Node.js is not installed. Install Node.js and try again.
    exit /b 1
)

:: Instalar dependencias de React
if not exist node_modules (
    echo Installing frontend dependencies...
    npm install || (
        echo Error installing frontend dependencies.
        exit /b 1
    )
) else (
    echo Frontend dependencies already installed. Skipping installation.
)

:: Correr el servidor de desarrollo de React
echo Starting React development server...
start cmd /k "npm run dev"

echo Both backend and frontend servers are running.
pause

