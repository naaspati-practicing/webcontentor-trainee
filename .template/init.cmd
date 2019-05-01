@echo off
setlocal

set return_to=%~dp0


if [%1]==[offline] (
  set OFFLINE=--offline
)

set /p project_name=project name: 
if x%project_name%==x (
  echo no project name specified
  goto:eof
)

if exist %project_name% (
  echo project already exists
  goto:eof
)

rem ng exiting the program/unable to proceed further, if this cmd context is used
rem thus using call
call ng new -g --skip-install %project_name%

if not exist %project_name%/package.json  (
  echo project creation failed
  goto:eof
)

cd %project_name%

set troot=%~dp0
set tadd=%~dp0\add\
echo copying my_dev, .vscode
xcopy /q /s /e /y /i "%tadd%my_dev" my_dev
xcopy /q /s /e /y /i "%tadd%.vscode" .vscode 

echo copying gulpfile.js, .eslintrc.js, .jsbeautifyrc
copy /y "%tadd%gulpfile.js"  gulpfile.js
copy /y "%tadd%.jsbeautifyrc"  .jsbeautifyrc
copy /y "%tadd%.eslintrc.js"  .eslintrc.js
copy /y "%tadd%pugi.js"  pugi.js

ren package.json temp-package.json
copy /y "%troot%temp-package.json"  package.json
copy /y "%troot%modify-angularjs-file.js"  modify-angularjs-file.js

call yarn add update-json-file %OFFLINE% 
call node modify-angularjs-file.js

del /Q package.json
del /Q modify-angularjs-file.js

ren temp-package.json package.json

call yarn install  %OFFLINE%
rem to avoid install error gulp-sass install error
call yarn config set child-concurrency 1 
call yarn add -D gulp-sass
call yarn config delete child-concurrency