@echo off
setlocal
cd /d "%~dp0"

echo ===================================================
echo Starting Hospitality Platform Backend (Neon PostgreSQL)...
echo ===================================================

REM Set Java environment
set "JAVA_HOME=C:\Program Files\Java\jdk-21.0.11"
set "PATH=%PATH%;%USERPROFILE%\maven\apache-maven-3.9.6\bin"

cd backend
echo [INFO] Launching Spring Boot with Neon Cloud PostgreSQL...
call .\mvnw.cmd spring-boot:run
