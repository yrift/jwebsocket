@echo off
echo -------------------------------------------------------------------------
echo jWebSocket Packager 
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
if "%1"=="/y" goto dontAsk1
echo This will create the download files for jWebSocket v%JWEBSOCKET_VER%. Are you sure?
pause

:dontAsk1
set ver=%JWEBSOCKET_VER%
set src=..\

set rte=..\..\..\rte\jWebSocket-%ver%\
set bin=%rte%bin\
set conf=%rte%conf\
set apps=%rte%apps\
set database=%rte%database\
set libs=%rte%libs\
set logs=%rte%logs\
set cache=%rte%cache\
set web=%rte%web\
set filesystem=%rte%filesystem\

set depl=..\jWebSocketDeployment\jWebSocket\
set down=..\..\..\downloads\jWebSocket-%ver%\

rem goto client

:cleanup
echo -------------------------------------------------------------------------
echo Removing obsolete development logfile from packages...
echo -------------------------------------------------------------------------
del %logs%*.log
echo cleaning up temporary work files...
del /p /s %src%*.?.nblh~


:clone
echo cloning jWebSocket.ks KeyStore to Jetty Project /conf folder
copy "%conf%/jWebSocket.ks" "%src%jWebSocketJetty/conf"


echo -------------------------------------------------------------------------
echo Packaging full sources...
echo -------------------------------------------------------------------------
set base=..\..\..\..\
set sc=jWebSocketDev\branches\jWebSocket-%ver%\
set rt=jWebSocketDev\rte\jWebSocket-%ver%\
pushd %base%

set dest=jWebSocketDev\downloads\jWebSocket-%ver%\jWebSocketFullSources-%ver%.zip
if exist %dest% del %dest%

rem Source Code Modules
7z u -mx9 -tzip "%dest%" "%sc%jWebSocketActiveMQStockTicker" -xr!target -xr!.svn -xr!dist -xr!build -xr!.DS_Store
7z u -mx9 -tzip "%dest%" "%sc%jWebSocketAndroid" -xr!target -xr!.svn -xr!build -xr!bin -xr!.DS_Store
7z u -mx9 -tzip "%dest%" "%sc%jWebSocketAppSrvDemo" -xr!target -xr!.svn -xr!dist -xr!build -xr!.DS_Store
7z u -mx9 -tzip "%dest%" "%sc%jWebSocketBlackBerry" -xr!target -xr!.svn -xr!dist -xr!build -xr!.DS_Store
7z u -mx9 -tzip "%dest%" "%sc%jWebSocketClient" -xr!target -xr!devguide -xr!quickguide -xr!javadocs -xr!.svn -xr!dist -xr!build -xr!.DS_Store -xr!.settings -xr!nbproject
7z u -mx9 -tzip "%dest%" "%sc%jWebSocketClientAPI" -xr!target -xr!.svn -xr!dist -xr!build -xr!.DS_Store
7z u -mx9 -tzip "%dest%" "%sc%jWebSocketCommon" -xr!target -xr!.svn -xr!dist -xr!build -xr!.DS_Store
7z u -mx9 -tzip "%dest%" "%sc%jWebSocketCSClient" -xr!.svn -xr!Client.exe -xr!ClientLibrary.dll -xr!.DS_Store
7z u -mx9 -tzip "%dest%" "%sc%jWebSocketDevTemplate" -xr!.svn -xr!*.tmp* -xr!.DS_Store
7z u -mx9 -tzip "%dest%" "%sc%jWebSocketEngines" -xr!target -xr!.svn -xr!dist -xr!build -xr!.DS_Store
7z u -mx9 -tzip "%dest%" "%sc%jWebSocketJavaME" -xr!target -xr!.svn -xr!dist -xr!build -xr!.DS_Store
7z u -mx9 -tzip "%dest%" "%sc%jWebSocketJavaMEClient" -xr!target -xr!.svn -xr!dist -xr!build -xr!.DS_Store
7z u -mx9 -tzip "%dest%" "%sc%jWebSocketJavaSEClient" -xr!target -xr!.svn -xr!dist -xr!build -xr!.DS_Store
7z u -mx9 -tzip "%dest%" "%sc%jWebSocketJetty" -xr!target -xr!.svn -xr!dist -xr!build -xr!.DS_Store
7z u -mx9 -tzip "%dest%" "%sc%jWebSocketJMSGateway" -xr!target -xr!.svn -xr!dist -xr!build -xr!.DS_Store
7z u -mx9 -tzip "%dest%" "%sc%jWebSocketLibs" -xr!target -xr!.svn -xr!dist -xr!build -xr!.DS_Store
7z u -mx9 -tzip "%dest%" "%sc%jWebSocketPlugIns" -xr!target -xr!.svn -xr!dist -xr!build -xr!.DS_Store
7z u -mx9 -tzip "%dest%" "%sc%jWebSocketProxy" -xr!target -xr!.svn -xr!dist -xr!build -xr!.DS_Store
7z u -mx9 -tzip "%dest%" "%sc%jWebSocketSamples" -xr!target -xr!.svn -xr!dist -xr!build -xr!.DS_Store
7z u -mx9 -tzip "%dest%" "%sc%jWebSocketServer" -xr!target -xr!.svn -xr!dist -xr!build -xr!.DS_Store
7z u -mx9 -tzip "%dest%" "%sc%jWebSocketServerAPI" -xr!target -xr!.svn -xr!dist -xr!build -xr!.DS_Store
7z u -mx9 -tzip "%dest%" "%sc%jWebSocketSwingGUI" -xr!target -xr!.svn -xr!dist -xr!build -xr!.DS_Store
7z u -mx9 -tzip "%dest%" "%sc%jWebSocketWatchDogClient" -xr!target -xr!.svn -xr!dist -xr!build -xr!.DS_Store
7z u -mx9 -tzip "%dest%" "%sc%jWebSocketWebAppDemo" -xr!target -xr!.svn -xr!dist -xr!build -xr!.DS_Store
7z u -mx9 -tzip "%dest%" "%sc%jWebSocketWindowsPhone" -xr!target -xr!.svn -xr!dist -xr!build -xr!.DS_Store

