@echo off
echo -------------------------------------------------------------------------
echo jWebSocket Nightly Build Generator
echo (C) Copyright 2013-2015 Innotrade GmbH
echo -------------------------------------------------------------------------
rem PARAMETERS DESCRIPTION:
rem %1 (/y or /n): no pause and prompts
rem %2 (/y or /n): no javadocs
rem %3 (/y or /n): no FTP deployment
rem %4 (/y or /n): no Maven deployment
rem %5 (/y or /n): no upload nightly build number change to jWebSocket Subversion repository

IF NOT EXIST %JAVA_HOME% GOTO NO_JAVA_HOME
GOTO PRINT_JAVA_VERSION

:NO_JAVA_HOME
	set JAVA_HOME=C:\Program Files\Java\jdk1.7.0_51
	set path=%JAVA_HOME%\bin;%PATH%

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
if "%1"=="/y" goto no_pause_1
pause
:no_pause_1
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
echo - that you have your ftp username and password properly configured in the file 5_uploadNightlyBuildToFTP.bat
echo.
echo Are you sure?

if "%1"=="/y" goto auto_declare_variables
pause
rem start prompting the user for required data
if "%1"=="" goto prompt_variables
goto auto_declare_variables

:prompt_variables
	rem %1 (/y or /n): no pause and prompts
	set /p option=Do you want to have prompts or pause during the deployment(y/n)?
	if "%option%"=="y" goto set_pause_and_prompts
	set param_no_pause_and_prompts=/y
	goto no_javadocs
	:set_pause_and_prompts
	set param_no_pause_and_prompts=/n
	
	rem %2 (/y or /n): no javadocs
	:no_javadocs
	set /p option=Do you want to generate JavaDocs(y/n)?
	if "%option%"=="y" goto set_java_docs
	set param_no_java_docs=/y
	goto no_ftp_deployment
	:set_java_docs
	set param_no_java_docs=/n
	
	rem %3 (/y or /n): no FTP deployment
	:no_ftp_deployment
	set /p option=Do you want to deploy automatically via FTP(y/n)?
	if "%option%"=="y" goto set_ftp_deployment
	set param_no_ftp_deploy=/y
	goto no_nightly_upload
	:set_ftp_deployment
	set param_no_ftp_deploy=/n
	
	rem %4 (/y or /n): no Maven deployment
	:no_nightly_upload
	set /p option=Do you want to upload generated artifacts to Maven repository(y/n)?
	if "%option%"=="y" goto set_maven_deployment
	set param_no_maven_deploy=/y
	goto no_subversion_upload
	:set_maven_deployment
	set param_no_maven_deploy=/n
	
	rem %5 (/y or /n): no upload nightly build number change to jWebSocket Subversion repository
	:no_subversion_upload
	set /p option=Do you want to upload local changes to jWebSocket Subversion(y/n)?
	if "%option%"=="y" goto set_upload_to_subversion
	set param_no_subversion_upload=/y
	goto no_pause_2
	:set_upload_to_subversion
	set param_no_subversion_upload=/n
	goto show_variables

:auto_declare_variables
	set param_no_pause_and_prompts=%1
	set param_no_java_docs=%2
	set param_no_ftp_deploy=%3
	set param_no_maven_deploy=%4
	set param_no_subversion_upload=%5

:no_pause_2
:show_variables
echo no pause and prompts %param_no_pause_and_prompts%
echo no javadocs %param_no_java_docs%
echo no ftp %param_no_ftp_deploy%
echo no maven %param_no_maven_deploy%
echo no subversion %param_no_subversion_upload%

set LOGS_FOLDER=NIGHTLY_BUILD_LOGS
if not exist "%LOGS_FOLDER%" (
	mkdir "%LOGS_FOLDER%"
)
set logfile_java_docs=%CD%/%LOGS_FOLDER%/createJavaDocs.log
set logfile_0=%LOGS_FOLDER%/0_createJSDocs.log
set logfile_1=%LOGS_FOLDER%/1_cleanAndBuildAll.log
set logfile_2=%LOGS_FOLDER%/2_createRunTimeFiles.log
set logfile_3=%LOGS_FOLDER%/3_createDownloadFiles.log
set logfolder_deployment=%CD%/%LOGS_FOLDER%/DEPLOYMENT_LOGS
set logfolder_jasob=%CD%/%LOGS_FOLDER%/
set logfolder_update_build_number=%CD%/%LOGS_FOLDER%/updateBuildNumbers.log

