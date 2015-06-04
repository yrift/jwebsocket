@echo off

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
echo This will clean-up the known local work files (e.g. file uploads, stored mails, generated reports, caches etc.). 
echo.
echo Are you sure?
echo.
if "%1"=="/y" goto dontAsk1
pause
:dontAsk1

set jwsroot=%JWEBSOCKET_HOME%..\..\

echo Removing temporary cached reports...
if EXIST "%jwsroot%branches\jWebSocket-%JWEBSOCKET_VER%\jWebSocketClient\web\public\reports\" (
	del %jwsroot%branches\jWebSocket-%JWEBSOCKET_VER%\jWebSocketClient\web\public\reports\*.pdf /F /Q
)

echo Removing temporary canvas demo .png's...
del %jwsroot%branches\jWebSocket-%JWEBSOCKET_VER%\jWebSocketClient\web\public\canvas_demo_?.png /F /Q

echo Removing uploaded files from file system folder...
rd /S /Q %jwsroot%rte\jWebSocket-%JWEBSOCKET_VER%\filesystem\private\
rd /S /Q %jwsroot%rte\jWebSocket-%JWEBSOCKET_VER%\filesystem\public\
md %jwsroot%rte\jWebSocket-%JWEBSOCKET_VER%\filesystem\private
md %jwsroot%rte\jWebSocket-%JWEBSOCKET_VER%\filesystem\public

echo Removing cached mails and attachments...
rd /S /Q %jwsroot%rte\jWebSocket-%JWEBSOCKET_VER%\mails\
md %jwsroot%rte\jWebSocket-%JWEBSOCKET_VER%\mails

echo Removing obsolete ApacheMQ data...
if EXIST "%jwsroot%branches\jWebSocket-%JWEBSOCKET_VER%\jWebSocketServer\activemq-data\localhost" (
	del %jwsroot%branches\jWebSocket-%JWEBSOCKET_VER%\jWebSocketServer\activemq-data\localhost\KahaDB\db*.* /F /Q
	del %jwsroot%branches\jWebSocket-%JWEBSOCKET_VER%\jWebSocketServer\activemq-data\localhost\KahaDB\lock /F /Q
)

echo.
echo Clean-up done!
echo.

if "%1"=="/y" goto dontAsk2
pause
:dontAsk2