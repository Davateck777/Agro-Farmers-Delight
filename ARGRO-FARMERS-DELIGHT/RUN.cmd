@echo off
REM Serves the static site from THIS folder so fetch(data/products.json) works.
REM Double-click or run from cmd. Stop with Ctrl+C in the window.
set "HERE=%~dp0"
cd /d "%HERE%"

where py >nul 2>&1
if %ERRORLEVEL%==0 (
  echo Starting Python server at http://localhost:8080
  py -m http.server 8080
  goto :eof
)

where python >nul 2>&1
if %ERRORLEVEL%==0 (
  echo Starting Python server at http://localhost:8080
  python -m http.server 8080
  goto :eof
)

where npx >nul 2>&1
if %ERRORLEVEL%==0 (
  echo Starting npx serve at http://localhost:8080
  npx --yes serve -l 8080 .
  goto :eof
)

echo No py, python, or npx found. Install Python or Node.js, or open index.html via a local static server.
pause