rem Shared, Demo, Data and Vendor Modules
7z u -mx9 -tzip "%dest%" "%sc%arduino" -xr!.svn -xr!.DS_Store
7z u -mx9 -tzip "%dest%" "%sc%databases" -xr!.svn -xr!.DS_Store
7z u -mx9 -tzip "%dest%" "%sc%libs" -xr!target -xr!.svn -xr!dist -xr!build -xr!.DS_Store
7z u -mx9 -tzip "%dest%" "%sc%shared" -xr!target -xr!.svn -xr!dist -xr!build -xr!.DS_Store
7z u -mx9 -tzip "%dest%" "%sc%SmartCard-client-library" -xr!target -xr!.svn -xr!dist -xr!build -xr!.DS_Store
7z u -mx9 -tzip "%dest%" "%sc%Windows Phone API" -xr!target -xr!.svn -xr!dist -xr!build -xr!.DS_Store

rem Maven Control files
7z u -mx9 -tzip "%dest%" "%sc%pom.xml"

rem Run Time Modules
7z u -mx9 -tzip "%dest%" "%rt%" -xr!.svn -xr!*.tmp* -xr!*.jasper* -xr!*.war -xr!cache -xr!logs -xr!mails -xr!temp -xr!database -xr!jWebSocketServer-Bundle-%ver%.jar -xr!jWebSocketReportingPlugIn-Bundle.jar
7z u -mx9 -tzip "%dest%" "%rt%"database/readme.txt
popd

:server

echo -------------------------------------------------------------------------
echo Packaging server.zip...
echo -------------------------------------------------------------------------
set tempDir=%down%jWebSocket-%ver%\
set dest=%down%jWebSocketServer-%ver%.zip
if exist %dest% del %dest%

if not exist "%tempdir%" md "%tempdir%"
if not exist "%tempdir%\logs" md "%tempdir%\logs"
if not exist "%tempdir%\bin" md "%tempdir%\bin"

