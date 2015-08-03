/* global require */
//	---------------------------------------------------------------------------
//	jWebSocket Jasmine Test Suites (Community Edition, CE)
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

/**
 * Package to include all tests automatically
 * @author Victor Antonio Barzana Crespo
 */

require.config({
	waitSeconds: 300,
	urlArgs: "bust=" + (new Date()).getTime()
});
var TestLoader = {
	JS_PATH: "../res/js/",
	init: function () {
		this.loadJWebSocket();
	},
	loadJWebSocket: function () {
		var lMe = this;
		// First require all jWebSocket Libraries, once that is loaded, then require the tests
		// Use bundle to get all jWebSocket plug-ins embedded at once
		// also use minified version to check/validate obfuscator
		// ../res/js/jWebSocket_Bundle_min.js
		require([this.JS_PATH + "jWebSocket_Bundle.js"], function () {
			lMe.onJWebSocketLoaded();
		});
	},
	onJWebSocketLoaded: function () {
		var lMe = this;
		/*
		 #####################################
		 #   INCLUDE YOUR TEST FILES HERE    #
		 #####################################*/
		require([
			// Shared test specs for opening and closing connections
			"js/tests/jwsSharedTests",
			"js/tests/jwsAutomatedAPITests.js",
			"js/tests/jwsBenchmarks.js",
			"js/tests/jwsChannelTests.js",
			"js/tests/jwsFilesystemTests.js",
			"js/tests/jwsIOC.js",
			"js/tests/jwsItemStorageTests.js",
			"js/tests/jwsJDBCTests.js",
			"js/tests/jwsJMSTests.js",
			"js/tests/jwsLoadBalancerTests.js",
			"js/tests/jwsLoadTests.js",
			"js/tests/jwsLoggingTests.js",
			"js/tests/jwsQuotaTests.js",
			"js/tests/jwsREST.js",
			"js/tests/jwsRPCTests.js",
			"js/tests/jwsReportingTests.js",
			"js/tests/jwsScriptingPlugInTest.js",
			"js/tests/jwsStreamingTests.js",
			"js/tests/jwsSystemTests.js"
		], function () {
			lMe.loadSuite();
		});
	},
	loadSuite: function () {
		var lMe = this;
		require(["js/jwsTestSuites.js"], function () {
			lMe.onTestLoadComplete();
		});
	},
	/**
	 * This method is executed when the tests are completely loaded
	 * @returns {undefined}
	 */
	onTestLoadComplete: function () {
		TestSuite.init();
	}
};
TestLoader.init();

