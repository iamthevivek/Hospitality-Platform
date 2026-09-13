@echo off
setlocal
cd /d "%~dp0"

echo ===================================================
echo Starting Hospitality Platform Backend (PostgreSQL)...
echo ===================================================

REM Check PostgreSQL port 5432
netstat -ano | findstr :5432 >nul
if %ERRORLEVEL% neq 0 (
    echo [WARNING] PostgreSQL service is not detected on port 5432.
    echo Starting PostgreSQL Windows Service...
    net start postgresql-x64-18 >nul 2>nul
)

REM Set Java environment
set "JAVA_HOME=C:\Program Files\Java\jdk-21.0.11"
set "PATH=%PATH%;%USERPROFILE%\maven\apache-maven-3.9.6\bin"

cd backend
echo [INFO] Launching Spring Boot with PostgreSQL...
call .\mvnw.cmd spring-boot:run