rem Start batches and scripts
xcopy %bin%jWebSocketServer.bat %tempdir%bin\ /s /i /y
xcopy %bin%jWebSocketServerLocal.bat %tempdir%bin\ /s /i /y
xcopy %bin%jWebSocketServer.sh %tempdir%bin\ /s /i /y
xcopy %bin%jWebSocketServer_Ubuntu.sh %tempdir%bin\ /s /i /y
xcopy %bin%jWebSocketServer.command %tempdir%bin\ /s /i /y
xcopy %bin%jWebSocketAdmin.bat %tempdir%bin\ /s /i /y
xcopy %bin%jWebSocketAdmin.sh %tempdir%bin\ /s /i /y
xcopy %bin%jWebSocketAdmin_Ubuntu.sh %tempdir%bin\ /s /i /y
xcopy %bin%jWebSocketAdmin.command %tempdir%bin\ /s /i /y

rem Database driver and other required external libs
xcopy %libs%mysql-connector-java-5.1.16.jar %tempdir%libs\ /s /i /y
xcopy %libs%sqlite-jdbc-3.7.2.jar %tempdir%libs\ /s /i /y
xcopy %libs%kahadb-5.5.0.jar %tempdir%libs\ /s /i /y
xcopy %libs%derby-10.10.1.1.jar %tempdir%libs\ /s /i /y
xcopy %libs%xbean-spring*.jar %tempdir%libs\ /s /i /y

rem jWebSocket engines
xcopy %libs%jWebSocketJettyEngine-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketGrizzlyEngine-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketTomcatEngine-%ver%.jar %tempdir%libs\ /s /i /y

rem jWebSocket .jars
xcopy %libs%jWebSocketCommon-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketDynamicSQL-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketServerAPI-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketServer-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketAdminPlugIn-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketAPIPlugIn-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketArduinoPlugIn-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketBenchmarkPlugIn-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketChannelPlugIn-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketCloudPlugIn-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketFTPPlugIn-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketChatPlugIn-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketEventsPlugIn-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketExtProcessPlugIn-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketFileSystemPlugIn-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketJCaptchaPlugIn-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketJCRPlugIn-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketJDBCPlugIn-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketJMSEndPoint-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketJMSPlugIn-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketJMSDemoPlugIn-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketJMXPlugIn-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketItemStoragePlugIn-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketJQueryPlugIn-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketLoadbalancerPlugIn-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketLoggingPlugIn-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketMailPlugIn-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketMonitoringPlugIn-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketPayPalPlugIn-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketPingPongGame-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketProxyPlugIn-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketQuotaPlugIn-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketReportingPlugIn-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketRPCPlugIn-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketRTCPlugIn-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketSenchaPlugIn-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketScriptingPlugIn-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketSharedObjectsPlugIn-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketSharedCanvasPlugIn-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketSMSPlugIn-%ver%.jar %tempdir%libs\ /s /i /y
rem xcopy %libs%jWebSocketSSOPlugIn-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketStatisticsPlugIn-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketStreamingPlugIn-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketTestPlugIn-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketTTSPlugIn-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketTwitterPlugIn-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketXMPPPlugIn-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketClientAPI-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketJavaSEClient-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketJavaSEClient-Bundle-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketSwingGUI-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketProxy-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketSamples-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketAMQStockTicker-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketLDAP-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketSSO-%ver%.jar %tempdir%libs\ /s /i /y
xcopy %libs%jWebSocketStockTickerPlugIn-%ver%.jar %tempdir%libs\ /s /i /y

rem jWebSocket config and keystore files (from v1.0) for SSL
echo f|xcopy %conf%jWebSocket.xml %tempdir%conf\jWebSocketDevFull.xml /s /i /y
echo f|xcopy %conf%jWebSocketDeployment.xml %tempdir%conf\jWebSocket.xml /s /i /y
xcopy xcopy %conf%jWebSocketScripting.xml %tempdir%libs\ /s /i /y

rem spring config files (from v1.0)
xcopy %conf%spring-beans.dtd %tempdir%conf\ /s /i /y

