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

function runFullTestSuite(aArgs) {
	/*
	 jasmine.VERBOSE = true;
	 */
	var lIntv = jasmine.DEFAULT_UPDATE_INTERVAL;
	jasmine.DEFAULT_UPDATE_INTERVAL = 5;

	var lIncreaseTimeoutFactors = {
		generic: 3,
		generic_debug: 5,
		normal: 1,
		slow: 3,
		very_slow: 5,
		fast: 0.7,
		ultra_fast: 0.3,
		fastest: 0.08
	};
	jasmine.INCREASE_TIMEOUT_FACTOR = lIncreaseTimeoutFactors[aArgs.speed] || 1;


	describe("jWebSocket Test Suite", function () {

		var lTestSSL = $('#tls_set').val() === 'wss';
		// open connections for admin and guest

		if ($("#test_set").val() !== "REST") {
			describe("Opening shared connections...", function () {
				jws.Tests.testOpenSharedAdminConn();
				jws.Tests.testOpenSharedGuestConn();
				if (lTestSSL) {
					jws.Tests.testOpenSharedAdminConnSSL();
					jws.Tests.testOpenSharedGuestConnSSL();
				}
			});
		}

		// running selected tests
		for (var lIndex in aArgs.tests) {
			var lTestName = aArgs.tests[lIndex];
			describe("Performing test suite: jws.tests." + lTestName + "", function () {
				jws.tests[lTestName].runSpecs();
			});
		}

		// close connections for admin and guest
		if ($("#test_set").val() !== "REST") {
			describe("Closing shared connections...", function () {
				jws.Tests.testCloseSharedAdminConn();
				jws.Tests.testCloseSharedGuestConn();
				if (lTestSSL) {
					jws.Tests.testCloseSharedAdminConnSSL();
					jws.Tests.testCloseSharedGuestConnSSL();
				}
			});
		}
		jasmine.DEFAULT_UPDATE_INTERVAL = lIntv;
	});
}


var DEFAULT_CATEGORY = "UNCATEGORIZED";
var DEFAULT_PRIORITY = 100;
var DEFAULT_ENABLED = true;


function initTestsIndex() {
	var lCategories = [];
	var lSortedTests = [];

	for (var lTestName in jws.tests) {
		var lTest = jws.tests[lTestName];
		// setting test unique identifier
		lTest.id = lTest.id || lTestName;

		// setting default values for convenience
		if (typeof lTest['category'] === "undefined")
			lTest['category'] = DEFAULT_CATEGORY;
		if (typeof lTest['priority'] === "undefined")
			lTest['priority'] = DEFAULT_PRIORITY;
		if (typeof lTest['enabled'] === "undefined")
			lTest['enabled'] = DEFAULT_ENABLED;

		// getting categories set
		if (lCategories.indexOf(lTest.category) == -1) {
			lCategories.push(lTest.category);
		}

		lSortedTests.push(lTest);
	}

	// sorting ascending
	lCategories.sort();
	lSortedTests.sort(function (t1, t2) {
		if (t1.priority == t2.priority)
			return 0;
		if (t1.priority > t2.priority)
			return 1;

		return -1;
	});

	// returns index object
	return {
		categories: lCategories,
		tests: lSortedTests,
		getTestsByCategory: function (aCategory) {
			var lTests = [];
			if ("__ALL__" == aCategory)
				return this.tests;

			for (var lIndex in this.tests) {
				if (this.tests[lIndex].category == aCategory) {
					lTests.push(this.tests[lIndex]);
				}
			}

			return lTests;
		}
	};
}

