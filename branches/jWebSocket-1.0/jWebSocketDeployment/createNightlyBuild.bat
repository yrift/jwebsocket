@echo off
echo -------------------------------------------------------------------------
echo jWebSocket Nightly Build Generator
echo (C) Copyright 2013-2015 Innotrade GmbH
echo -------------------------------------------------------------------------

IF NOT EXIST %JAVA_HOME% GOTO NO_JAVA_HOME
GOTO PRINT_JAVA_VERSION

:NO_JAVA_HOME
	set JAVA_HOME=C:\Program Files\Java\jdk1.7.0_51
	rem set JAVA_HOME=C:\Program Files\Java\jdk1.8.0_20

	set path=%JAVA_HOME%\bin;%PATH%
	rem set path=C:\Program Files\Java\jdk1.8.0_20\bin;%PATH%

:PRINT_JAVA_VERSION
echo Java Version:
java -version
echo -------------------------------------------------------------------------

set FART_EXE=%CD%/tools/fart.exe

if "%JWEBSOCKET_HOME%"=="" goto error
if "%JWEBSOCKET_VER%"=="" goto error
goto continue
:error
echo Environment variable(s) JWEBSOCKET_HOME and/or JWEBSOCKET_VER not set!
pause
exit
:continue

echo This will create the entire jWebSocket v%JWEBSOCKET_VER% Nightly Build. 
echo.
echo PLEASE ENSURE....
echo - that all build numbers are properly set (server, js client, java client)
echo - custom specific settings reset in server options?
echo - that the jWebSocket server does NOT run
echo - that NetBeans is NOT running
echo - that no folder of jWebSocket is currently in use (e.g. by Windows Explorer)
echo - that all browsers which might have jWebSocket clients running are closed
echo - that the Apache Web Server is stopped to not lock anything
echo.
echo Are you sure?
pause

set LOGS_FOLDER=NIGHTLY_BUILD_LOGS
if not exist "%LOGS_FOLDER%" (
	mkdir "%LOGS_FOLDER%"
)
set logfile_java_docs=%LOGS_FOLDER%/createJavaDocs.log
set logfile_0=%LOGS_FOLDER%/0_createJSDocs.log
set logfile_1=%LOGS_FOLDER%/1_cleanAndBuildAll.log
set logfile_2=%LOGS_FOLDER%/2_createRunTimeFiles.log
set logfile_3=%LOGS_FOLDER%/3_createDownloadFiles.log
set logfile_deployment=DEPLOYMENT_LOGS

echo Starting Nightly Build into %logfile_0%, %logfile_1%, %logfile_2%, %logfile_3%...

rem generate the java docs (saved to client web)
rem call createJavaDocs.bat > %logfile_java_docs%

rem create client side bundles and minified versions
echo.
echo -----------------------------------------------------
echo Running 0_createJSDocs.bat...
echo -----------------------------------------------------
rem call 0_createJSDocs.bat /y > %logfile_0%

echo.
echo -----------------------------------------------------
echo Running 1_cleanAndBuildAll.bat...
echo -----------------------------------------------------
echo Cleaning and building the project MAY TAKE SEVERAL MINUTES.
echo Please check the compilation logs here: %logfile_1%
rem call 1_cleanAndBuildAll.bat /y > %logfile_1%

echo.
echo -----------------------------------------------------
echo Running 2_createRunTimeFiles...
echo -----------------------------------------------------
rem call 2_createRunTimeFiles.bat /y > %logfile_2%

echo.
echo -----------------------------------------------------
echo Running 3_createDownloadFiles...
echo -----------------------------------------------------
rem call 3_createDownloadFiles.bat /y > %logfile_3%

echo.
echo -----------------------------------------------------
echo         NIGHTLY BUILD SUCCESSFULLY CREATED!
echo -----------------------------------------------------

set /p option=Do you want to deploy the created Nightly Build to our Maven Repository now (y/n)?
if "%option%"=="y" goto proceedDeployment
goto scan

:proceedDeployment
echo.
echo -----------------------------------------------------
echo Running 4_uploadNightlyBuildToMaven.bat to upload all the 
echo generated nightly build packages to our Maven Repository
echo -----------------------------------------------------
rem Upload nightly build to the repository, parameters %1: "skip prompts", %2: "skip compilation"
call 4_uploadNightlyBuildToMaven.bat /y /y

:scan

echo.
echo -----------------------------------------------------
echo Scanning log files for certain error tags...
echo -----------------------------------------------------
rem %FART_EXE% -i %logfile_java_docs% error
%FART_EXE% -i %logfile_0% error
%FART_EXE% -i %logfile_1% error
%FART_EXE% -i %logfile_2% error
%FART_EXE% -i %logfile_3% error
%FART_EXE% -i -r %logfile_deployment%\*.log error
echo ----------------------------------------------------
echo Please check above section for error messages.
:end
pause
