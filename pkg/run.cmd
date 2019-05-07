@echo off
setlocal

if [%1]==[open] (
  explorer %~dp0
  goto:eof
)

if [%1]==[copy] (
  rmdir /s /q %~dp0bin
  mkdir %~dp0bin
  copy /Y "%eclipse_workplace%\Singles\Singles\bin\PkgExplorer*.class" %~dp0bin
  goto:eof
)

if [%1]==[pack] (
  cd /d %~dp0
  sam pack -src "D:\importents_are_here\eclipse_workplace\Singles\Singles\src\PkgExplorer.java"
  goto:eof
)

set SELF_DIR=%~dp0

set NPP_EXE=C:\Program Files (x86)\Notepad++\notepad++.exe
if [%CMD%]==[true] SET JAVA_EXE=java
if [%JAVA_EXE%]==[] SET JAVA_EXE=start "pkg" javaw

%JAVA_EXE% -cp "%~dp0bin;%~dp0myutils.jar" PkgExplorer %*