rem jWebSocket development config file
xcopy %conf%jWebSocketDevMinimum.xml %tempdir%conf\ /s /i /y
xcopy %conf%jWebSocketJMSClusterNode01.xml %tempdir%conf\ /s /i /y
xcopy %conf%jWebSocketJMSClusterNode02.xml %tempdir%conf\ /s /i /y
xcopy %conf%jWebSocketJMSClusterNode03.xml %tempdir%conf\ /s /i /y

rem jWebSocket SSL keystore
xcopy %conf%jWebSocket.ks %tempdir%conf\ /s /i /y
xcopy %conf%jWebSocket.key %tempdir%conf\ /s /i /y
xcopy %conf%jWebSocket.csr %tempdir%conf\ /s /i /y
xcopy %conf%jWebSocket.crt %tempdir%conf\ /s /i /y
xcopy %conf%jWebSocket.pkcs12 %tempdir%conf\ /s /i /y
xcopy %conf%jWebSocket.policy %tempdir%conf\ /s /i /y
xcopy %conf%openssl.cnf %tempdir%conf\ /s /i /y
xcopy %conf%createKeyStore.bat %tempdir%conf\ /s /i /y
xcopy %conf%createSelfSignedCert.bat %tempdir%conf\ /s /i /y

rem spring config files (from v1.0)
xcopy %conf%ehcache.xml %tempdir%conf\ /s /i /y
xcopy %conf%AdminPlugIn\*.xml %tempdir%conf\AdminPlugIn\ /s /i /y
xcopy %conf%APIPlugIn\*.xml %tempdir%conf\APIPlugIn\ /s /i /y
xcopy %conf%ChannelPlugIn\*.xml %tempdir%conf\ChannelPlugIn\ /s /i /y
xcopy %conf%CloudPlugIn\*.xml %tempdir%conf\CloudPlugIn\ /s /i /y
xcopy %conf%EventsPlugIn\*.xml %tempdir%conf\EventsPlugIn\ /s /i /y
xcopy %conf%FTPPlugIn\*.xml %tempdir%conf\FTPPlugIn\ /s /i /y
xcopy %conf%ExtProcessPlugIn\*.xml %tempdir%conf\ExtProcessPlugIn\ /s /i /y
xcopy %conf%FileSystemPlugIn\*.xml %tempdir%conf\FileSystemPlugIn\ /s /i /y
rem Flash Cross-Domain configuration
xcopy %conf%FlashPlugIn\*.xml %tempdir%conf\FlashPlugIn\ /s /i /y
xcopy %conf%ItemStoragePlugIn\*.xml %tempdir%conf\ItemStoragePlugIn\ /s /i /y
xcopy %conf%JDBCPlugIn\*.xml %tempdir%conf\JDBCPlugIn\ /s /i /y
xcopy %conf%JMSEngine\*.xml %tempdir%conf\JMSEngine\ /s /i /y
xcopy %conf%JMSPlugIn\*.xml %tempdir%conf\JMSPlugIn\ /s /i /y
xcopy %conf%JMXPlugIn\*.xml %tempdir%conf\JMXPlugIn\ /s /i /y
xcopy %conf%jWebSocketSwingGUI\*.properties %tempdir%conf\jWebSocketSwingGUI\ /s /i /y
xcopy %conf%LoadBalancerPlugIn\*.xml %tempdir%conf\LoadBalancerPlugIn\ /s /i /y
xcopy %conf%LoggingPlugIn\*.xml %tempdir%conf\LoggingPlugIn\ /s /i /y
xcopy %conf%MailPlugIn\*.xml %tempdir%conf\MailPlugIn\ /s /i /y
xcopy %conf%PayPalPlugIn\*.xml %tempdir%conf\PayPalPlugIn\ /s /i /y
xcopy %conf%QuotaPlugIn\*.xml %tempdir%conf\QuotaPlugIn\ /s /i /y
xcopy %conf%ReportingPlugIn\*.xml %tempdir%conf\ReportingPlugIn\ /s /i /y
xcopy %conf%ReportingPlugIn\reports\*.jrxml %tempdir%conf\ReportingPlugIn\reports /s /i /y
xcopy %conf%ReportingPlugIn\reports\*.png %tempdir%conf\ReportingPlugIn\reports /s /i /y
xcopy %conf%Resources\*.xml %tempdir%conf\Resources\ /s /i /y
xcopy %conf%RTCPlugIn\*.xml %tempdir%conf\RTCPlugIn\ /s /i /y
xcopy %conf%ScriptingPlugIn\*.xml %tempdir%conf\ScriptingPlugIn\ /s /i /y
rem for the scripting plug-in we also need the extensions, this right now are only .js files!
xcopy %conf%ScriptingPlugIn\*.js %tempdir%conf\ScriptingPlugIn\ /s /i /y
xcopy %conf%SMSPlugIn\*.xml %tempdir%conf\SMSPlugIn\ /s /i /y
rem xcopy %conf%SSOPlugIn\*.xml %tempdir%conf\SSOPlugIn\ /s /i /y
xcopy %conf%SystemPlugIn\*.xml %tempdir%conf\SystemPlugIn\ /s /i /y
xcopy %conf%TTSPlugIn\*.xml %tempdir%conf\TTSPlugIn\ /s /i /y
xcopy %conf%TwitterPlugIn\*.xml %tempdir%conf\TwitterPlugIn\ /s /i /y
xcopy %conf%XMPPPlugIn\*.xml %tempdir%conf\XMPPPlugIn\ /s /i /y

