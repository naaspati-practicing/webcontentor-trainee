@echo off
setlocal

set dir=%CD%

if [%1]==[] (
  echo no folder specified 
  goto :eof  
)

:start
cd %dir%\%1
echo %CD%
git add -A
git status

set MSG=
set /P MSG=git commit message: 
if "%MSG%"=="" (
  set MSG=modified
)
git commit -m "%MSG%"
git push origin master
echo.
echo ----------------------------------------------
echo.

shift
if [%1]==[] goto :eof
goto start
