@echo off
cd /d "%~dp0frontend"
set "NPM_CMD=%ProgramFiles%\nodejs\npm.cmd"
if not exist "%NPM_CMD%" set "NPM_CMD=npm.cmd"
if not exist node_modules (
  call "%NPM_CMD%" install
  if errorlevel 1 (pause & exit /b 1)
)
call "%NPM_CMD%" run dev
pause