rem by default do not commit to subversion
if "%param_no_subversion_upload%"=="" (
	set param_no_subversion_upload=/y
)

echo Starting Nightly Build into %logfile_0%, %logfile_1%, %logfile_2%, %logfile_3%...

echo.
echo -----------------------------------------------------
echo Running 1.1_createJSDocs.bat...
echo -----------------------------------------------------
rem the following script receives two parameters:
rem %1: do not show pause or prompts
rem %2: do not upload changes to subversion repository
call 0_updateSVNReplaceBuildNumbers.bat /y %param_no_subversion_upload% > %logfolder_update_build_number%


if "%param_no_java_docs%"=="/y" goto no_javadocs
echo.
echo -----------------------------------------------------
echo Running 1.0_createJavaDocs.bat...
echo -----------------------------------------------------
if "%param_no_pause_and_prompts%"=="/y" goto createJavaDocs
set /p option=Do you want to create jWebSocket Java Docs now (y/n)?
if "%option%"=="y" goto createJavaDocs
goto minifyJS

:createJavaDocs
rem generate the java docs (saved to client web) Passing as parameter the log file location
call 1.0_createJavaDocs.bat /y %logfile_java_docs%
:no_javadocs

:minifyJS
rem create client side bundles and minified versions
echo.
echo -----------------------------------------------------
echo Running 1.1_createJSDocs.bat...
echo -----------------------------------------------------
rem First parameter skips prompts, second is the logs folder for jasob output
call 1.1_createJSDocs.bat /y %logfolder_jasob% > %logfile_0%

echo.
echo -----------------------------------------------------
echo Running 2_cleanAndBuildAll.bat...
echo -----------------------------------------------------
echo Cleaning and building the project MAY TAKE SEVERAL MINUTES.
echo Please check the compilation logs here: %logfile_1%
call 2_cleanAndBuildAll.bat /y > %logfile_1%

echo.
echo -----------------------------------------------------
echo Running 2_createRunTimeFiles...
echo -----------------------------------------------------
call 3_createRunTimeFiles.bat /y > %logfile_2%

echo.
echo -----------------------------------------------------
echo Running 3_createDownloadFiles...
echo -----------------------------------------------------
call 4_createDownloadFiles.bat /y > %logfile_3%

echo.
echo -----------------------------------------------------
echo         NIGHTLY BUILD SUCCESSFULLY CREATED!
echo -----------------------------------------------------

if "%param_no_ftp_deploy%"=="/y" goto no_ftp_deployment
:proceed_to_ftp_deployment
echo.
echo -----------------------------------------------------
echo Running 5_uploadNightlyBuildToFTP.bat to upload all the generated nightly build packages to our FTP Repository
echo -----------------------------------------------------
rem Upload nightly build to the repository, parameters %1: "skip prompts", %2: "skip compilation", %3: "log output folder"
call 5_uploadNightlyBuildToFTP.bat /y %logfolder_deployment%\ > %logfolder_deployment%\5_uploadNightlyBuildToFTP.log
:no_ftp_deployment

if "%param_no_pause_and_prompts%"=="/y" goto proceed_to_maven_deployment
set /p option=Do you want to deploy the created Nightly Build to our Maven Repository now (y/n)?
if "%option%"=="y" goto proceed_to_maven_deployment
goto scan

:proceed_to_maven_deployment
if "%param_no_maven_deploy%"=="/y" goto no_maven_deployment
echo.
echo -----------------------------------------------------
echo Running 6_uploadNightlyBuildToMaven.bat to upload all the 
echo generated nightly build packages to our Maven Repository
echo -----------------------------------------------------
rem Upload nightly build to the repository, parameters %1: "skip prompts", %2: "skip compilation", %3: "log output folder"
call 6_uploadNightlyBuildToMaven.bat /y /y %logfolder_deployment%

:no_maven_deployment
:scan

echo.
echo -----------------------------------------------------
echo Scanning log files for certain error tags...
echo -----------------------------------------------------
%FART_EXE% -i %logfile_java_docs% error
%FART_EXE% -i %logfile_0% error
%FART_EXE% -i %logfile_1% error
%FART_EXE% -i %logfile_2% error
%FART_EXE% -i %logfile_3% error
%FART_EXE% -i -r %logfolder_deployment%\*.log error
echo ----------------------------------------------------
echo Please check above section for error messages.
:end
if "%param_no_pause_and_prompts%"=="/y" goto exit_now
pause
:exit_now
