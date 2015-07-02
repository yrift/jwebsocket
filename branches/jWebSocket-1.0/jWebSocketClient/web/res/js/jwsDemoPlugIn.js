//	---------------------------------------------------------------------------
//	jWebSocket Demo Plug-in (Community Edition, CE)
//	---------------------------------------------------------------------------
//	Copyright 2010-2015 Innotrade GmbH (jWebSocket.org)
//	Alexander Schulze, Germany (NRW)
//
//	Licensed under the Apache License, Version 2.0 (the "License");
//	you may not use this file except in compliance with the License.
//	You may obtain a copy of the License at
//
//	http://www.apache.org/licenses/LICENSE-2.0
//
//	Unless required by applicable law or agreed to in writing, software
//	distributed under the License is distributed on an "AS IS" BASIS,
//	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//	See the License for the specific language governing permissions and
//	limitations under the License.
//	---------------------------------------------------------------------------

jws.DemoPlugIn = {

	// namespace for filesystem plugin
	// if namespace is changed update server plug-in accordingly!
	NS: jws.NS_BASE + ".plugins.demo",

	STATIC_CONST: 1,

	processToken: function( aToken ) {
		// check if namespace matches
		if( aToken.ns === "*" ) {
		}
	},
	
	replaceSpecials: function( aText ) {
		aText = aText.replace( /{nbdash}/ig, "&#x2011;" );
		aText = aText.replace( /{nbsp}/ig, "&nbsp;" );
		return aText;
	},

	buildDemoPage: function( aOptions ) {
		// this line is auto generated by the template demo
		var lCallbacksString = "var lCallbacks = {};", lHTML =
			'<table class="tblHeader" width="100%" cellspacing="0" cellpadding="0"> <tbody><tr> <td class="tdHeader" width="">{header}</td> <td class="tdHeader" width="1%"><img id="simgStatus" src="../../images/disconnected.png" align="right"></td> <td class="tdHeader" width="1%"><span id="slblClientId">{nbsp}Client{nbdash}Id:{nbsp}-</span></td> </tr> </tbody></table> <p>{description}</p> <div id="sdivLog" class="sdivContainer" style="position:relative; height:300px; overflow:auto;"></div> <div class="sdivContainer"> <table class="stlbDlg" border="0" cellpadding="0" cellspacing="0"> <tbody><tr> <td valign="top"> <table class="stlbDlg" border="0" cellpadding="1" cellspacing="0"> <tbody><tr class="strDlg"> <td class="stdDlg" width="5">Username</td> <td class="stdDlg" width="5"> <input class="stxfDlg" id="stxfUsername" type="text" value="root" style="width:150px" title="jWebSocket username or \'Guest\' for demo."> </td> <td class="stdDlg" width="5"> <input class="sbtnDlg" id="sbtnConnect" type="button" value="Connect" onclick="connect();"> </td> <td class="stdDlg" width="5"> <input class="sbtnDlg" id="sbtnLogin" type="button" value="Login" onclick="login();" title="Authenticates you against the jWebSocket Server."> </td> <td class="stdDlg" width="5"> <input class="sbtnDlg" id="sbtnClear" type="button" value="Clear Log" onclick="clearLog();" title="Clears the result and event log above."> </td> <td class="stdDlg" width=""> {nbsp} </td> </tr> <tr class="strDlg"> <td class="stdDlg" width="5">Password</td> <td class="stdDlg" width="5"> <input class="spwfDlg" id="spwfPassword" type="password" value="root" style="width:150px" title="jWebSocket password or \'guest\' for demo."> </td> <td class="stdDlg" width="5"> <input class="sbtnDlg" id="sbtnDisconnect" type="button" value="Disconnect" onclick="disconnect();"> </td> <td class="stdDlg" width="5"> <input class="sbtnDlg" id="sbtnLogout" type="button" value="Logout" onclick="logout();" title="Logs you out and disconnects from the jWebSocket server."> </td> <td class="stdDlg" width="5"> <input class="sbtnDlg" id="sbtnClear" type="button" value="Export" onclick="exportToString();" title="Exports this template as a string to be embedded into jwsDemoPlugIn.js."> </td> <td class="stdDlg" width=""> {nbsp} </td> </tr> <tr class="strDlg"> <td class="stdDlg" width="5">URL</td> <td class="stdDlg" width="" colspan="4"> <input class="stxfDlg" id="stxfURL" type="text" value="" style="width:100%"> </td> </tr> </tbody></table> </td> <td valign="top"> <table class="stlbDlg" border="0" cellpadding="3" cellspacing="0"> <tbody><tr class="strDlg"> <td class="stdDlg">Ports</td> <td class="stdDlg">Options</td> <td class="stdDlg" colspan="2">{nbsp}</td> </tr> <tr class="strDlg"> <td class="stdDlg"> <input id="srbtStdPorts" name="ports" type="radio" value="off" onclick="tooglePorts();" title="Shares port 80 for http/ws and port 443 for https/wss">{nbsp}80/443{nbsp} </td> <td class="stdDlg"> <input id="schkSSL" type="checkbox" value="off" onclick="toogleSSL();">{nbsp}SSL{nbsp} </td> <td class="stdDlg"> <input id="schkDebug" type="checkbox" value="on" checked="checked">{nbsp}Debug{nbsp} </td> </tr> <tr class="strDlg"> <td class="stdDlg"> <input id="srbtSepPorts" name="ports" type="radio" value="on" checked="checked" onclick="tooglePorts();" title="Uses separate ports 80/443 for http/https and 8787/9797 for ws/wss.">{nbsp}8787/9797{nbsp} </td> <td class="stdDlg"> <input id="schkKeepAlive" type="checkbox" value="off" onclick="checkKeepAlive();">{nbsp}Keep-Alive{nbsp} </td> <td class="stdDlg" colspan="2">{nbsp}</td> </tr> </tbody></table> </td> </tr> </tbody></table> </div>';
		lHTML = this.replaceSpecials( lHTML  );
		aOptions = jws.getOptions(aOptions, {});
			if( aOptions.header ) {
				lHTML = lHTML.replace( /{header}/ig, aOptions.header );
			}	
			if( aOptions.description ) {
				lHTML = lHTML.replace( /{description}/ig, aOptions.description );
			}	
		if (aOptions.callbacks) {
			lCallbacksString = "var lCallbacks = {";
			var lIsFirst = true;
			for (var lIdx in aOptions.callbacks) {
				if (aOptions.callbacks.hasOwnProperty(lIdx)) {
					if(!lIsFirst){
						lCallbacksString += ",";
		}
					lIsFirst = false;
					lCallbacksString += lIdx + ":" + aOptions.callbacks[lIdx] + "\n";
				}
			}
			lCallbacksString += "};";
		}
		// this line is auto generated by the template demo
		var lScript = lCallbacksString + 'var eLog = null;function log(aString) {	eLog.innerHTML += aString + "<br>";	if (eLog.scrollHeight > eLog.clientHeight) {		eLog.scrollTop = eLog.scrollHeight - eLog.clientHeight;	}}function clearLog() {	eLog.innerHTML = "";	eLog.scrollTop = 0;}var lWSC = null;function connect() {	var lURL = eURL.value;	log("Connecting to " + lURL + " ...");	if (lWSC.isConnected()) {		log("Already connected.");		return;	}	try {		lWSC.open(lURL, {subProtocol: jws.WS_SUBPROT_JSON, wsClass: self.STOMPWebSocket || self.WebSocket || null, 			OnOpen: function (aEvent) {				log("jWebSocket connection established.");				jws.$("simgStatus").src = "../../images/connected.png";				if(lCallbacks && lCallbacks.OnOpen){					lCallbacks.OnOpen(aEvent);				}			}, OnWelcome: function (aEvent) {				log("jWebSocket Welcome received.");				if(lCallbacks && lCallbacks.OnWelcome){					lCallbacks.OnWelcome(aEvent);				}			}, OnGoodBye: function (aEvent) {				log("jWebSocket GoodBye received.");				if(lCallbacks && lCallbacks.OnGoodBye){					lCallbacks.OnGoodBye(aEvent);				}			}, OnMessage: function (aEvent) {				log("jWebSocket message received: <pre><font size=\'2\'>" + JSON.stringify(JSON.parse(aEvent.data), null, 3) + "</font></pre>");				if (lWSC.isLoggedIn()) {					jws.$("simgStatus").src = "../../images/authenticated.png";				} else {					jws.$("simgStatus").src = "../../images/connected.png";				}				jws.$("slblClientId").innerHTML = "{nbsp}Client{nbdash}Id:{nbsp}" + lWSC.getId() + "{nbsp}" + (jws.browserSupportsNativeWebSockets ? "(native)" : "(flashbridge)");				if(lCallbacks && lCallbacks.OnMessage){					lCallbacks.OnMessage(aEvent);				}			}, OnClose: function (aEvent) {				log("jWebSocket connection closed.");				jws.$("simgStatus").src = "../../images/disconnected.png";				jws.$("slblClientId").innerHTML = "{nbsp}Client{nbdash}Id:{nbsp}-";				if(lCallbacks && lCallbacks.OnClose){					lCallbacks.OnClose(aEvent);				}			}});	} catch (ex) {		log("Exception: " + ex.message);	}}function disconnect() {	if (lWSC) {		log("Disconnecting...");		try {			var lRes = lWSC.close({timeout: 3000});			if (lRes.code == 0) {			} else {				log(lRes.msg);			}		} catch (ex) {			log("Exception: " + ex.message);		}	}}function checkKeepAlive(aOptions) {	if (!aOptions) {		aOptions = {};	}	aOptions.interval = 30000;	if (eKeepAlive.checked) {		lWSC.startKeepAlive(aOptions);	} else {		lWSC.stopKeepAlive();	}}function login() {	if (lWSC) {		log("Logging in...");		try {			var lRes = lWSC.login(eUsername.value, ePassword.value, {encoding: jws.SystemClientPlugIn.PW_ENCODE_MD5});			if (lRes.code == 0) {				log("Asychronously waiting for response...");			} else {				log(lRes.msg);			}		} catch (ex) {			log("Exception: " + ex.message);		}	}}function logout() {	if (lWSC) {		log("Logging out...");		try {			var lRes = lWSC.logout();			if (lRes.code == 0) {				log("Asychronously waiting for response...");			} else {				log(lRes.msg);			}		} catch (ex) {			log("Exception: " + ex.message);		}	}}var lHost = "localhost";var lUseSSL = false;var lSharePorts = false;function buildURL() {	var lURL = (lUseSSL ? "wss" : "ws") + "://" + lHost + ":" + (lSharePorts ? (lUseSSL ? "443" : "80") : (lUseSSL ? "9797" : "8787")) + "/jWebSocket/jWebSocket";	eURL.value = lURL;}function tooglePorts() {	lSharePorts = eSharedPort.checked;	buildURL();}function toogleSSL() {	lUseSSL = eUseSSL.checked;	buildURL();}function processInitPage() {	eLog = jws.$("sdivLog");	eUsername = jws.$("stxfUsername");	ePassword = jws.$("spwfPassword");	eURL = jws.$("stxfURL");	eUseSSL = jws.$("schkSSL");	eSharedPort = jws.$("srbtStdPorts");	buildURL();	if (window.WebSocket) {		lWSC = new jws.jWebSocketJSONClient();	} else {		jws.$("sbtnConnect").setAttribute("disabled", "disabled");		jws.$("sbtnDisconnect").setAttribute("disabled", "disabled");		jws.$("sbtnClear").setAttribute("disabled", "disabled");		jws.$("stxfURL").setAttribute("disabled", "disabled");		var lMsg = jws.MSG_WS_NOT_SUPPORTED;		alert(lMsg);		log(lMsg);	}}function processExitPage() {	disconnect();}';
//			'var eLog = null; var eUsername = null; var ePassword = null; var eURL = null; var eUseSSL = null; var eSharedPort = null; var eKeepAlive = null; function log( aString ) { eLog.innerHTML += aString + "<br>"; if( eLog.scrollHeight > eLog.clientHeight ) { eLog.scrollTop = eLog.scrollHeight - eLog.clientHeight; } } function info( aString ) { log("" + aString + ""); } function warn( aString ) { log("" + aString + ""); } function error( aString ) { log("" + aString + ""); } function clearLog() { eLog.innerHTML = ""; eLog.scrollTop = 0; } var lWSC = null; function connect() { var lURL = eURL.value; log( "Connecting to " + lURL + " ..." ); if( lWSC.isConnected()) { log( "Already connected." ); return; } try { lWSC.open( lURL, { subProtocol: jws.WS_SUBPROT_JSON, OnOpen: function( aEvent ) { log( "jWebSocket connection established." ); jws.$("simgStatus").src = "../../images/connected.png"; }, OnWelcome: function( aEvent ) { log( "jWebSocket Welcome received." ); }, OnGoodBye: function( aEvent ) { log( "jWebSocket GoodBye received." ); }, OnMessage: function( aEvent ) { log( "jWebSocket message received: \'" + aEvent.data + "\'" ); if( lWSC.isLoggedIn() ) { jws.$("simgStatus").src = "../../images/authenticated.png"; } else { jws.$("simgStatus").src = "../../images/connected.png"; } jws.$("slblClientId").innerHTML = "{nbsp}Client{nbdash}Id:{nbsp}" + lWSC.getId() + "{nbsp}" + ( jws.browserSupportsNativeWebSockets ? "(native)" : "(flashbridge)" ); }, OnClose: function( aEvent ) { log( "jWebSocket connection closed." ); jws.$("simgStatus").src = "../../images/disconnected.png"; jws.$("slblClientId").innerHTML = "{nbsp}Client{nbdash}Id:{nbsp}-"; } }); } catch( ex ) { log( "Exception: " + ex.message ); } } function disconnect() { if( lWSC ) { log( "Disconnecting..." ); try { var lRes = lWSC.close({ timeout: 3000 }); if( lRes.code == 0 ) { } else { log( lRes.msg ); } } catch( ex ) { log( "Exception: " + ex.message ); } } } function checkKeepAlive( aOptions ) { if( !aOptions ) { aOptions = {}; } aOptions.interval = 30000; if( eKeepAlive.checked ) { lWSC.startKeepAlive( aOptions ); } else { lWSC.stopKeepAlive(); } } function login() { if( lWSC ) { log( "Logging in..." ); try { var lRes = lWSC.login( eUsername.value, ePassword.value, { encoding: jws.SystemClientPlugIn.PW_ENCODE_MD5 } ); if( lRes.code == 0 ) { log( "Asychronously waiting for response..." ); } else { log( lRes.msg ); } } catch( ex ) { log( "Exception: " + ex.message ); } } } function logout() { if( lWSC ) { log( "Logging out..." ); try { var lRes = lWSC.logout(); if( lRes.code == 0 ) { log( "Asychronously waiting for response..." ); } else { log( lRes.msg ); } } catch( ex ) { log( "Exception: " + ex.message ); } } } var lHost = "127.0.0.1"; var lUseSSL = false; var lSharePorts = false; var lContext = "jWebSocket"; var lServlet = "jWebSocket"; var lArgs = [{name : "arg1", value : "val1" }, { name : "arg2", value : "val2" }]; function buildURL() { var lURL = ( lUseSSL ? "wss" : "ws" ) + "://" + lHost + ":" + ( lSharePorts ? ( lUseSSL ? "443" : "80" ) : ( lUseSSL ? "9797" : "8787" ) ) + "/" + lContext + "/" + lServlet; if( lArgs.length > 0 ) { for( var lIdx = 0, lCnt =lArgs.length; lIdx < lCnt; lIdx++ ) { var lArg = lArgs[ lIdx ]; lURL += ( lIdx == 0 ? "?" : "&" ) + encodeURIComponent( lArg.name ) + "=" + encodeURIComponent( lArg.value ); } }	 eURL.value = lURL; } function tooglePorts() { lSharePorts = eSharedPort.checked; buildURL(); } function toogleSSL() { lUseSSL = eUseSSL.checked; buildURL(); } function processInitPage() { eLog = jws.$( "sdivLog" ); eUsername = jws.$( "stxfUsername" ); ePassword = jws.$( "spwfPassword" ); eURL = jws.$( "stxfURL" ); eUseSSL = jws.$( "schkSSL" ); eSharedPort = jws.$( "srbtStdPorts" ); eKeepAlive = jws.$( "schkKeepAlive" ); buildURL(); if( window.WebSocket ) { lWSC = new jws.jWebSocketJSONClient(); } else { jws.$( "sbtnConnect" ).setAttribute( "disabled", "disabled" ); jws.$( "sbtnDisconnect" ).setAttribute( "disabled", "disabled" ); jws.$( "sbtnClear" ).setAttribute( "disabled", "disabled" ); jws.$( "stxfURL" ).setAttribute( "disabled", "disabled" ); var lMsg = jws.MSG_WS_NOT_SUPPORTED; alert( lMsg ); log( lMsg ); } } function processExitPage() { // disconnect(); } ';
		lScript = this.replaceSpecials( lScript );
		document.open();
		document.write( lHTML );
		document.write( '<script type="text/javascript">' + lScript + '</script>' );
		document.close();
	}

};

// add the JWebSocket Demo PlugIn into the TokenClient class
// jws.oop.addPlugIn( jws.jWebSocketTokenClient, jws.DemoPlugIn );