rem copy special conf settings for Tomcat engine (from v1.0)
xcopy %conf%TomcatEngine\*.xml %tempdir%conf\TomcatEngine\ /s /i /y

rem copy jWebSocket JavaScript apps (from v1.0)
xcopy %apps%*.* %tempdir%apps\ /s /i /y

rem log4j config files (from v1.0)
xcopy %conf%log4j.xml %tempdir%conf\ /s /i /y

rem copy jWebSocket database (from v1.0)
rem xcopy %database%jWebSocket.db %tempdir%database\ /s /i /y
xcopy %database%readme.txt %tempdir%database\ /s /i /y

rem copy jWebSocket filesystem (from v1.0)
xcopy %filesystem%public\ReadMe.txt %tempdir%filesystem\public\ /s /i /y
xcopy %filesystem%private\ReadMe.txt %tempdir%filesystem\private\ /s /i /y

rem web folder
xcopy %web%index.htm %tempdir%web\ /s /i /y

rem cache readme (from v1.0, will create cache folder at target)
xcopy %cache%ReadMe_Cache.txt %tempdir%cache\ /s /i /y

7z u -mx9 -tzip -r  "%dest%" %tempdir%

rd %tempdir% /q/s

rem goto end


:serverbundle

echo -------------------------------------------------------------------------
echo Packaging server_bundle...
echo -------------------------------------------------------------------------
set dest=%down%jWebSocketServer-Bundle-%ver%.zip
if exist "%dest%" del "%dest%"
7z u -mx9 -r -tzip "%dest%" "%libs%jWebSocketServer-Bundle-%ver%.jar"
7z u -mx9 -r -tzip "%dest%" "%depl%ReadMe_ServerBundle.txt"
rem jWebSocket config file
7z u -mx9 -r -tzip "%dest%" "%conf%jWebSocket.xml"
rem SSL keystore
7z u -mx9 -r -tzip "%dest%" "%conf%jWebSocket.ks"
rem spring config files (from v1.0)
7z u -mx9 -r -tzip "%dest%" "%conf%ehcache.xml"
7z u -mx9 -r -tzip "%dest%" "%conf%log4j.xml"

rem goto end


:winexe

echo -------------------------------------------------------------------------
echo Packaging Windows Executables and Services...
echo -------------------------------------------------------------------------
set dest=%down%jWebSocketWindows-%ver%.zip
if exist "%dest%" del "%dest%"
7z u -mx9 -tzip "%dest%" "%bin%jWebSocketServer32.exe"
7z u -mx9 -tzip "%dest%" "%bin%jWebSocketAdmin32.exe"
7z u -mx9 -tzip "%dest%" "%depl%ReadMe_Server32.txt"
7z u -mx9 -tzip "%dest%" "%bin%jWebSocketServer64.exe"
7z u -mx9 -tzip "%dest%" "%bin%jWebSocketAdmin64.exe"
7z u -mx9 -tzip "%dest%" "%depl%ReadMe_Server64.txt"

