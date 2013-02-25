@echo off

if "%JWEBSOCKET_HOME%"=="" goto error
if "%JWEBSOCKET_VER%"=="" goto error
goto continue
:error
echo Environment variable(s) JWEBSOCKET_HOME and/or JWEBSOCKET_VER not set!
pause
exit
:continue

if "%1"=="/y" goto dontAsk1
echo Auto Generation of jWebSocket v%JWEBSOCKET_VER% JavaScript Docs, are you sure?
pause
:dontAsk1

rem set log=..\jWebSocketDeployment\createJSDocs.log
set log=con

rem save current deployment folder
cd
pushd ..\jWebSocketClient\web\res\js

rem do *NOT* include the demo plug-in here! This will be loaded separately and is proprietary to the jWebSocket demos only!
copy /b jWebSocket.js + jWebSocketComet.js + jwsCache.js + jwsAPIPlugIn.js + jwsCanvasPlugIn.js + jwsChannelPlugIn.js + jwsCanvasPlugIn.js + jwsChatPlugIn.js + jwsClientGamingPlugIn.js + jwsEventsPlugIn.js + jwsFileSystemPlugIn.js + jwsIOC.js + jwsItemStoragePlugIn.js + jwsJDBCPlugIn.js + jwsJMSPlugIn.js + jwsLoggingPlugIn.js + jwsMailPlugIn.js + jwsReportingPlugIn.js + jwsRPCPlugIn.js + jwsSamplesPlugIn.js + jwsSharedObjectsPlugIn.js + jwsStreamingPlugIn.js + jwsTestPlugIn.js + jwsTwitterPlugIn.js + jwsXMPPPlugIn.js + jwsWorker.js jWebSocket_Bundle.js

rem switch back to deployment folder
popd
set cd=%cd%

rem call obfuscator CE
start /wait "" "C:\Program Files (x86)\DAMIANI\Jasob 4.0\jasob.exe" /src:"jWebSocket\jWebSocket.jsbp" /log:%cd%\jasobCE.log

rem call obfuscator EE
start /wait "" "C:\Program Files (x86)\DAMIANI\Jasob 4.0\jasob.exe" /src:"%JWEBSOCKET_EE_HOME%..\..\branches\jWebSocket-%JWEBSOCKET_VER%-Enterprise\jWebSocketDeployment\jWebSocketEE.jsbp" /log:%cd%\jasobEE.log

rem copy minified/obfuscated EE editions into CE deployment
set jsCE=%JWEBSOCKET_HOME%..\..\branches\jWebSocket-%JWEBSOCKET_VER%\jWebSocketClient\web\res\js\
set jsEE=%JWEBSOCKET_EE_HOME%..\..\branches\jWebSocket-%JWEBSOCKET_VER%-Enterprise\jWebSocketClient\web\res\js\
echo jsCE=%jsCE%
echo jsEE=%jsEE%
copy %jsEE%jwsItemStoragePlugInEE_min.js %jsCE% /v
copy %jsEE%jwsFileSystemPlugInEE_min.js %jsCE% /v
copy %jsEE%jwsMailPlugInEE_min.js %jsCE% /v

echo finished! Please check if JavaScript Docs have been created.
if "%1"=="/y" goto dontAsk2
pause
:dontAsk2