function renderTests(aTests, aDiv, aCategory, aPlugInsInfo) {
	var lHtml = "", lServerPlugIn, lDependencyObj, lIdx, lDependsOn, lCurrentTest,
			lIsChecked, lIndex, lIsEnterprise;

	// Iterate through the tests to render them one by one
	for (lIndex in aTests) {
		if (aTests.hasOwnProperty(lIndex)) {
			lCurrentTest = aTests[lIndex];
			lIsChecked = lCurrentTest.checked === false ? "" : " checked ";
			if (lCurrentTest.id === "REST" && aCategory === "REST") {
				lIsChecked = " checked ";
			}
			lDependsOn = lCurrentTest.dependsOn;
			lIsEnterprise = lCurrentTest.isEnterprise;
			// Checking if the related plugin for the test is enabled in the server side
			if (lDependsOn && aPlugInsInfo) {
				// Iterate througn  the given plugins information and set 
				// the test enabled or not depending on the condition if 
				// the dependencies exist on the server or not
				for (lIdx = 0; lIdx < aPlugInsInfo.length; lIdx++) {
					lServerPlugIn = aPlugInsInfo[lIdx];
					for (lDependencyObj in lDependsOn) {
						if (lDependsOn.hasOwnProperty(lDependencyObj)) {
							lDependencyObj = lDependsOn[lDependencyObj];
							// if the given dependency is found in the server
							if (lDependencyObj.plugInId === lServerPlugIn.id ||
									(lDependencyObj.engineId &&
											lDependencyObj.engineId === lServerPlugIn.class)) {
								lDependencyObj.satisfied = true;
								// If the test belongs to enterprise or not
								if (lDependencyObj.isEnterprise) {
									// If the test requires an enterprise plugin to be loaded
									// and the plugin is not loaded, disable the test
									if (lServerPlugIn.name &&
											lServerPlugIn.name.indexOf("enterprise") < 0) {
										lDependencyObj.satisfied = false;
									}
								}
							}
						}
					}
				}
				lCurrentTest.hints = [];
				for (lDependencyObj in lDependsOn) {
					if (lDependsOn.hasOwnProperty(lDependencyObj)) {
						lDependencyObj = lDependsOn[lDependencyObj];
						if (!lDependencyObj.satisfied) {
							lCurrentTest.enabled = false;
							if (lDependencyObj.engineId) {
								lCurrentTest.objType = "Engine";
								lCurrentTest.objId = lDependencyObj.engineId;
								lCurrentTest.hints.push(lDependencyObj.engineId);
							} else {
								lCurrentTest.hints.push(lDependencyObj.plugInId +
										(lDependencyObj.isEnterprise ? " EE" : ""));
								lCurrentTest.objType = "PlugIn";
								lCurrentTest.objId = lDependencyObj.plugInId;
							}
						}
					}
				}
			}

			lHtml += "<div class='test-entry" + ((lCurrentTest.enabled) ? "" : " disabled") +
					(lIndex % 2 === 0 ? " striped" : "") +
					"'><span title='" + lCurrentTest.description + "'><label><input id='"
					+ lCurrentTest.id + "'"
					+ ((lCurrentTest.enabled) ? lIsChecked : " disabled")
					+ " type='checkbox'> " + lCurrentTest.title + "</label></span>" +
					((lCurrentTest.hints && lCurrentTest.hints.length > 0) ?
							"<div class='missing-dependency' objType='" +
							lCurrentTest.objType + "' " + " objId='" +
							lCurrentTest.objId + "' " +
							"title='" + lCurrentTest.objType +
							(lCurrentTest.hints.length > 1 ? "s " : " ") +
							"\"" + lCurrentTest.hints.join(", ") + "\" " +
							(lCurrentTest.hints.length > 1 ? "were " : "was") +
							" not loaded from the configuration file %JWEBSOCKET_HOME%conf/jWebSocket.xml'>" +
							lCurrentTest.objType + (lCurrentTest.hints.length > 1 ? "s " : " ") +
							"\"" + lCurrentTest.hints.join(", ") + "\" missing!" + "</div>" : "") + "</div>";
		}
	}
	aDiv.html(lHtml);
	$(".missing-dependency").click(function () {
		var lMsg = $(this).attr("title");
		lMsg += "<br/>For more information please visit the <b>" +
				($(this).attr("objType") === "Engine" ? "Engines" : "Plug-Ins and Filters") + "</b> section from: ";
		if ($(this).attr("objType") === "Engine" && $(this).attr("objId").indexOf("TomcatEngine") >= 0) {
			lMsg += "<a href='http://jwebsocket.org/documentation/User-Guide/embedding-jwebsocket-server-tomcat-web-applications' " +
					"target='_blank'>jWebSocket Tomcat Engine Configuration</a>";
		} else {
			lMsg += "<a href='http://jwebsocket.org/documentation/installation-guide/engines-and-servers' " +
					"target='_blank'>jWebSocket Server configuration page</a>";
		}
		jwsDialog(lMsg, "Missing " + $(this).attr("objType"), true, null, null, null, 400);

	});
}