7z u -mx9 -tzip "%dest%" "%bin%jWebSocketService32.exe"
7z u -mx9 -tzip "%dest%" "%bin%jWebSocketInstallService32.bat"
7z u -mx9 -tzip "%dest%" "%bin%jWebSocketUninstallService32.bat"
7z u -mx9 -tzip "%dest%" "%depl%ReadMe_Service32.txt"
7z u -mx9 -tzip "%dest%" "%bin%jWebSocketService64.exe"
7z u -mx9 -tzip "%dest%" "%bin%jWebSocketInstallService64.bat"
7z u -mx9 -tzip "%dest%" "%bin%jWebSocketUninstallService64.bat"
7z u -mx9 -tzip "%dest%" "%depl%ReadMe_Service64.txt"

rem goto end


:jms_stock_ticker

echo -------------------------------------------------------------------------
echo Packaging AMQ Stock Ticker...
echo -------------------------------------------------------------------------
set dest=%down%jWebSocketAMQStockTicker-%ver%.zip
if exist "%dest%" del "%dest%"
7z u -mx9 -tzip "%dest%" "%bin%jWebSocketAMQStockTicker.bat"
7z u -mx9 -tzip "%dest%" "%bin%jWebSocketAMQStockTickerService32.exe"
7z u -mx9 -tzip "%dest%" "%bin%jWebSocketInstallAMQStockTickerService32.bat"
7z u -mx9 -tzip "%dest%" "%bin%jWebSocketUninstallAMQStockTickerService32.bat"
7z u -mx9 -tzip "%dest%" "%depl%ReadMe_AMQStockTickerService32.txt"
7z u -mx9 -tzip "%dest%" "%bin%jWebSocketAMQStockTickerService64.exe"
7z u -mx9 -tzip "%dest%" "%bin%jWebSocketInstallAMQStockTickerService64.bat"
7z u -mx9 -tzip "%dest%" "%bin%jWebSocketUninstallAMQStockTickerService64.bat"
7z u -mx9 -tzip "%dest%" "%depl%ReadMe_AMQStockTickerService64.txt"

rem goto end


:client

echo -------------------------------------------------------------------------
echo Packaging jWebSocket Client...
echo -------------------------------------------------------------------------
echo on
pushd ..\jWebSocketClient
move web jWebSocketClient-%ver%
popd
set src=..\jWebSocketClient\
set dest=%down%jWebSocketClient-%ver%.zip
if exist "%dest%" del "%dest%"
7z u -mx9 -r -tzip "%dest%" "%src%*.*" -xr!.svn -xr!quickguide -xr!devguide -xr!javadocs -xr!target -xr!jsdoc

pushd ..\jWebSocketClient
move jWebSocketClient-%ver% web
popd

rem goto end



:appserver

set base=..\..\..\..\
set sc=jWebSocketDev\branches\jWebSocket-%ver%\
set dest=jWebSocketDev\downloads\jWebSocket-%ver%\jWebSocketWebAppDemo-%ver%.zip
if exist %dest% del %dest%
pushd %base%
7z u -mx9 -tzip "%dest%" "%sc%jWebSocketWebAppDemo" -xr!target -xr!.svn -xr!dist -xr!build -xr!.DS_Store
popd

rem goto end

set dest=%down%jWebSocketAppSrvDemo-%ver%.zip
if exist "%dest%" del "%dest%"
7z u -mx9 -r -tzip "%dest%" "%libs%jWebSocketAppSrvDemo-%ver%.war"
rem 7z u -mx9 -r -tzip "%dest%" "%libs%jWebSocketSamples-%ver%.jar"
7z u -mx9 -r -tzip "%dest%" "%depl%ReadMe_AppSrvDemo.txt"

