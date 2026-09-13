@echo off
setlocal

REM Check if maven is in user profile maven folder
if exist "%USERPROFILE%\maven\apache-maven-3.9.6\bin\mvn.cmd" (
    "%USERPROFILE%\maven\apache-maven-3.9.6\bin\mvn.cmd" %*
    exit /b %ERRORLEVEL%
)

REM Check if mvn is available in PATH
where mvn >nul 2>nul
if %ERRORLEVEL% equ 0 (
    mvn %*
    exit /b %ERRORLEVEL%
)

echo Maven could not be found automatically.
echo Please run: %USERPROFILE%\maven\apache-maven-3.9.6\bin\mvn.cmd
exit /b 1
