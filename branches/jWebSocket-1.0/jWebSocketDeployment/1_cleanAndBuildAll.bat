@echo off
echo -------------------------------------------------------------------------
echo jWebSocket Clean and Build Automation
echo (C) Copyright 2013-2014 Innotrade GmbH
echo -------------------------------------------------------------------------

if "%JWEBSOCKET_HOME%"=="" goto error
if "%CATALINA_HOME%"=="" goto error
if "%JWEBSOCKET_VER%"=="" goto error
if "%ANT_HOME%"=="" goto error

goto continue

:error
echo Environment variable(s) JWEBSOCKET_HOME, ANT_HOME, CATALINA_HOME and/or JWEBSOCKET_VER not set!
if "%1"=="/y" goto exitNow
pause
:exitNow
exit

:continue

if "%1"=="/y" goto dontAsk1
echo This will clean and build jWebSocket v%JWEBSOCKET_VER%. Are you sure?
pause

:dontAsk1
set CD_SAVE=%CD%
echo.
echo -----------------------------------------------------------------------
echo .       Step 1: Getting latest changes from jWebSocket SVN server     .
echo -----------------------------------------------------------------------
echo.
echo Updating parent jWebSocket directory: %JWEBSOCKET_HOME%..\..\
echo.

svn update %JWEBSOCKET_HOME%../../

echo.
echo -----------------------------------------------------------------------
echo .       Step 2: Building jWebSocket Community Edition (CE)            .
echo -----------------------------------------------------------------------
echo.

cd %JWEBSOCKET_HOME%..\..\branches\jWebSocket-%JWEBSOCKET_VER%
echo Cleaning up temporary work files...
del /p /s *.?.nblh~

echo This will clean and build jWebSocket v%JWEBSOCKET_VER%
call mvn clean install

echo.
echo -----------------------------------------------------------------------
echo .       Step 3: Building jWebSocketActiveMQStockTicker                .
echo -----------------------------------------------------------------------
echo.
cd %JWEBSOCKET_HOME%..\..\branches\jWebSocket-%JWEBSOCKET_VER%\jWebSocketActiveMQStockTicker
call mvn clean install

if not exist "%CATALINA_HOME%\lib\jWebSocketServer-Bundle-%JWEBSOCKET_VER%.jar" (
	copy "%JWEBSOCKET_HOME%\libs\jWebSocketServer-Bundle-%JWEBSOCKET_VER%.jar" "%CATALINA_HOME%\lib"
)

if not exist "%CATALINA_HOME%\lib\jWebSocketServer-Bundle-%JWEBSOCKET_VER%.jar" (
	echo ERROR: jWebSocketServer-Bundle-%JWEBSOCKET_VER%.jar is missing from your CATALINA_HOME\lib folder. This may cause compilation errors because of missing dependencies for jWebSocketWebAppDemo.
    echo You can either run the script 1_cleanAndBuildAll.bat once again as administrator, or just copy the required file jWebSocketServer-Bundle-%JWEBSOCKET_VER%.jar to CATALINA_HOME\lib by yourself.
)

echo.
echo -----------------------------------------------------------------------
echo .       Step 4: Building jWebSocketWebAppDemo                          .
echo -----------------------------------------------------------------------
echo.
pushd %JWEBSOCKET_HOME%..\..\branches\jWebSocket-%JWEBSOCKET_VER%\jWebSocketWebAppDemo
call ant -Dj2ee.server.home="%CATALINA_HOME%" -Dlibs.CopyLibs.classpath=%ANT_HOME%/lib/org-netbeans-modules-java-j2seproject-copylibstask.jar
popd

cd %CD_SAVE%
rem copy newly created libs to Tomcat's lib folder
call libs2tomcat.bat %1

if "%1"=="/y" goto dontAsk2
pause
:dontAsk2