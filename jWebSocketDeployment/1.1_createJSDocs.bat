@echo off
setlocal enableDelayedExpansion

echo -------------------------------------------------------------------------
echo jWebSocket JavaScript Docs Generator and Obfuscator
echo (C) Copyright 2013-2015 Innotrade GmbH
echo -------------------------------------------------------------------------

if "%JWEBSOCKET_HOME%"=="" goto error
if "%JWEBSOCKET_VER%"=="" goto error
goto continue
:error
echo Environment variable(s) JWEBSOCKET_HOME and/or JWEBSOCKET_VER not set!
if "%1"=="/y" goto exitNow
pause
:exitNow
exit

:continue
echo.
set jsCE=%JWEBSOCKET_HOME%..\..\branches\jWebSocket-%JWEBSOCKET_VER%\jWebSocketClient\web\res\js
set jsJQ=%JWEBSOCKET_HOME%..\..\branches\jWebSocket-%JWEBSOCKET_VER%\jWebSocketClient\web\lib\jQuery

pushd %jsCE%
set jsCE=%CD%\
popd

pushd %jsJQ%
set jsJQ=%CD%\
popd

echo jsCE=%jsCE%
echo jsJQ=%jsJQ%

echo.
if "%1"=="/y" goto dontAsk1
echo Auto Generation of jWebSocket v%JWEBSOCKET_VER% JavaScript Docs, are you sure?
pause
:dontAsk1


set LOG_FOLDER=%base%jWebSocketDeployment
IF NOT "%2"=="" (
	set LOG_FOLDER=%2
)

rem save current deployment folder
cd
pushd ..\jWebSocketClient\web\res\js

rem do *NOT* include the demo plug-in here! This will be loaded separately and is proprietary to the jWebSocket demos only!
echo Creating jWebSocket_Bundle.js Community Edition...
copy /b jWebSocket.js + jWebSocketComet.js + jwsCache.js + jwsWorker.js + jwsAPIPlugIn.js +  jwsCanvasPlugIn.js + jwsChannelPlugIn.js + jwsChatPlugIn.js + jwsClientGamingPlugIn.js + jwsEventsPlugIn.js + jwsLoadBalancerPlugIn.js + jwsExtProcessPlugIn.js + jwsFileSystemPlugIn.js + jwsIOC.js + jwsItemStoragePlugIn.js + jwsJDBCPlugIn.js + jwsJMSPlugIn.js + jwsLoggingPlugIn.js + jwsMailPlugIn.js + jwsQuotaPlugIn.js + jwsReportingPlugIn.js + jwsRPCPlugIn.js + jwsRTCPlugIn.js + jwsSamplesPlugIn.js + jwsScriptingPlugIn.js + jwsSharedObjectsPlugIn.js + jwsStreamingPlugIn.js + jwsTestPlugIn.js + jwsTwitterPlugIn.js + jwsXMPPPlugIn.js jWebSocket_Bundle.js
echo jWebSocket_Bundle.js Community Edition successfully created!

rem switch back to deployment folder
popd
set cd=%cd%

rem PROCEEDING TO PACKAGE THE COMMUNITY EDITION TESTS
cd
pushd ..\jWebSocketClient\web\test\js\tests

echo Creating jWebSocket_Test_Bundle.js...
copy /b jwsAutomatedAPITests.js + jwsBenchmarks.js + jwsChannelTests.js + jwsFilesystemTests.js + jwsIOC.js + jwsItemStorageTests.js + jwsJDBCTests.js + jwsJMSTests.js + jwsLoadBalancerTests.js + jwsLoadTests.js + jwsLoggingTests.js + jwsQuotaTests.js + jwsReportingTests.js + jwsREST.js + jwsRPCTests.js + jwsScriptingPlugInTest.js + jwsSharedTests.js + jwsStreamingTests.js + jwsSystemTests.js ..\jWebSocket_Test_Bundle.js
echo jWebSocket_Test_Bundle.js successfully created!

popd
set cd=%cd%

rem call obfuscator CE
start /wait "" "%JASOB_HOME%\jasob.exe" /src:"jWebSocket\jWebSocket.jsbp" /log:%LOG_FOLDER%\jasobCE.log

rem call obfuscator jWS 3rd party libs
start /wait "" "%JASOB_HOME%\jasob.exe" /src:"jWebSocket\jWebSocket3rdPartyLibs.jsbp" /log:%LOG_FOLDER%\jasob3rdP.log

echo finished! Please check if JavaScript Docs have been created.
if "%1"=="/y" goto dontAsk2
pause
:dontAsk2
