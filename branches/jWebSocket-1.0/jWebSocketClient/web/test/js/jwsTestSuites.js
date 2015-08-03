/* global jws */

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

TestSuite = {
	DEFAULT_CATEGORY: "UNCATEGORIZED",
	DEFAULT_PRIORITY: 100,
	DEFAULT_ENABLED: true,
	TT_GET_PLUGINS_INFO: "getPlugInsInfo",
	NS_SYSTEM: "org.jwebsocket.plugins.system",
	// Defining some global selectors to access the DOM
	SEL_CATEGORIES: "#categories",
	SEL_SELECT_ALL_CB: "#select-all-cb",
	SEL_SELECT_ALL_TEXT: ".select-all-text",
	SEL_TESTS: "#tests",
	SEL_TEST_SET: "#test_set",
	SEL_TSL_SET: "#tls_set",
	SEL_SPEED: "#speed",
	ENGINES_INFO: [],
	runFullTestSuite: function (aArgs) {
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

			var lTestSSL = $(TestSuite.SEL_TSL_SET).val() === 'wss';
			// open connections for admin and guest

			if ($(TestSuite.SEL_TEST_SET).val() !== "REST") {
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
			if ($(TestSuite.SEL_TEST_SET).val() !== "REST") {
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
	},
	initTestsIndex: function () {
		var lCategories = [];
		var lSortedTests = [];
		for (var lTestName in jws.tests) {
			var lTest = jws.tests[lTestName];
			// setting test unique identifier
			lTest.id = lTest.id || lTestName;
			// setting default values for convenience
			if (typeof lTest['category'] === "undefined")
				lTest['category'] = TestSuite.DEFAULT_CATEGORY;
			if (typeof lTest['priority'] === "undefined")
				lTest['priority'] = TestSuite.DEFAULT_PRIORITY;
			if (typeof lTest['enabled'] === "undefined")
				lTest['enabled'] = TestSuite.DEFAULT_ENABLED;
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
	},
	renderTests: function (aTests, aDiv, aCategory) {
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
				if (lDependsOn && TestSuite.ENGINES_INFO) {
					// Iterate througn  the given plugins information and set 
					// the test enabled or not depending on the condition if 
					// the dependencies exist on the server or not
					for (lIdx = 0; lIdx < TestSuite.ENGINES_INFO.length; lIdx++) {
						lServerPlugIn = TestSuite.ENGINES_INFO[lIdx];
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
	},
	init: function () {
		jws.console.setActive(true);
		jws.console.setLevel(jws.console.ERROR);
		var lCategories = $(TestSuite.SEL_CATEGORIES),
				lCategoriesSelectStr = "<select id='test_set'><option value='__ALL__'>All</option>";
		var lTests = TestSuite.initTestsIndex();
		$(TestSuite.SEL_SELECT_ALL_CB).change(function (aEvent, aValue) {
			var lIsChecked = $(this).attr("checked");
			$(TestSuite.SEL_TESTS).find("input[type=checkbox]:enabled").attr("checked", lIsChecked ? true : false);
			$(TestSuite.SEL_SELECT_ALL_TEXT).text(!lIsChecked ? "Select all" : "Select none");
		});
		$.each(lTests.categories, function (aIndex, aCategory) {
			lCategoriesSelectStr += "<option value='" + aCategory + "'>" + aCategory + "</option>";
		});
		lCategoriesSelectStr += "</select/>";
		lCategories.html(lCategoriesSelectStr);
		// rendering category tests
		var lCombo = $(TestSuite.SEL_TEST_SET);
		lCombo.bind('change', function (aSelect) {
			var lCategory = $(aSelect.target).val();
			TestSuite.renderTests(lTests.getTestsByCategory(lCategory), $(TestSuite.SEL_TESTS), lCategory);
		});
		this.getPlugInsInfo(lTests);
	},
	getPlugInsInfo: function (aTests) {
		var lCombo = $(TestSuite.SEL_TEST_SET);
		// This section will try to bring the possible modules that can be tested in the server
		jws.Tests.setAdminConn(new jws.jWebSocketJSONClient());
		var lWasOpen = false, lEngines = [];
		$("#demo_box").mask("Retrieving tests information from the server, please wait...");
		// open a separate control connection
		jws.Tests.getAdminConn().logon(jws.getDefaultServerURL(),
				jws.Tests.ADMIN_USER,
				jws.Tests.ADMIN_PWD, {
					OnToken: function (aToken) {
						lWasOpen = true;
						if (TestSuite.NS_SYSTEM === aToken.ns) {
							if ("welcome" === aToken.type) {
								lEngines = aToken.engines;
							}
							if ("login" === aToken.reqType) {
								// Successfully authenticated, proceed to get the tests
								jws.Tests.getAdminConn().sendToken({
									ns: TestSuite.NS_SYSTEM,
									type: TestSuite.TT_GET_PLUGINS_INFO
								}, {
									OnSuccess: function (aToken) {
										TestSuite.ENGINES_INFO = lEngines.concat(aToken.data);
										$("#demo_box").unmask();
										var lState = TestSuite.restorePageState();
										TestSuite.renderTests(aTests.getTestsByCategory(
												lCombo.val()), $(TestSuite.SEL_TESTS), lCombo.val());
										if (null !== lState) {
											TestSuite.selectTests(lState.selectedTests);
										}
									},
									OnFailure: function (aToken) {
										$("#demo_box").unmask();
										// Notify the user we could not load the 
										// plug-ins info from the server
										wsDialog("Failed to load tests from the " +
												"server, this may lead to test failures.<br/>" +
												"The server returned the following message: <br/>" +
												aToken.msg, "Failure loading tests from the server",
												true, "alert", null, null, 400);
									}
								});
							}
						}
					},
					OnClose: function () {
						$("#demo_box").unmask();
						if (!lWasOpen) {
							jwsDialog("Please check your connection with the server, it " +
									"may not be running properly. jWebSocket Tests Executor " +
									"could not load the tests information from the server, " +
									"this may lead to test failures.",
									"Failure loading tests from the server",
									true, "alert", null, null, 400);
						}
					}
				});
	},
	run: function () {
		if (!jws.browserSupportsWebSockets()) {
			var lMsg = jws.MSG_WS_NOT_SUPPORTED;
			jwsDialog(lMsg, "jWebSocket Message", true, "alert");
		} else {
			// creating a new jasmine evironment to refresh from previous execution
			jasmine.currentEnv_ = new jasmine.Env();
			// removing previous jasmine report logs if exists
			$('.jasmine_reporter').remove();
			var lSelectedTests = TestSuite.getSelectedTests();
			TestSuite.runFullTestSuite({
				speed: $(TestSuite.SEL_SPEED).val(),
				tests: lSelectedTests
			});
			jws.TestPlugIn.execTests();
		}
	},
	getSelectedTests: function () {
		var lCheckboxes = $(TestSuite.SEL_TESTS).find('input[type=checkbox]');
		var lSelectedTests = [];
		$.each(lCheckboxes, function (aIndex, aItem) {
			if ($(aItem).prop('checked'))
				lSelectedTests.push($(aItem).prop('id'));
		});
		return lSelectedTests;
	},
	selectTests: function (aTests) {
		var lCheckboxes = $(TestSuite.SEL_TESTS).find('input[type=checkbox]');
		$.each(lCheckboxes, function (aIndex, aItem) {
			if (aTests.indexOf($(aItem).attr('id')) === -1) {
				$(aItem).attr('checked', false);
			} else {
				$(aItem).attr('checked', true);
			}
		});
	},
	storePageState: function () {
		var lPageState = {
			speed: $(TestSuite.SEL_SPEED).val(),
			tls: $(TestSuite.SEL_TSL_SET).val(),
			category: $(TestSuite.SEL_TEST_SET).val(),
			selectedTests: TestSuite.getSelectedTests(),
			selectAll: $(TestSuite.SEL_SELECT_ALL_CB).attr("checked")
		};
		sessionStorage.setItem("page_state", JSON.stringify(lPageState));
	},
	restorePageState: function () {
		var lJSON = sessionStorage.getItem("page_state");
		if (null != lJSON) {
			var lPageState = JSON.parse(lJSON);
			$(TestSuite.SEL_SPEED).val(lPageState.speed);
			$(TestSuite.SEL_TSL_SET).val(lPageState.tls);
			$(TestSuite.SEL_TEST_SET).val(lPageState.category);
			$(TestSuite.SEL_SELECT_ALL_CB).attr("checked", lPageState.selectAll);
			return lPageState;
		} else {
			if ($("[value='Enterprise Edition']").get(0)) {
				$(TestSuite.SEL_TEST_SET).val('Enterprise Edition');
			} else {
				$(TestSuite.SEL_TEST_SET).val('__ALL__');
			}
			return null;
		}
	}
};