set dest=%down%jWebSocketTomcatEngine-%ver%.zip
if exist "%dest%" del "%dest%"
7z u -mx9 -r -tzip "%dest%" "%libs%jWebSocketTomcatEngine-%ver%.jar"
7z u -mx9 -r -tzip "%dest%" "%depl%ReadMe_TomcatEngine.txt"

set dest=%down%jWebSocketJetty-%ver%.zip
if exist "%dest%" del "%dest%"
7z u -mx9 -r -tzip "%dest%" "%libs%jWebSocketJetty-%ver%.war"
7z u -mx9 -r -tzip "%dest%" "%libs%jWebSocketSamples-%ver%.jar"
7z u -mx9 -r -tzip "%dest%" "%depl%ReadMe_Jetty.txt"

rem goto end


:proxy

echo -------------------------------------------------------------------------
echo Packaging Proxy...
echo -------------------------------------------------------------------------
set dest=%down%jWebSocketProxy-%ver%.zip
if exist "%dest%" del "%dest%"
7z u -mx9 -r -tzip "%dest%" "%libs%jWebSocketProxy-%ver%.jar"
7z u -mx9 -r -tzip "%dest%" "%depl%ReadMe_Proxy.txt"

rem goto end


:android_demo

rem echo -------------------------------------------------------------------------
rem echo Packaging Android Demo...
rem echo -------------------------------------------------------------------------
rem set android_base=..\jWebSocketAndroid\
rem set android_demo=%android_base%jWebSocketAndroidDemo\
rem set dest=%down%jWebSocketAndroidDemo-%ver%.zip
rem if exist "%dest%" del "%dest%"
rem 7z u -mx9 -r -tzip "%dest%" "%android_demo%bin\jWebSocketAndroidDemo.apk"
rem 7z u -mx9 -r -tzip "%dest%" "%depl%ReadMe_Android.txt"

rem goto end


:package

echo -------------------------------------------------------------------------
echo Packaging complete package...
echo -------------------------------------------------------------------------
set dest=%down%jWebSocket-%ver%.zip
if exist "%dest%" del "%dest%"
rem 7z u -mx9 -r -tzip "%dest%" "%down%jWebSocketAndroidDemo-%JWEBSOCKET_VER%.zip"
7z u -mx9 -r -tzip "%dest%" "%down%jWebSocketWebAppDemo-%JWEBSOCKET_VER%.zip"
7z u -mx9 -r -tzip "%dest%" "%down%jWebSocketAppSrvDemo-%JWEBSOCKET_VER%.zip"
7z u -mx9 -r -tzip "%dest%" "%down%jWebSocketClient-%JWEBSOCKET_VER%.zip"
rem 7z u -mx9 -r -tzip "%dest%" "%down%jWebSocketFullSources-%JWEBSOCKET_VER%.zip"
7z u -mx9 -r -tzip "%dest%" "%down%jWebSocketProxy-%JWEBSOCKET_VER%.zip"
7z u -mx9 -r -tzip "%dest%" "%down%jWebSocketServer-%JWEBSOCKET_VER%.zip"
7z u -mx9 -r -tzip "%dest%" "%down%jWebSocketServer32-%JWEBSOCKET_VER%.zip"
7z u -mx9 -r -tzip "%dest%" "%down%jWebSocketServer64-%JWEBSOCKET_VER%.zip"
rem 7z u -mx9 -r -tzip "%dest%" "%down%jWebSocketServer-Bundle-%JWEBSOCKET_VER%.zip"
7z u -mx9 -r -tzip "%dest%" "%down%jWebSocketService32-%JWEBSOCKET_VER%.zip"
7z u -mx9 -r -tzip "%dest%" "%down%jWebSocketService64-%JWEBSOCKET_VER%.zip"
7z u -mx9 -r -tzip "%dest%" "%down%jWebSocketAMQStockTickerService32-%JWEBSOCKET_VER%.zip"
7z u -mx9 -r -tzip "%dest%" "%down%jWebSocketAMQStockTickerService64-%JWEBSOCKET_VER%.zip"
7z u -mx9 -r -tzip "%dest%" "%depl%ReadMe_jWebSocket.txt"


:end

if "%1"=="/y" goto dontAsk2
pause
:dontAsk2
