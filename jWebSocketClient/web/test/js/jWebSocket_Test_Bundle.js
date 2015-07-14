//	---------------------------------------------------------------------------
//	jWebSocket Automated API test specs (Community Edition, CE)
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
if (typeof jws.tests === "undefined") {
	jws.tests = {};
}

jws.tests.AutomatedAPI = {
	title: "Automated API plug-in",
	description: "jWebSocket AutomatedAPI plug-in. Designed server side plug-in's API exporting.",
	category: "System",
	enabled: false,
	mSpecs: [],
	testGetAPIDefaults: function () {

		var lSpec = "running default API spec";

		it(lSpec, function () {

			var lDone = false;

			// start stop watch for this spec
			jws.StopWatchPlugIn.startWatch("defAPIspec", lSpec);

			// we need to "control" the server to broadcast to all connections here
			var lConn = new jws.jWebSocketJSONClient();

			// open a separate control connection
			lConn.open(jws.getDefaultServerURL(), {
				OnWelcome: function () {
					var lAPIPlugIn = new jws.APIPlugIn();
					lConn.addPlugIn(lAPIPlugIn);
					// request the API of the benchmark plug-in
					lAPIPlugIn.getPlugInAPI(
							"jws.benchmark", {
								// if API received successfully run the tests...
								OnResponse: function (aServerPlugIn) {
									jws.tests.AutomatedAPI.mSpecs =
											lAPIPlugIn.createSpecFromAPI(lConn, aServerPlugIn);
									lConn.close();
									lDone = true;
								},
								OnTimeout: function () {
									lConn.close();
									lDone = true;
								}
							});
				}
			});

			waitsFor(
					function () {
						return lDone == true;
					},
					"Running against API...",
					3000
					);

			runs(function () {
				expect(lDone).toEqual(true);

				// stop watch for this spec
				jws.StopWatchPlugIn.stopWatch("defAPIspec");
			});
		});
	},
	testRunAPIDefaults: function () {
		it("running default tests", function () {
			eval(
					"  for( var i = 0; i < jws.tests.AutomatedAPI.mSpecs.length; i++ ) { "
					+ "  jws.tests.AutomatedAPI.mSpecs[ i ]();"
					+ "}"
					);
		});
	},
	runSpecs: function () {
		// get the default specs from the API
		this.testGetAPIDefaults();
		// run all the obtained default specs
		// this.testRunAPIDefaults();
	}
};
//	---------------------------------------------------------------------------
//	jWebSocket Benchmark test specs (Community Edition, CE)
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
if (typeof jws.tests === "undefined") {
	jws.tests = {};
}
jws.tests.Benchmarks = {
	/*  TODO: Finish this TestCase
	 *	this.NS: jws.NS_BASE  + ".plugins.benchmark",
	 *
	 *
		var this.MAX_CONNECTIONS = 50;
		var this.MAX_BROADCASTS = 100;
		var this.OPEN_CONNECTIONS_TIMEOUT = 30000;w
		var BROADCAST_TIMEOUT = 30000;
		var this.CLOSE_CONNECTIONS_TIMEOUT = 30000;
		var this.BROADCAST_MESSAGE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghihjklmnopqrstuvwxyz 0123456789";

		var this.ROOT_USER = "root";

		var this.lConnectionsOpened = 0;
		var this.lConnections = [];
		var this.lPacketsReceived = 0;
	 */

	NS: jws.NS_BASE  + ".plugins.benchmark",
	title: "Benchmark plug-in",
	description: "jWebSocket Benchmark plug-in.",
	category: "Server Benchmarks",
	enabled: false,
	dependsOn: [{
		plugInId: "jws.benchmark"
	}],
	
	MAX_CONNECTIONS: 50,
	
	MAX_BROADCASTS: 100,
	
	BROADCAST_TIMEOUT: 3000,
	
	OPEN_CONNECTIONS_TIMEOUT: 30000,
	
	CLOSE_CONNECTIONS_TIMEOUT: 30000,
	
	BROADCAST_MESSAGE: "ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghihjklmnopqrstuvwxyz 0123456789",
	
	ROOT_USER: "root",
	
	lConnectionsOpened: 0,
	
	lConnections: [],
	
	lPacketsReceived: 0,
	
	lSpecs: [],
	
	// this spec opens all connections
	testOpenConnections: function() {
		var lSpec = "Opening " + this.MAX_CONNECTIONS + " connections";
		it( lSpec, function () {

			// reset all watches
			jws.StopWatchPlugIn.resetWatches();

			// start stop watch for this spec
			jws.StopWatchPlugIn.startWatch( "openConn", lSpec );

			for( var lIdx = 0; lIdx < this.MAX_CONNECTIONS; lIdx++ ) {

				this.lConnections[ lIdx ] = new jws.jWebSocketJSONClient();
				this.lConnections[ lIdx ].open( jws.getDefaultServerURL(), {

					OnOpen: function () {
						this.lConnectionsOpened++;
					},

					OnClose: function () {
						this.lConnectionsOpened--;
					},

					OnToken: function( aToken ) {
						if ( "s2c_performance" == aToken.type
							&& this.NS == aToken.ns ) {
							this.lPacketsReceived++;
						}
					}

				});
			}

			// wait for expected connections being opened
			waitsFor(
				function() {
					return this.lConnectionsOpened == this.MAX_CONNECTIONS;
				},
				"opening connection...",
				this.OPEN_CONNECTIONS_TIMEOUT
				);

			runs(
				function () {
					expect( this.lConnectionsOpened ).toEqual( this.MAX_CONNECTIONS );
					// stop watch for this spec
					jws.StopWatchPlugIn.stopWatch( "openConn" );
				}
				);
		});
	},


	// this spec closes all connections
	testCloseConnections: function() {
		var lSpec = "Closing " + this.MAX_CONNECTIONS + " connections";
		it( lSpec, function () {

			// start stop watch for this spec
			jws.StopWatchPlugIn.startWatch( "closeConn", lSpec );

			for( var lIdx = 0; lIdx < this.MAX_CONNECTIONS; lIdx++ ) {
				this.lConnections[ lIdx ].close({
					timeout: 3000,
					// fireClose: true,
					// noGoodBye: true,
					noLogoutBroadcast: true,
					noDisconnectBroadcast: true
				});
			}

			// wait for expected connections being opened
			waitsFor(
				function() {
					return this.lConnectionsOpened == 0;
				},
				"closing connections...",
				this.CLOSE_CONNECTIONS_TIMEOUT
				);

			runs(
				function () {
					expect( this.lConnectionsOpened ).toEqual( 0 );

					// stop watch for this spec
					jws.StopWatchPlugIn.stopWatch( "closeConn" );

					// print all watches to the console
					jws.StopWatchPlugIn.printWatches();

					// reset all watches
					jws.StopWatchPlugIn.resetWatches();
				}
				);
		});
	},

	testBenchmark: function() {
		var lSpec = "Broadcasting " + this.MAX_BROADCASTS + " packets to " + this.MAX_CONNECTIONS + " connections";
		it( lSpec, function () {

			// start stop watch for this spec
			jws.StopWatchPlugIn.startWatch( "broadcast", lSpec );

			// we need to "control" the server to broadcast to all connections here
			var lConn = new jws.jWebSocketJSONClient();

			// open a separate control connection
			lConn.open(jws.getDefaultServerURL(), {

				OnOpen: function () {
					this.lPacketsReceived = 0;
					var lToken = {
						ns: this.NS,
						type: "s2c_performance",
						count: this.MAX_BROADCASTS,
						message: this.BROADCAST_MESSAGE
					};
					lConn.sendToken( lToken );
				}
			});

			waitsFor(
				function() {
					return this.lPacketsReceived == this.MAX_CONNECTIONS * this.MAX_BROADCASTS;
				},
				"broadcasting test packages...",
				this.BROADCAST_TIMEOUT
				);

			runs( function() {
				expect( this.lPacketsReceived ).toEqual( this.MAX_CONNECTIONS * this.MAX_BROADCASTS );

				// stop watch for this spec
				jws.StopWatchPlugIn.stopWatch( "broadcast" );
			});
		});
	},


	runSpecs: function() {
		// open all connections
		this.testOpenConnections();

		// run the benchmark
		this.testBenchmark();

		// close all connections
		this.testCloseConnections();
	}
};
//	---------------------------------------------------------------------------
//	jWebSocket Channel test specs (Community Edition, CE)
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
if (typeof jws.tests === "undefined") {
	jws.tests = {};
}
jws.tests.Channels = {
	title: "Channel plug-in",
	description: "jWebSocket channel plug-in. Designed for server centric communications channels.",
	category: "Community Edition",
	TEST_MESSAGE: "this is a test message",
	dependsOn: [{
			plugInId: "jws.channels"
		}],
	// this spec tests the subscribe method of the Channels plug-in
	testSubscribe: function (aChannelName, aAccessKey) {
		var lSpec = "subscribe (" + aChannelName + ")";

		it(lSpec, function () {
			var lResponse = {};
			jws.Tests.getAdminTestConn().channelSubscribe(
					aChannelName,
					aAccessKey,
					{
						OnResponse: function (aToken) {
							lResponse = aToken;
						}
					}
			);

			waitsFor(
					function () {
						return(lResponse.code == 0);
					},
					lSpec,
					1000
					);

			runs(function () {
				expect(lResponse.code).toEqual(0);
			});
		});
	},
	// this spec tests the unsubscribe method of the Channels plug-in
	testUnsubscribe: function (aChannelName) {
		var lSpec = "unsubscribe (" + aChannelName + ")";

		it(lSpec, function () {
			var lResponse = {};
			jws.Tests.getAdminTestConn().channelUnsubscribe(
					aChannelName,
					{
						OnResponse: function (aToken) {
							lResponse = aToken;
						}
					}
			);

			waitsFor(
					function () {
						return(lResponse.code == 0);
					},
					lSpec,
					1000
					);

			runs(function () {
				expect(lResponse.code).toEqual(0);
			});

		});
	},
	// this spec tests the create method for a new channel
	testChannelCreate: function (aChannelId, aChannelName, aAccessKey, aSecretKey,
			aIsPrivate, aIsSystem, aComment, aExpectedReturnCode) {
		var lSpec = "channelCreate (id: " + aChannelId + ", name: " + aChannelName + ", " + aComment + ")";

		it(lSpec, function () {

			var lResponse = {};
			jws.Tests.getAdminTestConn().channelCreate(
					aChannelId,
					aChannelName,
					{
						isPrivate: aIsPrivate,
						isSystem: aIsSystem,
						accessKey: aAccessKey,
						secretKey: aSecretKey,
						OnResponse: function (aToken) {
							lResponse = aToken;
						}
					}
			);

			waitsFor(
					function () {
						return(lResponse.code !== undefined);
					},
					lSpec,
					1000
					);

			runs(function () {
				expect(lResponse.code).toEqual(aExpectedReturnCode);
			});

		});
	},
	// this spec tests the modify method for an existing channel
	testChannelModify: function (aChannelId, aSecretKey,
			aOptions, aComment, aExpectedReturnCode) {
		var lSpec = "channelModify (id: " + aChannelId + ", name: " + aChannelId + ", " + aComment + ")";

		it(lSpec, function () {

			var lResponse = {};
			aOptions.OnResponse = function (aToken) {
				lResponse = aToken;
			};
			jws.Tests.getAdminTestConn().channelModify(
					aChannelId,
					aSecretKey,
					aOptions
					);

			waitsFor(
					function () {
						return(lResponse.code !== undefined);
					},
					lSpec,
					2000
					);

			runs(function () {
				expect(lResponse.code).toEqual(aExpectedReturnCode);
			});

		});
	},
	// this spec tests the create method for a new channel
	testChannelAuth: function (aChannelId, aAccessKey, aSecretKey,
			aComment, aExpectedReturnCode) {
		var lSpec = "channelAuth (id: " + aChannelId + ", " + aComment + ")";

		it(lSpec, function () {

			var lResponse = {};
			jws.Tests.getAdminTestConn().channelAuth(
					aChannelId,
					aAccessKey,
					aSecretKey,
					{
						OnResponse: function (aToken) {
							lResponse = aToken;
						}
					}
			);

			waitsFor(
					function () {
						return(lResponse.code !== undefined);
					},
					lSpec,
					1000
					);

			runs(function () {
				expect(lResponse.code).toEqual(aExpectedReturnCode);
			});

		});
	},
	// this spec tests the create method for a new channel
	testChannelPublish: function (aChannelId, aData,
			aComment, aExpectedReturnCode) {
		var lSpec = "channelPublish (id: " + aChannelId + ", data: " + aData + ", " + aComment + ")";

		it(lSpec, function () {

			var lResponse = null;
			var lEvent = null;

			if (0 == aExpectedReturnCode) {
				jws.Tests.getAdminTestConn().setChannelCallbacks({
					OnChannelBroadcast: function (aEvent) {
						lEvent = aEvent;
					}
				});
			} else {
				lEvent = true;
			}
			jws.Tests.getAdminTestConn().channelPublish(
					aChannelId,
					aData,
					null,
					{
						OnResponse: function (aToken) {
							lResponse = aToken;
						}
					}
			);

			waitsFor(
					function () {
						return(lResponse != null && lEvent != null);
					},
					lSpec,
					3000
					);

			runs(function () {
				expect(lResponse.code).toEqual(aExpectedReturnCode);
				if (0 == aExpectedReturnCode) {
					expect(lEvent.data).toEqual(aData);
				}
			});

		});
	},
	// this spec tests the create method for a new channel
	testChannelSubscriptions: function (aComment, aExpectedIDs, aExpectedCount) {
		var lSpec = "channelSubscriptions (" + aComment + ")";

		it(lSpec, function () {

			var lResponse = {};
			jws.Tests.getAdminTestConn().channelGetSubscriptions(
					{
						OnResponse: function (aToken) {
							lResponse = aToken;
						}
					}
			);

			waitsFor(
					function () {
						return(lResponse.code !== undefined);
					},
					lSpec,
					1000
					);

			runs(function () {
				var lChannels = lResponse.channels;
				var lToBeFound = aExpectedCount;
				if (lChannels) {
					for (var lIdx = 0, lCnt = lChannels.length; lIdx < lCnt; lIdx++) {
						var lChannel = lChannels[ lIdx ];
						var lFound = aExpectedIDs[ lChannel.id ];
						if (lFound
								&& lFound.isPrivate === lChannel.isPrivate
								&& lFound.isSystem === lChannel.isSystem
								) {
							lToBeFound--;
						}
					}
				} else {
					lChannels = [];
				}
				expect(lResponse.code).toEqual(0);
				expect(lToBeFound).toEqual(0);
				expect(lChannels.length).toEqual(aExpectedCount);
			});

		});
	},
	// this spec tests to obtain the ids of the 
	testChannelGetIds: function (aComment, aExpectedIDs, aExpectedCount) {
		var lSpec = "channelGetIds (" + aComment + ")";

		it(lSpec, function () {

			var lResponse = {};
			jws.Tests.getAdminTestConn().channelGetIds(
					{
						OnResponse: function (aToken) {
							lResponse = aToken;
						}
					}
			);

			waitsFor(
					function () {
						return(lResponse.code !== undefined);
					},
					lSpec,
					1000
					);

			runs(function () {
				var lChannels = lResponse.channels;
				var lToBeFound = aExpectedCount;
				if (lChannels) {
					for (var lIdx = 0, lCnt = lChannels.length; lIdx < lCnt; lIdx++) {
						var lChannel = lChannels[ lIdx ];
						var lFound = aExpectedIDs[ lChannel.id ];
						if (lFound
								&& lFound.isPrivate === lChannel.isPrivate
								&& lFound.isSystem === lChannel.isSystem
								) {
							lToBeFound--;
						}
					}
				} else {
					lChannels = [];
				}
				expect(lResponse.code).toEqual(0);
				expect(lToBeFound).toEqual(0);
				expect(0).toEqual(lToBeFound);
			});

		});
	},
	// this spec tests the create method for a new channel
	testChannelComplexTest: function (aComment) {
		var lSpec = "complex test (" + aComment + ")";

		it(lSpec, function () {

			var lPubCnt = 3, lPubIdx;
			var lSubCnt = 9, lSubIdx;
			var lPubsCreated = 0, lSubsCreated = 0;

			var lPubs = [];
			var lSubs = [];
			var lPub, lSub;

			var lChannelId = 0;
			var lChId;
			var lPacketsReceived = 0;

			var lCreateSubs = function () {
				// now create the given number of subscribers
				for (lSubIdx = 0; lSubIdx < lSubCnt; lSubIdx++) {
					lSub = new jws.jWebSocketJSONClient();
					// use parameter to easily access channel id in listener
					lSub.setParamNS(jws.tests.Channels.NS, "listenOn", "ch_" + ((lSubIdx % lPubCnt) + 1));
					lSubs[ lSubIdx ] = {
						client: lSub,
						status: jws.tests.Channels.INIT
					};
					lSub.logon(jws.getDefaultServerURL(), jws.Tests.ADMIN_USER, jws.Tests.ADMIN_PWD, {
						OnToken: function (aToken) {
							// jws.console.log( "Subscriber Token: " + JSON.stringify( aToken ) );
							// once logged in subscribe each client to a certain publisher
							if ("org.jwebsocket.plugins.system" == aToken.ns
									&& "login" == aToken.reqType) {
								// use parameter to access channel id to subscribe to
								lChId = this.getParamNS(jws.tests.Channels.NS, "listenOn");
								jws.console.log("Subscribing at channel " + lChId + "...");
								this.channelSubscribe(
										lChId,
										"testAccessKey"
										);
								// once all subscribers are allocated the publishers can fire		
							} else if (jws.ChannelPlugIn.NS == aToken.ns
									&& "subscribe" == aToken.reqType
									// && 0 == aToken.code
									) {
								lSubsCreated++;

								jws.console.log("Subscription at channel " + aToken.channelId + ": " + aToken.code + " " + aToken.msg);

								if (lSubsCreated == lSubCnt) {
									// now we can start the publish and receive test
									for (lPubIdx = 0; lPubIdx < lPubCnt; lPubIdx++) {
										lPub = lPubs[ lPubIdx ].client;
										lChId = "ch_" + (lPubIdx + 1);
										jws.console.log("Publishing at channel " + lChId + "...");
										lPub.channelPublish(lChId, "Test", null, {
											OnResponse: function (aToken) {
												jws.console.log("Publish Response: " + JSON.stringify(aToken));
											}
										});
									}
								}
							} else if (jws.ChannelPlugIn.NS == aToken.ns
									&& "data" == aToken.type) {
								jws.console.log("Received data from"
										+ " channel " + aToken.channelId
										+ ", publisher: " + aToken.publisher
										+ ": '" + aToken.data + "'.");
								lPacketsReceived++;
							}

						}
					});
				}
			}

			var lCreatePubs = function () {
				// first create the given number of publishers
				for (lPubIdx = 0; lPubIdx < lPubCnt; lPubIdx++) {
					lPub = new jws.jWebSocketJSONClient();
					lPubs[ lPubIdx ] = {
						client: lPub,
						status: jws.tests.Channels.INIT
					};

					lPub.logon(jws.getDefaultServerURL(), jws.Tests.ADMIN_USER, jws.Tests.ADMIN_PWD, {
						OnToken: function (aToken) {
							// once logged in the channel can be created
							if ("org.jwebsocket.plugins.system" == aToken.ns
									&& "login" == aToken.reqType) {
								lChannelId++;
								var lChId = "ch_" + lChannelId;
								jws.console.log("Creating channel " + lChId + "...");
								this.channelCreate(
										"ch_" + lChannelId,
										"channel_" + lChannelId,
										{
											isPrivate: false,
											isSystem: false,
											accessKey: "testAccessKey",
											secretKey: "testSecretKey"
										}
								);
								// once channel is created authenticate for publishing
							} else if (jws.ChannelPlugIn.NS == aToken.ns
									&& "createChannel" == aToken.reqType) {
								lPubsCreated++;
								jws.console.log("Channel " + aToken.channelId + " created.");
								this.channelAuth(
										aToken.channelId,
										"testAccessKey",
										"testSecretKey",
										{
											OnResponse: function (aToken) {
												jws.console.log("Channel " + aToken.channelId + " authenticated.");
												if (lPubsCreated == lPubCnt) {
													// lCreateSubs();
												}
											}
										}
								);
								// once channel is removed close connection
							} else if (jws.ChannelPlugIn.NS == aToken.ns
									&& "removeChannel" == aToken.reqType) {
								// once channel is removed the connection can be closed
								jws.console.log("Channel " + aToken.channelId + " removed.");
								if (aToken.channelId.substr(0, 3) == "ch_") {
									this.close({
										timeout: 1000
									});
								}
							}
						}
					});
				}
			}

			// create all publishers
			lCreatePubs();
			// give server a bit to start all channels
			// TODO: improve! this should be done by events! not by hardcoded timeout!
			setTimeout(lCreateSubs, 500);

			waitsFor(
					function () {
						return(
								lPubsCreated == lPubCnt
								&& lPacketsReceived == lSubCnt
								);
					},
					lSpec,
					3000
					);

			runs(function () {
				var lClient;
				// remove created channels and close opened connections
				for (var lPubIdx = 0; lPubIdx < lPubCnt; lPubIdx++) {
					lClient = lPubs[ lPubIdx ].client;
					lChId = "ch_" + (lPubIdx + 1);
					jws.console.log("Removing channel " + lChId + "...");
					lClient.channelRemove(
							lChId,
							{
								accessKey: "testAccessKey",
								secretKey: "testSecretKey",
								OnResponse: function (aToken) {
									// lResponse = aToken;
								}
							}
					);
				}

				expect(lPubsCreated).toEqual(lPubCnt);

				for (var lSubIdx = 0; lSubIdx < lSubCnt; lSubIdx++) {
					var lChId = "ch_" + (lSubIdx + 1);
					jws.console.log("Closing subscriber ch_" + lChId + "...");
					lSubs[ lSubIdx ].client.close({
						timeout: 1000
					});
				}
				for (var lPubIdx = 0; lPubIdx < lPubCnt; lPubIdx++) {
					var lChId = "ch_" + (lPubIdx + 1);
					jws.console.log("Closing publisher ch_" + lChId + "...");
					lPubs[ lPubIdx ].client.close({
						timeout: 1000
					});
				}
			});

			waitsFor(function () {
				for (var lSubIdx = 0; lSubIdx < lSubCnt; lSubIdx++) {
					if (lSubs[ lSubIdx ].client.isConnected()) {
						return false;
					}
				}
				for (var lPubIdx = 0; lPubIdx < lPubCnt; lPubIdx++) {
					if (lPubs[ lPubIdx ].client.isConnected())
						return false;
				}

				return true;
			}, 'closing channels connections',
					5000);
		});
	},
	// this spec tests the create method for a new channel
	testChannelRemove: function (aChannelId, aSecretKey,
			aComment, aExpectedReturnCode) {
		var lSpec = "channelRemove (id: " + aChannelId + ", " + aComment + ")";

		it(lSpec, function () {

			var lResponse = {};
			jws.Tests.getAdminTestConn().channelRemove(
					aChannelId,
					{
						secretKey: aSecretKey,
						OnResponse: function (aToken) {
							lResponse = aToken;
						}
					}
			);

			waitsFor(
					function () {
						return(lResponse.code !== undefined);
					},
					lSpec,
					1000
					);

			runs(function () {
				expect(lResponse.code).toEqual(aExpectedReturnCode);
				if (lResponse.code !== undefined
						&& lResponse.code != aExpectedReturnCode) {
					jasmine.log("Error: " + lResponse.msg);
				}
			});

		});
	},
	runSpecs: function () {

		// testing subscribing to existing, pre-defined channels
		jws.tests.Channels.testSubscribe("systemA", "access");
		// Retreiving subscriptions of current client
		jws.tests.Channels.testChannelSubscriptions(
				"Retreiving subscriptions of current client (should return 1).",
				{
					"systemA": {
						isPrivate: false,
						isSystem: true
					}
				}, 1);

		// testing unsubscribing from existing, pre-defined channels
		jws.tests.Channels.testUnsubscribe("systemA", "access");
		// Retreiving subscriptions of current client
		jws.tests.Channels.testChannelSubscriptions("Retreiving subscriptions of current client (should return 0).",
				{}, 0);
		// creating new public channels
		jws.tests.Channels.testChannelCreate("myPubSec", "123", "123", "123", false, false,
				"Creating public channel with correct credentials (allowed)", 0);
		jws.tests.Channels.testChannelModify("myPubSec", "123", {
			name: "myPublicSecure",
			newSecretKey: "myPublicSecret",
			accessKey: "myPublicAccess",
			isPrivate: false,
			isSystem: false
		}, "Modifying public channel(allowed)", 0);
		jws.tests.Channels.testChannelCreate("myPubSec", "myPublicSecure", "myPublicAccess", "myPublicSecret", false, false,
				"Creating public channel that already exists (invalid)", -1);
		jws.tests.Channels.testChannelCreate("myPubUnsec", "myPublicUnsecure", "", "", false, false,
				"Creating public channel w/o access key and secret key (allowed)", 0);

		// creating new private channels
		jws.tests.Channels.testChannelCreate("myPrivSec", "myPrivateSecure", "myPrivateAccess", "myPrivateSecret", true, false,
				"Creating private channel with access key and secret key (allowed)", 0);
		jws.tests.Channels.testChannelCreate("myPrivUnsec", "myUnsecurePrivateChannel", null, null, true, false,
				"Creating private channel w/o access key and secret key (not allowed)", -1);

		// channel authentication prior to publishing
		jws.tests.Channels.testChannelAuth("myInvalid", "myPublicAccess", "myPublicSecret",
				"Authenticating against invalid channel with access key and secret key (not allowed)", -1);
		jws.tests.Channels.testChannelAuth("myPubSec", "", "",
				"Authenticating against public channel w/o access key and secret key (not allowed)", -1);
		jws.tests.Channels.testChannelPublish("myPubSec", jws.tests.Channels.TEST_MESSAGE,
				"Publishing test message on a non-authenticated channel (not allowed)", -1);
		jws.tests.Channels.testChannelAuth("myPubSec", "myPublicAccess", "myPublicSecret",
				"Authenticating against public channel access key and secret key (allowed)", 0);
		jws.tests.Channels.testSubscribe("myPubSec", "myPublicAccess");
		jws.tests.Channels.testChannelPublish("myPubSec", jws.tests.Channels.TEST_MESSAGE,
				"Publishing test message on authenticated channel (allowed)", 0);


		// obtaining public channels
		jws.tests.Channels.testChannelGetIds(
				"Retreiving IDs of available public channels",
				{
					"myPubSec": {
						isPrivate: false,
						isSystem: false
					},
					"myPubUnsec": {
						isPrivate: false,
						isSystem: false
					},
					"systemA": {
						isPrivate: false,
						isSystem: true
					},
					"systemB": {
						isPrivate: false,
						isSystem: true
					},
					"publicA": {
						isPrivate: false,
						isSystem: false
					},
					"publicB": {
						isPrivate: false,
						isSystem: false
					}
				}, 6
				);

		// run complex publish and subscribe test
		//jws.tests.Channels.testChannelComplexTest(
		//	"Multiple publishers distributing messages to multiple subscribers.", 0 );

		// removing public channels
		jws.tests.Channels.testChannelRemove("myPubSec", "myInvalidSecret",
				"Removing secure public channel with incorrect credentials (not allowed)", -1);
		jws.tests.Channels.testChannelRemove("myPubSec", "myPublicSecret",
				"Removing secure public channel with correct credentials (allowed)", 0);
		jws.tests.Channels.testChannelRemove("myPubUnsec", "",
				"Removing unsecure public channel w/o credentials (allowed)", 0);

		// removing private channels
		jws.tests.Channels.testChannelRemove("myPrivSec", "myInvalidSecret",
				"Removing private channel with invalid credentials (invalid)", -1);
		jws.tests.Channels.testChannelRemove("myPrivSec", "myPrivateSecret",
				"Removing private channel with correct credentials (allowed)", 0);
		jws.tests.Channels.testChannelRemove("myPrivSec", "myPrivateSecret",
				"Removing private channel that should alredy have been removed (invalid)", -1);
		jws.tests.Channels.testChannelRemove("myPrivUnsec", "",
				"Removing channel that should never have existed (invalid)", -1);

	}
};

//	---------------------------------------------------------------------------
//	jWebSocket Filesystem Plug-in CE test specs (Community Edition, CE)
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

if (typeof jws.tests === "undefined") {
	jws.tests = {};
}
jws.tests.FileSystem = {
	title: "FileSystem plug-in",
	description: "jWebSocket filesystem plug-in. Designed for files management on the server.",
	category: "Community Edition",
	TEST_FILE_DATA: "This is a string to be saved into the test file!",
	TEST_FOLDER: "privFolder",
	TEST_FILE_NAME: "test.txt",
	TEST_BIG_FILE_NAME: "base64BigFile.txt",
	TEST_BIG_FILE_DATA: "This example is based on the File System PlugIn which allows to submit and receive from the server base64 encoded files.",
	dependsOn: [{
			plugInId: "jws.filesystem"
		}],
	testFileSave: function (aFilename, aData, aScope) {
		var lSpec = "FileSave (admin, " + aFilename + ", " + aScope + ")";
		var lData = aData;
		var lFilename = aFilename;

		it(lSpec, function () {

			var lResponse = null;

			jws.Tests.getAdminTestConn().fileSave(lFilename, lData, {
				encode: true,
				encoding: 'zipBase64',
				scope: aScope,
				OnResponse: function (aToken) {
					lResponse = aToken;
				}
			});

			waitsFor(
					function () {
						return(null !== lResponse);
					},
					lSpec,
					3000
					);

			runs(function () {
				expect(lResponse.code).toEqual(0);
			});

		});
	},
	testFileSend: function (aFilename, aData) {
		var lSpec = "FileSend (admin, " + aFilename + ")";

		it(lSpec, function () {

			var lResponse = null;
			jws.Tests.getAdminTestConn().setFileSystemCallbacks({
				OnFileReceived: function (aToken) {
					lResponse = aToken;
				}
			});
			jws.Tests.getAdminTestConn().fileSend(jws.Tests.getAdminTestConn().getId(), aFilename, aData, {
				encoding: "base64"
			});

			waitsFor(
					function () {
						return(null !== lResponse);
					},
					lSpec,
					3000
					);

			runs(function () {
				expect(lResponse.filename).toEqual(aFilename);
				expect(lResponse.data).toEqual(aData);
			});

		});
	},
	testGetFilelist: function (aAlias, aFilemasks, aRecursive, aExpectedList) {
		var lSpec = "GetFilelist (admin, " + aAlias + ", " +
				JSON.stringify(aFilemasks) + ", " + aRecursive + ")";

		it(lSpec, function () {

			var lResponse = null;

			jws.Tests.getAdminTestConn().fileGetFilelist(aAlias, aFilemasks, {
				recursive: aRecursive,
				OnResponse: function (aToken) {
					lResponse = aToken;
				}
			});

			waitsFor(
					function () {
						return(null !== lResponse);
					},
					lSpec,
					3000
					);

			runs(function () {
				expect(lResponse.code).toEqual(0);

				var lObtainedKeys = [];
				lResponse.files.forEach(function (aItem) {
					lObtainedKeys.push(aItem.filename);
				});

				expect(lObtainedKeys.sort().join(",")).toContain(aExpectedList.sort().join(","));
			});

		});
	},
	testFileLoad: function (aFilename, aAlias, aExpectedData) {
		var lSpec = "FileLoad (admin, " + aFilename + ", " + aAlias + ")";
		var lData = aExpectedData;
		var lFilename = aFilename;

		it(lSpec, function () {

			var lResponse = null;

			jws.Tests.getAdminTestConn().fileLoad(lFilename, aAlias, {
				decode: true,
				encoding: 'zipBase64',
				OnResponse: function (aToken) {
					lResponse = aToken;
				}
			});

			waitsFor(
					function () {
						return(null !== lResponse);
					},
					lSpec,
					3000
					);

			runs(function () {
				expect(lResponse.data).toEqual(lData);
			});

		});
	},
	testBigFileLoad: function (aFilename, aAlias, aExpectedData, aIterations) {
		var lSpec = "Base64 big File Load (admin, " + aFilename + ", " + aAlias + ")";
		var lData = aExpectedData;
		var lFilename = aFilename;

		it(lSpec, function () {

			var lResponse = null;

			jws.Tests.getAdminTestConn().fileLoad(lFilename, aAlias, {
				decode: true,
				encoding: 'zipBase64',
				OnResponse: function (aToken) {
					lResponse = aToken;
				}
			});

			waitsFor(
					function () {
						return(null !== lResponse);
					},
					lSpec,
					3000
					);

			runs(function () {
				expect(jws.tests.FileSystem.decodeBigFileData(lData, lResponse.data, aIterations)).toEqual(lData);
			});

		});
	},
	testFileDelete: function (aFilename, aForce, aExpectedCode) {
		var lSpec = "FileDelete (admin, " + aFilename + ", " + aExpectedCode + ")";

		it(lSpec, function () {

			var lResponse = null;

			jws.Tests.getAdminTestConn().fileDelete(aFilename, aForce, {
				OnResponse: function (aToken) {
					lResponse = aToken;
				}
			});

			waitsFor(
					function () {
						return(null !== lResponse);
					},
					lSpec,
					3000
					);

			runs(function () {
				expect(lResponse.code).toEqual(aExpectedCode);
			});

		});
	},
	testFileExists: function (aAlias, aFilename, aExpectedValue) {
		var lSpec = "FileExists (admin, " + aAlias + ", " + aFilename + ")";
		var lFilename = aFilename;
		var lAlias = aAlias;

		it(lSpec, function () {

			var lResponse = null;

			jws.Tests.getAdminTestConn().fileExists(lFilename, lAlias, {
				OnResponse: function (aToken) {
					lResponse = aToken;
				}
			});

			waitsFor(
					function () {
						return(null !== lResponse);
					},
					lSpec,
					3000
					);

			runs(function () {
				expect(lResponse.code).toEqual(0);
				expect(lResponse.exists).toEqual(aExpectedValue);
			});

		});
	},
	runSpecs: function () {
		jws.tests.FileSystem.testFileSave(
				this.TEST_FILE_NAME,
				this.TEST_FILE_DATA,
				jws.SCOPE_PUBLIC);

		jws.tests.FileSystem.testFileLoad(
				this.TEST_FILE_NAME,
				jws.FileSystemPlugIn.ALIAS_PUBLIC,
				this.TEST_FILE_DATA);

		jws.tests.FileSystem.testFileExists(
				jws.FileSystemPlugIn.ALIAS_PUBLIC,
				this.TEST_FILE_NAME,
				true);

		jws.tests.FileSystem.testFileExists(
				jws.FileSystemPlugIn.ALIAS_PRIVATE,
				"unexisting_file.txt",
				false);

		jws.tests.FileSystem.testFileSave(
				this.TEST_FILE_NAME,
				this.TEST_FILE_DATA,
				jws.SCOPE_PRIVATE);

		// testing big base64 data to the server
		jws.tests.FileSystem.testFileSave(
				this.TEST_BIG_FILE_NAME,
				this.generateBigFile(this.TEST_BIG_FILE_DATA, 1000),
				jws.SCOPE_PRIVATE);

		// Loading big base64 data from the server
		jws.tests.FileSystem.testBigFileLoad(
				this.TEST_BIG_FILE_NAME,
				jws.FileSystemPlugIn.ALIAS_PRIVATE,
				this.TEST_BIG_FILE_DATA,
				1000);

		jws.tests.FileSystem.testFileExists(
				jws.FileSystemPlugIn.ALIAS_PRIVATE,
				this.TEST_FILE_NAME,
				true);

		jws.tests.FileSystem.testGetFilelist(
				jws.FileSystemPlugIn.ALIAS_PUBLIC,
				["*.txt"],
				true, [this.TEST_FILE_NAME]);

		jws.tests.FileSystem.testGetFilelist(
				jws.FileSystemPlugIn.ALIAS_PRIVATE,
				["*.txt"],
				true,
				[this.TEST_FILE_NAME]);

		jws.tests.FileSystem.testFileSend(this.TEST_FILE_NAME, this.TEST_FILE_DATA);
		jws.tests.FileSystem.testFileSend(this.TEST_FILE_NAME, this.TEST_FILE_DATA);
		jws.tests.FileSystem.testFileDelete(this.TEST_FILE_NAME, true, 0);
		jws.tests.FileSystem.testFileDelete(this.TEST_FILE_NAME, true, -1);
	},
	/**
	 * This function simulates the creation of a file in memory
	 * @param {type} aData
	 * @param {type} aIterations
	 * @returns {@exp;Base64@pro;encode@pro;output|Base64@pro;_keyStr@call;charAt|String}
	 */
	generateBigFile: function (aData, aIterations) {
		var lIdx = 0, lResult = "";
		for (lIdx = 0; lIdx < aIterations; lIdx++) {
			lResult += aData;
		}
		return Base64.encode(lResult);
	},
	/**
	 * This functions reverts a big data coming from the server to see if it 
	 * matches with the original given data to be encoded
	 * @param {type} aOriginalData
	 * @param {type} aBigData
	 * @param {type} aIterations
	 * @returns {String} the original data encoded or the error data
	 */
	decodeBigFileData: function (aOriginalData, aBigData, aIterations) {
		var lIdx = 0,
				lResult = Base64.decode(aBigData),
				aOriginalDataLength = aOriginalData.length;

		for (lIdx = 0; lIdx < aIterations; lIdx++) {
			if (lResult.substr(aOriginalDataLength * lIdx, aOriginalDataLength) !== aOriginalData) {
				return lResult.substr(aOriginalDataLength * lIdx, aOriginalDataLength);
			}
			if (lIdx === aIterations - 1) {
				return aOriginalData;
			}
		}
		return aOriginalData;
	}
};//	---------------------------------------------------------------------------
//	jWebSocket JavaScript IOC container test specs (Community Edition, CE)
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
 * Author: Rolando Santamaria Maso <kyberneees@gmail.com>
 */
if (typeof jws.tests === "undefined") {
	jws.tests = {};
}
var classes = {};
jws.tests.ioc = {
	title: "JavaScript IOC library",
	description: "jWebSocket IOC library for web clients.",
	category: "Community Edition",
	testSetAndGetParameter: function() {
		var lKey = "name";

		it("SetAndGetParameter(1)", function() {
			var lValue = "Rolando S M";
			jws.sc.setParameter(lKey, lValue);

			var lReturnValue = jws.sc.getParameter(lKey);

			expect(lValue).toEqual(lReturnValue);
		});

		it("SetAndGetParameter(2)", function() {
			var lValue1 = "Rolando Santamaria Maso";
			jws.sc.setParameter(lKey, lValue1);

			var lReturnValue = jws.sc.getParameter(lKey);
			expect(lValue1).toEqual(lReturnValue);
		});
	},
	testSetAndGetService: function() {
		var lKey = "serv1";

		it("SetAndGetService: Without to use the ServiceDefinition class", function() {
			var lValue = {
				plus: function(x, y) {
					return x + y;
				}
			};
			jws.sc.setService(lKey, lValue);

			var lReturnValue = jws.sc.getService(lKey);

			expect(lValue).toEqual(lReturnValue);
		});
	},
	testHasAndRemoveParameter: function() {
		var lKey = "version";
		var lValue = 1.0;

		it("HasParameter", function() {
			expect(jws.sc.hasParameter(lKey)).toEqual(false);

			jws.sc.setParameter(lKey, lValue);

			expect(jws.sc.hasParameter(lKey)).toEqual(true);
		});

		it("RemoveParameter", function() {
			expect(jws.sc.removeParameter(lKey)).toEqual(lValue);
			expect(jws.sc.hasParameter(lKey)).toEqual(false);
		});
	},
	testHasAndRemoveService: function() {
		var lKey = "serv2";
		var lValue = {
			mult: function(x, y) {
				return x * y;
			}
		};

		it("HasService: Without to use the ServiceDefinition class", function() {
			expect(jws.sc.hasService(lKey)).toEqual(false);

			jws.sc.setService(lKey, lValue);

			expect(jws.sc.hasService(lKey)).toEqual(true);
		});

		it("RemoveService: Without to use the ServiceDefinition class", function() {
			expect(jws.sc.removeService(lKey)).toEqual(lValue);
			expect(jws.sc.hasService(lKey)).toEqual(false);
		});
	},
	testRegisterAndGetServiceDefinition: function() {
		jws.tests.ioc.MyClass = function MyClass() {
			this._name = null;
			this._service = null;
			this._pi = null;

			//Use init-method instead of the constructor
			this.init = function(aArgs) {
				this._name = aArgs.name;
				this._service = aArgs.service;
				this._pi = aArgs.pi;
				this._service2 = aArgs.service2;
			}

			this.getService2 = function() {
				return this._service2;
			}

			//This method needs to be called before the service construction
			this.methodToBeCalled = function() {
				//Facade using the referenced service
				this.plus = function(x, y) {
					return this._service.plus(x, y);
				}
			}

			this.sayHello = function() {
				return "Hello, " + this._name;
			};

			this.getPi = function() {
				return this._pi;
			};
		};

		it("RegisterAndGetServiceDefinition", function() {
			var lServiceName = "myclass";
			var lClassName = "jws.tests.ioc.MyClass";

			var lDef = jws.sc.register(lServiceName, lClassName);
			expect(lDef).toEqual(jws.sc.getServiceDefinition(lServiceName));
		});
	},
	testCreateGetAndRemoveService: function() {
		var lServiceName = "myclass";
		var lCreated = false;
		var lRemoved = false;
		var lDef = null;

		var lPiSource = {
			getPi: function() {
				return 3.141652;
			}
		};

		jws.tests.ioc.MyClass2 = function MyClass2() {
		};

		var lInitialized = false;
		it("CreateService: Using the service definition class", function() {
			var lInitMethod = "init";
			lDef = new jws.ioc.ServiceDefinition({
				className: "jws.tests.ioc.MyClass",
				name: lServiceName,
				aspects: [{
						pointcut: lInitMethod,
						advices: {
							after: function() {
								lInitialized = true;
							}
						}
					}]
			});

			lDef.setInitMethod(lInitMethod)
					.setShared(true)
					.setInitArguments({
						name: new jws.ioc.ParameterReference("name"),
						service: new jws.ioc.ServiceReference("serv1"),
						pi: new jws.ioc.MethodExecutionReference(lPiSource, "getPi"),
						//Testing inner services
						service2: new jws.ioc.ServiceDefinition({
							className: "jws.tests.ioc.MyClass2"
						})
					})
					.setOnCreate(function(aService) {
						lCreated = true;
					})
					.setOnRemove(function(aService) {
						lRemoved = true;
					})
					.addMethodCall("methodToBeCalled");

			jws.sc.addServiceDefinition(lDef);
		});

		it("GetService: Using the service definition class", function() {
			var lService = jws.sc.getService(lServiceName);

			expect(lService.sayHello()).toEqual("Hello, " + jws.sc.getParameter("name"));
			expect(lService.plus(5, 5)).toEqual(10);
			expect(lService.getPi()).toEqual(lPiSource.getPi());
			expect(lService.getService2()).toEqual(jws.sc.getService("jws.tests.ioc.myclass2"));
			expect(lCreated).toEqual(true);
			expect(lInitialized).toEqual(true);
		});

		it("RemoveService: Using the service definition class", function() {
			expect(jws.sc.getService(lServiceName)).toEqual(jws.sc.removeService(lServiceName));
			expect(jws.sc.hasService(lServiceName)).toEqual(false);
			expect(jws.sc.hasServiceDefinition(lServiceName)).toEqual(false);
			expect(lRemoved).toEqual(true);
		});
	},
	testFactoryMethod: function() {
		jws.tests.ioc.MyStaticClass = {
			getInstance: function() {
				return {
					method1: function() {
						return "method1";
					}
				};
			}
		};

		it("FactoryMethod(1)", function() {
			var lKey = "mystaticclass";

			jws.sc.addServiceDefinition(new jws.ioc.ServiceDefinition({
				name: lKey,
				className: "jws.tests.ioc.MyStaticClass",
				factoryMethod: "getInstance"
			}));

			expect(jws.sc.getService(lKey).method1()).toEqual("method1");
		});

		jws.tests.ioc.Circle = function Circle() {
			this._radio = 0;
		};
		jws.tests.ioc.Circle.prototype.getRadio = function() {
			return this._radio;
		};
		jws.tests.ioc.Circle.prototype.init = function(aArguments) {
			this._radio = aArguments.radio;
		};

		jws.tests.ioc.CircleFactory = {
			getInstance: function(aArguments) {
				var lCircle = new jws.tests.ioc.Circle();
				lCircle.init(aArguments);

				return lCircle;
			}
		};

		it("FactoryMethod(2)", function() {
			jws.sc.addServiceDefinition(new jws.ioc.ServiceDefinition({
				className: "jws.tests.ioc.CircleFactory",
				name: "circle",
				factoryMethod: {
					method: "getInstance",
					arguments: {
						radio: 5
					}
				}
			}));

			expect(jws.sc.getService("circle").getRadio()).toEqual(5);
		});
	},
	testAnonymousServices: function() {
		it("AnonymousServices: Creating services without names", function() {
			jws.sc.addServiceDefinition(new jws.ioc.ServiceDefinition({
				className: "jws.tests.ioc.MyStaticClass",
				factoryMethod: "getInstance"
			}));
			jws.sc.addServiceDefinition(new jws.ioc.ServiceDefinition({
				className: "jws.tests.ioc.MyStaticClass",
				factoryMethod: "getInstance"
			}));
		});

		jws.sc.addServiceDefinition(new jws.ioc.ServiceDefinition({
			className: "jws.tests.ioc.MyStaticClass",
			factoryMethod: "getInstance"
		}));
	},
	runSpecs: function() {
		// refresh default service container
		jws.sc = new jws.ioc.ServiceContainerBuilder({
			id: "jws.sc",
			container: new jws.ioc.ServiceContainer()
		});

		this.testSetAndGetParameter();
		this.testHasAndRemoveParameter();
		this.testSetAndGetService();
		this.testHasAndRemoveService();
		this.testRegisterAndGetServiceDefinition();
		this.testCreateGetAndRemoveService();
		this.testFactoryMethod();
		this.testAnonymousServices();
	}
};//	---------------------------------------------------------------------------
//	jWebSocket ItemStorage Plug-in CE test specs (Community Edition, CE)
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

if (typeof jws.tests === "undefined") {
	jws.tests = {};
}
jws.tests.ItemStorage = {
	NS: "jws.tests.itemstorage",
	title: "ItemStorage plug-in",
	description: "jWebSocket itemstorage plug-in. Designed for generic data storage.",
	category: "Community Edition",
	priority: 20,
	dependsOn: [{
			plugInId: "jws.itemstorage"
		}],
	testCreateCollection: function (aCollectionName, aItemType, aSecretPwd, aAccessPwd, aIsPrivate, aCapacity, aExpectedCode) {

		var lSpec = "createItemCollection (admin, " + aCollectionName + ", " + aItemType
				+ ", " + aExpectedCode + ")";

		it(lSpec, function () {

			var lResponse = null;

			jws.Tests.getAdminTestConn().setConfiguration(jws.ItemStoragePlugIn.NS, {
				events: {
					itemUpdateOnly: true
				}
			});

			jws.Tests.getAdminTestConn().createCollection(aCollectionName, aItemType,
					aSecretPwd, aAccessPwd, aIsPrivate, {
						capacity: aCapacity,
						OnResponse: function (aToken) {
							lResponse = aToken;
						}
					});

			waitsFor(
					function () {
						return(null != lResponse);
					},
					lSpec,
					3000
					);

			runs(function () {
				expect(lResponse.code).toEqual(aExpectedCode);
			});

		});
	},
	testRemoveCollection: function (aCollectionName, aSecretPwd, aExpectedCode) {
		var lSpec = "removeItemCollection (admin, " + aCollectionName + ", " + aSecretPwd
				+ ", " + aExpectedCode + ")";

		it(lSpec, function () {

			var lResponse = null;
			jws.Tests.getAdminTestConn().removeCollection(aCollectionName, aSecretPwd, {
				OnResponse: function (aToken) {
					lResponse = aToken;
				}
			});

			waitsFor(
					function () {
						return(null != lResponse);
					},
					lSpec,
					3000
					);

			runs(function () {
				expect(lResponse.code).toEqual(aExpectedCode);
			});
		});
	},
	testExistsCollection: function (aCollectionName, aExists) {
		var lSpec = "existsCollection (admin, " + aCollectionName
				+ ", " + aExists + ")";

		it(lSpec, function () {

			var lResponse = null;
			jws.Tests.getAdminTestConn().existsCollection(aCollectionName, {
				OnResponse: function (aToken) {
					lResponse = aToken;
				}
			});

			waitsFor(
					function () {
						return(null != lResponse);
					},
					lSpec,
					3000
					);

			runs(function () {
				expect(lResponse.exists).toEqual(aExists);
			});
		});
	},
	testSubscribeCollection: function (aCollectionName, aAccessPwd, aExpectedCode) {
		var lSpec = "subscribeCollection (admin, " + aCollectionName + ", " + aAccessPwd
				+ ", " + aExpectedCode + ")";

		it(lSpec, function () {

			var lResponse = null;
			var lEvent = null;

			jws.Tests.getAdminTestConn().setItemStorageCallbacks({
				OnCollectionSubscription: function (aToken) {
					lEvent = aToken;
				}
			});
			jws.Tests.getAdminTestConn().subscribeCollection(aCollectionName, aAccessPwd, {
				OnResponse: function (aToken) {
					if (-1 == aToken.code) {
						lEvent = false;
					}
					lResponse = aToken;
				}
			});

			waitsFor(
					function () {
						return(null != lResponse && null != lEvent);
					},
					lSpec,
					3000
					);

			runs(function () {
				expect(lResponse.code).toEqual(aExpectedCode);
			});
		});
	},
	testUnsubscribeCollection: function (aCollectionName, aExpectedCode) {
		var lSpec = "unsubscribeCollection (admin, " + aCollectionName + ", " + aExpectedCode + ")";

		it(lSpec, function () {

			var lResponse = null;
			jws.Tests.getAdminTestConn().unsubscribeCollection(aCollectionName, {
				OnResponse: function (aToken) {
					lResponse = aToken;
				}
			});

			waitsFor(
					function () {
						return(null != lResponse);
					},
					lSpec,
					3000
					);

			runs(function () {
				expect(lResponse.code).toEqual(aExpectedCode);
			});
		});
	},
	testAuthorizeCollection: function (aCollectionName, aSecretPwd, aExpectedCode) {
		var lSpec = "authorizeCollection (admin, " + aCollectionName + ", " + aSecretPwd
				+ ", " + aExpectedCode + ")";

		it(lSpec, function () {

			var lResponse = null;
			var lEvent = null;

			jws.Tests.getAdminTestConn().setItemStorageCallbacks({
				OnCollectionAuthorization: function (aToken) {
					lEvent = aToken;
				}
			});
			jws.Tests.getAdminTestConn().authorizeCollection(aCollectionName, aSecretPwd, {
				OnResponse: function (aToken) {
					if (-1 == aToken.code) {
						lEvent = false;
					}
					lResponse = aToken;
				}
			});

			waitsFor(
					function () {
						return(null != lResponse && null != lEvent);
					},
					lSpec,
					3000
					);

			runs(function () {
				expect(lResponse.code).toEqual(aExpectedCode);
			});
		});
	},
	testClearCollection: function (aCollectionName, aSecretPwd, aExpectedCode) {
		var lSpec = "clearCollection (admin, " + aCollectionName + ", " + aSecretPwd
				+ ", " + aExpectedCode + ")";

		it(lSpec, function () {

			var lResponse = null;
			var lEvent = null;

			jws.Tests.getAdminTestConn().setItemStorageCallbacks({
				OnCollectionCleaned: function (aToken) {
					lEvent = aToken;
				}
			});
			jws.Tests.getAdminTestConn().clearCollection(aCollectionName, aSecretPwd, {
				OnResponse: function (aToken) {
					if (-1 == aToken.code) {
						lEvent = false;
					}
					lResponse = aToken;
				}
			});

			waitsFor(
					function () {
						return(null != lResponse && null != lEvent);
					},
					lSpec,
					3000
					);

			runs(function () {
				expect(lResponse.code).toEqual(aExpectedCode);
			});
		});
	},
	testEditCollection: function (aCollectionName, aSecretPwd, aNewSecretPwd,
			aAccessPwd, aIsPrivate, aExpectedCode) {
		var lSpec = "editCollection (admin, " + aCollectionName + ", "
				+ aSecretPwd + ", " + aExpectedCode + ")";

		it(lSpec, function () {

			var lResponse = null;

			jws.Tests.getAdminTestConn().editCollection(aCollectionName, aSecretPwd, {
				newSecretPassword: aNewSecretPwd,
				accessPassword: aAccessPwd,
				isPrivate: aIsPrivate,
				OnResponse: function (aToken) {
					lResponse = aToken;
				}
			});

			waitsFor(
					function () {
						return(null != lResponse);
					},
					lSpec,
					3000
					);

			runs(function () {
				expect(lResponse.code).toEqual(aExpectedCode);
			});
		});
	},
	testRestartCollection: function (aCollectionName, aSecretPwd, aExpectedCode) {
		var lSpec = "restartCollection (admin, " + aCollectionName + ", "
				+ aSecretPwd + ", " + aExpectedCode + ")";

		it(lSpec, function () {

			var lResponse = null;
			var lEvent = null;

			jws.Tests.getAdminTestConn().setItemStorageCallbacks({
				OnCollectionRestarted: function (aToken) {
					lEvent = aToken;
				}
			});
			jws.Tests.getAdminTestConn().restartCollection(aCollectionName, aSecretPwd, {
				OnResponse: function (aToken) {
					if (-1 == aToken.code) {
						lEvent = false;
					}
					lResponse = aToken;
				}
			});

			waitsFor(
					function () {
						return(null != lResponse && null != lEvent);
					},
					lSpec,
					3000
					);

			runs(function () {
				expect(lResponse.code).toEqual(aExpectedCode);
			});
		});
	},
	testGetCollectionNames: function (aUserOnly, aExpectedCode, aExpectedSize) {
		var lSpec = "getCollectionNames (admin, " + aExpectedCode + ", " + aExpectedSize + ")";

		it(lSpec, function () {

			var lResponse = null;

			jws.Tests.getAdminTestConn().getCollectionNames(aUserOnly, {
				OnResponse: function (aToken) {
					lResponse = aToken;
				}
			});

			waitsFor(
					function () {
						return(null != lResponse);
					},
					lSpec,
					3000
					);

			runs(function () {
				expect(lResponse.code).toEqual(aExpectedCode);
				if (0 == lResponse.code) {
					expect(aExpectedSize == lResponse.data.length);
				}
			});
		});
	},
	testFindCollection: function (aCollectionName, aFound) {
		var lSpec = "findCollection (admin, " + aCollectionName + ", " + aFound + ")";

		it(lSpec, function () {

			var lResponse = null;

			jws.Tests.getAdminTestConn().findCollection(aCollectionName, {
				OnResponse: function (aToken) {
					lResponse = aToken;
				}
			});

			waitsFor(
					function () {
						return(null != lResponse);
					},
					lSpec,
					3000
					);

			runs(function () {
				expect(null != lResponse.data).toEqual(aFound);
			});
		});
	},
	testSaveItem: function (aCollectionName, aItem, aExpectedCode) {
		var lSpec = "saveItem (admin, " + aCollectionName + ", " + aExpectedCode + ")";

		it(lSpec, function () {

			var lResponse = null;
			var lEvent = null;

			jws.Tests.getAdminTestConn().setItemStorageCallbacks({
				OnItemSaved: function (aToken) {
					lEvent = aToken;
				}
			});

			jws.Tests.getAdminTestConn().saveItem(aCollectionName, aItem, {
				OnResponse: function (aToken) {
					if (0 != aToken.code) {
						lEvent = false;
					}
					lResponse = aToken;
				}
			});

			waitsFor(
					function () {
						return(null != lResponse && null != lEvent);
					},
					lSpec,
					3000
					);

			runs(function () {
				expect(lResponse.code).toEqual(aExpectedCode);
			});
		});
	},
	testRemoveItem: function (aCollectionName, aPK, aExpectedCode) {
		var lSpec = "removeItem (admin, " + aCollectionName + ", " + aPK + ", " + aExpectedCode + ")";

		it(lSpec, function () {

			var lResponse = null;
			var lEvent = null;

			jws.Tests.getAdminTestConn().setItemStorageCallbacks({
				OnItemRemoved: function (aToken) {
					lEvent = aToken;
				}
			});

			jws.Tests.getAdminTestConn().removeItem(aCollectionName, aPK, {
				OnResponse: function (aToken) {
					if (0 != aToken.code) {
						lEvent = false;
					}
					lResponse = aToken;
				}
			});

			waitsFor(
					function () {
						return(null != lResponse && null != lEvent);
					},
					lSpec,
					3000
					);

			runs(function () {
				expect(lResponse.code).toEqual(aExpectedCode);
			});
		});
	},
	testFindItemByPK: function (aCollectionName, aPK, aExpectedCode, aExists) {
		var lSpec = "findItemByPK (admin, " + aCollectionName + ", " + aPK + ", " + aExists + ")";

		it(lSpec, function () {

			var lResponse = null;
			jws.Tests.getAdminTestConn().findItemByPK(aCollectionName, aPK, {
				OnResponse: function (aToken) {
					lResponse = aToken;
				}
			});

			waitsFor(
					function () {
						return(null != lResponse);
					},
					lSpec,
					3000
					);

			runs(function () {
				expect(lResponse.code).toEqual(aExpectedCode);
				if (0 == lResponse.code && aExists) {
					expect(lResponse.data.pk).toEqual(aPK);
				}
			});
		});
	},
	testExistsItem: function (aCollectionName, aPK, aExists) {
		var lSpec = "findItemByPK (admin, " + aCollectionName + ", " + aPK + ", " + aExists + ")";

		it(lSpec, function () {

			var lResponse = null;
			jws.Tests.getAdminTestConn().existsItem(aCollectionName, aPK, {
				OnResponse: function (aToken) {
					lResponse = aToken;
				}
			});

			waitsFor(
					function () {
						return(null != lResponse);
					},
					lSpec,
					3000
					);

			runs(function () {
				expect(lResponse.exists).toEqual(aExists);
			});
		});
	},
	testFindItemDef: function (aItemType, aExists) {
		var lSpec = "findItemDefinition (admin, " + aItemType + ", "
				+ aExists + ")";

		it(lSpec, function () {

			var lResponse = null;
			jws.Tests.getAdminTestConn().findItemDefinition(aItemType, {
				OnResponse: function (aToken) {
					lResponse = aToken;
				}
			});

			waitsFor(
					function () {
						return(null != lResponse);
					},
					lSpec,
					3000
					);

			runs(function () {
				expect(null != lResponse.data["type"]).toEqual(aExists);
			});
		});
	},
	testExistsItemDef: function (aItemType, aExists) {
		var lSpec = "existsItemDefinition (admin, " + aItemType + ", "
				+ aExists + ")";

		it(lSpec, function () {

			var lResponse = null;
			jws.Tests.getAdminTestConn().existsItemDefinition(aItemType, {
				OnResponse: function (aToken) {
					lResponse = aToken;
				}
			});

			waitsFor(
					function () {
						return(null != lResponse);
					},
					lSpec,
					3000
					);

			runs(function () {
				expect(lResponse.exists).toEqual(aExists);
			});
		});
	},
	testListItemDef: function (aExpectedSize) {
		var lSpec = "listDefinitions (admin, " + aExpectedSize + ")";

		it(lSpec, function () {

			var lResponse = null;
			jws.Tests.getAdminTestConn().listItemDefinitions({
				OnResponse: function (aToken) {
					lResponse = aToken;
				}
			});

			waitsFor(
					function () {
						return(null != lResponse);
					},
					lSpec,
					3000
					);

			runs(function () {
				expect(lResponse.data.length >= aExpectedSize).toEqual(true);
			});
		});
	},
	testListItems: function (aCollectionName, aOffset, aLength, aExpectedCode, aExpectedSize) {
		var lSpec = "listItems (admin, " + aCollectionName + ", " + aOffset
				+ ", " + aLength + ", " + aExpectedSize + ", " + aExpectedCode + ")";

		it(lSpec, function () {

			var lResponse = null;
			jws.Tests.getAdminTestConn().listItems(aCollectionName, {
				offset: aOffset,
				length: aLength,
				OnResponse: function (aToken) {
					lResponse = aToken;
				}
			});

			waitsFor(
					function () {
						return(null != lResponse);
					},
					lSpec,
					3000
					);

			runs(function () {
				expect(lResponse.code).toEqual(aExpectedCode);
				if (0 == lResponse.code) {
					expect(lResponse.data.length).toEqual(aExpectedSize);
				}
			});
		});
	},
	runSpecs: function () {
		var lCollectionName = "mycontacts";
		var lPwd = "123";

		// create
		this.testCreateCollection(lCollectionName, "contact", lPwd, lPwd, false, 10, 0);
		this.testCreateCollection(lCollectionName, "contact", lPwd, lPwd, false, 10, -1);
		// get names
		this.testGetCollectionNames(false, 0, 1);
		this.testGetCollectionNames(true, 0, 1);

		// exists collection
		this.testExistsCollection(lCollectionName, true);

		// create other
		this.testCreateCollection(lCollectionName + "1", "contact", lPwd, lPwd, false, 10, 0);

		// exists collection
		this.testExistsCollection(lCollectionName + "1", true);
		// exists collection
		this.testExistsCollection("wrong collection name", false);

		// get names
		this.testGetCollectionNames(false, 0, 2);
		this.testGetCollectionNames(true, 0, 2);

		// get collection
		this.testFindCollection(lCollectionName, true);
		this.testFindCollection("wrong collection name", false);

		// subscribe
		this.testSubscribeCollection(lCollectionName, lPwd, 0);
		this.testUnsubscribeCollection(lCollectionName, 0);
		this.testSubscribeCollection(lCollectionName, lPwd, 0);
		this.testSubscribeCollection(lCollectionName, lPwd, -1); // subscribed already
		this.testSubscribeCollection(lCollectionName, "wrong password", -1);

		// restart
		this.testRestartCollection(lCollectionName, lPwd, 0);

		// find by PK
		this.testFindItemByPK("wrongCollectionName", "rsantamaria", -1,
				true); // should fail (collection not exists)
		this.testFindItemByPK(lCollectionName, "rsantamaria", -1,
				false); // should fail (not subscribed)

		// subscribe again
		this.testSubscribeCollection(lCollectionName, lPwd, 0);

		// save item
		this.testSaveItem("wrongCollectionName", {
			name: "Rolando SM",
			mailAddress: "rsantamaria@jwebsocket.org",
			siteURL: "http://jwebsocket.org",
			comment: "jWebSocket developer",
			image: "base64 image content",
			username: "rsantamaria",
			sex: true
		}, -1); // should fail (collection not exists)

		// save item
		this.testSaveItem(lCollectionName, {
			name: "Rolando SM",
			mailAddress: "rsantamaria@jwebsocket.org",
			siteURL: "http://jwebsocket.org",
			comment: "jWebSocket developer",
			image: "base64 image content",
			username: "rsantamaria",
			sex: true
		}, -1); // should fail (not authorized)

		this.testRemoveItem(lCollectionName, "rsantamaria",
				-1); // should fail (not authorized)
		this.testRemoveItem("wrongCollectionName", "rsantamaria",
				-1); // should fail (collection not exists)

		// authorize
		this.testAuthorizeCollection(lCollectionName, lPwd, 0);

		// save item
		this.testSaveItem(lCollectionName, {
			name: "Rolando SM",
			mailAddress: "rsantamaria@jwebsocket.org",
			siteURL: "http://jwebsocket.org",
			comment: "jWebSocket developer",
			image: "base64 image content",
			username: "rsantamaria",
			sex: true
		}, 0);

		// save item (modify)
		this.testSaveItem(lCollectionName, {
			name: "Rolando Santamaria Maso",
			username: "rsantamaria"
		}, 0);

		// find by PK
		this.testFindItemByPK(lCollectionName, "rsantamaria", 0, true);
		this.testFindItemByPK(lCollectionName, "wrongPK", 0, false);

		// list items
		this.testListItems(lCollectionName, 0, 1, 0, 1);
		this.testListItems(lCollectionName, 5, 1, -1,
				0); // should fail (index out of bound)
		this.testListItems(lCollectionName, 0, -1, -1,
				0); // should fail (expected length > 0)

		// remove item
		this.testExistsItem(lCollectionName, "rsantamaria", true);

		// remove item
		this.testRemoveItem(lCollectionName, "rsantamaria", 0);
		this.testExistsItem(lCollectionName, "rsantamaria", false);
		this.testRemoveItem(lCollectionName, "rsantamaria",
				-1); // should fail (item not exists)

		// save item
		this.testSaveItem(lCollectionName, {
			name: "Rolando SM",
			mailAddress: "rsantamaria@jwebsocket.org",
			siteURL: "http://jwebsocket.org",
			comment: "jWebSocket developer",
			image: "base64 image content",
			sex: true
		}, -1); // should fail (missing PK)
		// 
		// save item
		this.testSaveItem(lCollectionName, {
			name: "Rolando SM",
			mailAddress: "rsantamaria@jwebsocket.org",
			siteURL: "http://jwebsocket.org",
			comment: "jWebSocket developer",
			image: "base64 image content",
			sex: true,
			arbitraryAttr: "bla bla bla"
		}, -1); // should fail (missing attribute definition)

		this.testAuthorizeCollection(lCollectionName, lPwd, -1); // authorized already
		this.testAuthorizeCollection(lCollectionName, "wrong password", -1);

		// save item
		this.testSaveItem(lCollectionName, {
			name: "Rolando SM",
			mailAddress: "rsantamaria@jwebsocket.org",
			siteURL: "http://jwebsocket.org",
			comment: "jWebSocket developer",
			image: "base64 image content",
			username: "rsantamaria",
			sex: true
		}, 0);

		// clear
		this.testClearCollection(lCollectionName, lPwd, 0);
		this.testClearCollection(lCollectionName, "wrong password", -1);

		// change config
		this.testEditCollection(lCollectionName, lPwd, "abc", "abc", true, 0);
		this.testEditCollection(lCollectionName, lPwd, "abc", "abc", true, -1);
		this.testEditCollection(lCollectionName, "abc", lPwd, lPwd, false, 0);

		this.testRemoveCollection(lCollectionName, "wrong password", -1);
		this.testRemoveCollection(lCollectionName, lPwd, 0);
		this.testRemoveCollection(lCollectionName + "1", lPwd, 0);

		// list definitions
		this.testListItemDef(1);
	}
};//	---------------------------------------------------------------------------
//	jWebSocket JDBC Plug-in test specs (Community Edition, CE)
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

if (typeof jws.tests === "undefined") {
	jws.tests = {};
}
jws.tests.JDBC = {
	title: "JDBC plug-in",
	description: "jWebSocket JDBC plug-in",
	category: "Community Edition",
	enabled: true,
	TEST_TABLE: "jwebsocket_automated_test",
	TEST_STRING_1: "This is an automated demo text",
	TEST_STRING_2: "This is an updated demo text",
	dependsOn: [{
			plugInId: "jws.jdbc"
		}],
	// this spec tests the jdbc plug-in, creating a temporary table for test purposes
	testCreateTable: function () {

		var lSpec = "create table (admin)";
		it(lSpec, function () {

			// init response
			var lResponse = {};

			// perform the native create table...
			jws.Tests.getAdminTestConn().jdbcExecSQL(
					"create table " + jws.tests.JDBC.TEST_TABLE + " (id int, text varchar(80))",
					{OnResponse: function (aToken) {
							lResponse = aToken;
						}
					}
			);

			// wait for result, consider reasonable timeout
			waitsFor(
					function () {
						// check response
						return(lResponse.msg !== undefined);
					},
					lSpec,
					5000 * 5
					);

			// check result if ok
			runs(function () {
				expect(lResponse.msg).toEqual("ok");
			});

		});
	},
	// this spec tests the jdbc plug-in, dropping a temporary table for test purposes
	testDropTable: function () {

		var lSpec = "drop table (admin)";
		it(lSpec, function () {

			// init response
			var lResponse = {};

			// perform the native drop table...
			jws.Tests.getAdminTestConn().jdbcExecSQL(
					"drop table " + jws.tests.JDBC.TEST_TABLE,
					{OnResponse: function (aToken) {
							lResponse = aToken;
						}
					}
			);

			// wait for result, consider reasonable timeout
			waitsFor(
					function () {
						// check response
						return(lResponse.msg !== undefined);
					},
					lSpec,
					1500
					);

			// check result if ok
			runs(function () {
				expect(lResponse.msg).toEqual("ok");
			});

		});
	},
	// this spec tests the native SQL select function of the JDBC plug-in
	testSelectSQL: function () {

		var lSpec = "selectSQL (admin)";
		it(lSpec, function () {

			// init response
			var lResponse = {};

			// perform the native select...
			jws.Tests.getAdminTestConn().jdbcQuerySQL(
					"select * from " + jws.tests.JDBC.TEST_TABLE,
					{OnResponse: function (aToken) {
							lResponse = aToken;
						}
					}
			);

			// wait for result, consider reasonable timeout
			waitsFor(
					function () {
						// check response
						return(lResponse.code !== undefined);
					},
					lSpec,
					1500
					);

			// check result if ok
			runs(function () {
				expect(lResponse.code).toEqual(0);
			});

		});
	},
	// this spec tests the native SQL insert function of the JDBC plug-in
	testInsertSQL: function () {

		var lSpec = "insertSQL (admin)";
		it(lSpec, function () {

			// init response
			var lResponse = {};

			// perform the native insert...
			jws.Tests.getAdminTestConn().jdbcUpdateSQL(
					"insert into "
					+ jws.tests.JDBC.TEST_TABLE
					+ " (id, text) values (1, '"
					+ jws.tests.JDBC.TEST_STRING_1 + "')",
					{OnResponse: function (aToken) {
							lResponse = aToken;
						}
					}
			);

			// wait for result, consider reasonable timeout
			waitsFor(
					function () {
						return(lResponse.code !== undefined);
					},
					lSpec,
					1500
					);

			// check result if ok
			runs(function () {
				expect(lResponse.msg).toEqual("ok");
				expect(lResponse.rowsAffected[0]).toEqual(1);
			});

		});
	},
	// this spec tests the native SQL update function of the JDBC plug-in
	testUpdateSQL: function () {

		var lSpec = "updateSQL (admin)";
		it(lSpec, function () {

			// init response
			var lResponse = {};

			// perform the native update...
			jws.Tests.getAdminTestConn().jdbcUpdateSQL(
					"update "
					+ jws.tests.JDBC.TEST_TABLE
					+ " set text = '" + jws.tests.JDBC.TEST_STRING_2 + "'"
					+ " where id = 1",
					{OnResponse: function (aToken) {
							lResponse = aToken;
						}
					}
			);

			// wait for result, consider reasonable timeout
			waitsFor(
					function () {
						return(lResponse.code !== undefined);
					},
					lSpec,
					1500
					);

			// check result if ok
			runs(function () {
				expect(lResponse.msg).toEqual("ok");
				expect(lResponse.rowsAffected[0]).toEqual(1);
			});

		});
	},
	// this spec tests the native SQL delete function of the JDBC plug-in
	testDeleteSQL: function () {

		var lSpec = "deleteSQL (admin)";
		it(lSpec, function () {

			// init response
			var lResponse = {};

			// perform the native delete...
			jws.Tests.getAdminTestConn().jdbcUpdateSQL(
					"delete from "
					+ jws.tests.JDBC.TEST_TABLE
					+ " where id = 1",
					{OnResponse: function (aToken) {
							lResponse = aToken;
						}
					}
			);

			// wait for result, consider reasonable timeout
			waitsFor(
					function () {
						return(lResponse.code !== undefined);
					},
					lSpec,
					1500
					);

			// check result if ok
			runs(function () {
				expect(lResponse.msg).toEqual("ok");
				expect(lResponse.rowsAffected[0]).toEqual(1);
			});

		});
	},
	// this spec tests the abstract select function of the JDBC plug-in
	testSelect: function () {

		var lSpec = "select (admin)";
		it(lSpec, function () {

			// init response
			var lResponse = {};

			// perform the abstract select command...
			jws.Tests.getAdminTestConn().jdbcSelect(
					{tables: [jws.tests.JDBC.TEST_TABLE],
						fields: ["id", "text"],
						where: "id=1"
					},
			{OnResponse: function (aToken) {
					lResponse = aToken;
				}
			}
			);

			// wait for result, consider reasonable timeout
			waitsFor(
					function () {
						return(lResponse.code !== undefined);
					},
					lSpec,
					1500
					);

			// check result if ok
			runs(function () {
				expect(lResponse.msg).toEqual("ok");
				expect(lResponse.data.length).toEqual(1);
				expect(lResponse.data[0][1]).toEqual(jws.tests.JDBC.TEST_STRING_2);
			});

		});
	},
	// this spec tests the abstract insert function of the JDBC plug-in
	testInsert: function () {

		var lSpec = "insert (admin)";
		it(lSpec, function () {

			// init response
			var lResponse = {};

			// perform the abstract insert command
			jws.Tests.getAdminTestConn().jdbcInsert(
					{table: jws.tests.JDBC.TEST_TABLE,
						fields: ["id", "text"],
						values: [1, jws.tests.JDBC.TEST_STRING_1]
					},
			{OnResponse: function (aToken) {
					lResponse = aToken;
				}
			}
			);

			// wait for result, consider reasonable timeout
			waitsFor(
					function () {
						return(lResponse.code !== undefined);
					},
					lSpec,
					1500
					);

			// check result if ok
			runs(function () {
				expect(lResponse.msg).toEqual("ok");
				expect(lResponse.rowsAffected[0]).toEqual(1);
			});

		});
	},
	// this spec tests the abstract update function of the JDBC plug-in
	testUpdate: function () {

		var lSpec = "update (admin)";
		it(lSpec, function () {

			// init response
			var lResponse = {};

			// perform the abstract update command
			jws.Tests.getAdminTestConn().jdbcUpdate(
					{table: jws.tests.JDBC.TEST_TABLE,
						fields: ["text"],
						values: [jws.tests.JDBC.TEST_STRING_2],
						where: "id=1"
					},
			{OnResponse: function (aToken) {
					lResponse = aToken;
				}
			}
			);

			// wait for result, consider reasonable timeout
			waitsFor(
					function () {
						return(lResponse.code !== undefined);
					},
					lSpec,
					1500
					);

			// check result if ok
			runs(function () {
				expect(lResponse.msg).toEqual("ok");
				expect(lResponse.rowsAffected[0]).toEqual(1);
			});

		});
	},
	// this spec tests the abstract delete function of the JDBC plug-in
	testDelete: function () {

		var lSpec = "delete (admin)";
		it(lSpec, function () {

			// init response
			var lResponse = {};

			// perform the abstract delete command
			jws.Tests.getAdminTestConn().jdbcDelete(
					{table: jws.tests.JDBC.TEST_TABLE,
						where: "id=1"
					},
			{OnResponse: function (aToken) {
					lResponse = aToken;
				}
			}
			);

			// wait for result, consider reasonable timeout
			waitsFor(
					function () {
						return(lResponse.code !== undefined);
					},
					lSpec,
					1500
					);

			// check result if ok
			runs(function () {
				expect(lResponse.msg).toEqual("ok");
				expect(lResponse.rowsAffected[0]).toEqual(1);
			});

		});
	},
	// this spec tests the native SQL select function of the JDBC plug-in
	testGetPrimaryKeys: function () {

		var lSpec = "getPrimaryKeys (admin)";
		it(lSpec, function () {

			// init response
			var lResponse = {};

			// try to get 3 new primary keys...
			jws.Tests.getAdminTestConn().jdbcGetPrimaryKeys(
					"sq_pk_system_log",
					{count: 3,
						OnResponse: function (aToken) {
							lResponse = aToken;
						}
					}
			);

			// wait for result, consider reasonable timeout
			waitsFor(
					function () {
						// check response
						return(lResponse.code !== undefined);
					},
					lSpec,
					1500
					);

			// check result if ok
			runs(function () {
				expect(lResponse.code).toEqual(0);
				expect(lResponse.values.length).toEqual(3);
			});

		});
	},
	runSpecs: function () {
		// run alls tests within an outer test suite

		// create a temporary table (test for DDL commands)
		this.testCreateTable();

		// run native tests
		this.testInsertSQL();
		this.testUpdateSQL();
		this.testSelectSQL();
		this.testDeleteSQL();

		// run abstract tests
		this.testInsert();
		this.testUpdate();
		this.testSelect();
		this.testDelete();

		// drop the temporary table (test for DDL commands)
		this.testDropTable();
	}
};//	---------------------------------------------------------------------------
//	jWebSocket JMS Plug-in test specs (Community Edition, CE)
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
if (typeof jws.tests === "undefined") {
	jws.tests = {};
}
jws.tests.JMS = {
	title: "JMS plug-in",
	description: "jWebSocket JMS plug-in",
	category: "Community Edition",
	dependsOn: [{
			plugInId: "jws.jms"
		}],
	// this spec tests the listen method of the JMS plug-in
	testListen: function () {
		var lSpec = "listen (no Pub/Sub)";

		it(lSpec, function () {

			var lResponse = {};
			jws.Tests.getAdminTestConn().listenJms(
					"connectionFactory", // aConnectionFactoryName, 
					"testQueue", // aDestinationName, 
					false, // aPubSubDomain,
					{OnResponse: function (aToken) {
							lResponse = aToken;
						}
					}
			);

			waitsFor(
					function () {
						return(0 === lResponse.code);
					},
					lSpec,
					3000
					);

			runs(function () {
				expect(lResponse.code).toEqual(0);
			});

		});
	},
	// this spec tests the listen method of the JMS plug-in
	testUnlisten: function () {
		var lSpec = "unlisten (no Pub/Sub)";

		it(lSpec, function () {

			var lResponse = {};
			jws.Tests.getAdminTestConn().unlistenJms(
					"connectionFactory", // aConnectionFactoryName, 
					"testQueue", // aDestinationName, 
					false, // aPubSubDomain,
					{OnResponse: function (aToken) {
							lResponse = aToken;
						}
					}
			);

			waitsFor(
					function () {
						return(0 === lResponse.code);
					},
					lSpec,
					3000
					);

			runs(function () {
				expect(lResponse.code).toEqual(0);
			});

		});
	},
	runSpecs: function () {
		jws.tests.JMS.testListen();
		jws.tests.JMS.testUnlisten();
	}
};//	---------------------------------------------------------------------------
//	jWebSocket Reporting Plug-in test specs (Community Edition, CE)
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

if (typeof jws.tests === "undefined") {
	jws.tests = {};
}
// requires web/res/js/jwsLoadBalancerPlugIn.js previously loaded
jws.tests.LoadBalancer = {
	title: "Load balancer plug-in",
	description: "jWebSocket load balancer plug-in for balance and manage the load in the jWebSocket server",
	category: "Community Edition",
	mEndPointId: "",
	mClusterAlias: "",
	dependsOn: [{
			plugInId: "jws.lb"
		}],
	mDeregisterConn: null,
	// this spec tests the clusters information feature	
	testClustersInfo: function () {
		var lSpec = "getting clusters information";
		var lResponse = null;

		it(lSpec, function () {

			// perform the clusters information feature on the server
			jws.Tests.getAdminTestConn().lbClustersInfo({
				OnResponse: function (aResponse) {
					lResponse = aResponse;
				}
			});

			// wait for result, consider reasonable timeout
			waitsFor(
					function () {
						return (null !== lResponse);
					},
					lSpec,
					2000
					);

			// check the result 
			runs(function () {
				expect(lResponse.code).toEqual(0);
			});
		});
	},
	// this spec tests the register endpoints feature
	testRegisterServiceEndPoint1: function () {
		var lSpec = "Register service endpoint( invalid password, valid clusterAlias, valid clusterNS )";
		var lResponse = null;

		it(lSpec, function () {

			// perform the clusters information feature on the server
			jws.Tests.getAdminTestConn().lbClustersInfo({
				OnResponse: function (aResponse) {
					var lClusterInfoValues = aResponse.data;
					if (lClusterInfoValues.length > 0) {
						var lConn = null;

						// perform the create sample service on the server
						// with invalid credential and valid arguments
						lConn = jws.Tests.getAdminTestConn().lbSampleService(
								lClusterInfoValues[0].clusterAlias, "wrongUser", {
							nameSpace: lClusterInfoValues[0].clusterNS,
							OnResponse: function (aResponse) {
								lResponse = aResponse;
								lConn.close();
							}
						});
					} else {
						lResponse = {
							code: -1,
							msg: 'failure'
						}
					}
				}
			});

			// wait for result, consider reasonable timeout
			waitsFor(
					function () {
						return (null !== lResponse);
					},
					lSpec,
					3000
					);

			// check the result
			runs(function () {
				expect(lResponse.code).toEqual(-1);
			});
		});
	},
	// this spec tests the register endpoints feature
	testRegisterServiceEndPoint2: function () {
		var lSpec = "Register service endpoint( valid password, invalid clusterAlias, invalid clusterNS )";
		var lResponse = null;

		it(lSpec, function () {
			var lConn = null;

			// perform the create sample service on the server
			// with valid credential and invalid arguments
			lConn = jws.Tests.getAdminTestConn().lbSampleService('wrongClusterAlias', 'admin', {
				nameSpace: 'wrongClusterNS',
				OnResponse: function (aResponse) {
					lResponse = aResponse;
					lConn.close();
				}
			});

			// wait for result, consider reasonable timeout
			waitsFor(
					function () {
						return (null !== lResponse);
					},
					lSpec,
					2000
					);

			// check the result
			runs(function () {
				expect(lResponse.code).toEqual(-1);
			});
		});
	},
	// this spec tests the register endpoints feature
	testRegisterServiceEndPoint3: function () {
		var lSpec = "Register service endpoint( invalid password, invalid clusterAlias, invalid clusterNS )";
		var lResponse = null;

		it(lSpec, function () {
			var lConn = null;

			// perform the create sample service on the server
			// with invalid credential and invalid arguments
			lConn = jws.Tests.getAdminTestConn().lbSampleService('wrongClusterAlias', 'wrongUser', {
				nameSpace: 'wrongClusterNS',
				OnResponse: function (aResponse) {
					lResponse = aResponse;
					lConn.close();
				}
			});

			// wait for result, consider reasonable timeout
			waitsFor(
					function () {
						return (null !== lResponse);
					},
					lSpec,
					2000
					);

			// check the result
			runs(function () {
				expect(lResponse.code).toEqual(-1);
			});
		});
	},
	// this spec tests the register endpoints feature
	testRegisterServiceEndPoint4: function () {
		var lSpec = "Register service endpoint( valid password, valid clusterAlias, valid clusterNS )";
		var lResponse = null;

		it(lSpec, function () {

			// perform the clusters information feature on the server
			jws.Tests.getAdminTestConn().lbClustersInfo({
				OnResponse: function (aResponse) {
					var lClusterInfoValues = aResponse.data;

					if (lClusterInfoValues.length > 0) {
						var lTarget = lClusterInfoValues.length - 1;
						var lConn = null;

						// perform the create sample service on the server
						// with valid credential and valid arguments	
						lConn = jws.Tests.getAdminTestConn().lbSampleService(
								lClusterInfoValues[lTarget].clusterAlias, "admin", {
							nameSpace: lClusterInfoValues[lTarget].clusterNS,
							OnResponse: function (aResponse) {
								lResponse = aResponse;
								lConn.close();
							}
						});
					} else {
						lResponse = {
							code: -1,
							msg: 'failure'
						};
					}
				}
			});

			// wait for result, consider reasonable timeout
			waitsFor(
					function () {
						return (null !== lResponse);
					},
					lSpec,
					5000
					);

			// check the result
			runs(function () {
				expect(lResponse.code).toEqual(0);
			});
		});
	},
	// this spec tests the change algorithm feature
	testChangeAlgorithm1: function () {
		var lSpec = "Change Algorithm ( valid argument )";
		var lResponse = null;

		it(lSpec, function () {

			// perform the change algorithm  on the server
			jws.Tests.getAdminTestConn().lbChangeAlgorithm(1, {
				OnResponse: function (aResponse) {
					if (aResponse.code > -1) {
						this.lbChangeAlgorithm(2, {
							OnResponse: function (aResponse) {
								if (aResponse.code > -1) {
									this.lbChangeAlgorithm(3, {
										OnResponse: function (aResponse) {
											lResponse = aResponse;
										}
									});
								}
							}
						});
					}
				}
			});

			// wait for result, consider reasonable timeout
			waitsFor(
					function () {
						return(null !== lResponse);
					},
					lSpec,
					2000
					);

			// check the result
			runs(function () {
				expect(lResponse.code).toEqual(0);
			});
		});
	},
	// this spec tests the change algorithm feature
	testChangeAlgorithm2: function () {
		var lSpec = "Change Algorithm ( invalid argument )";
		var lResponse = null;

		it(lSpec, function () {

			// perform the change algorithm  on the server
			jws.Tests.getAdminTestConn().lbChangeAlgorithm(6, {
				OnResponse: function (aResponse) {
					lResponse = aResponse;
				}
			});

			// wait for result, consider reasonable timeout
			waitsFor(
					function () {
						return(null !== lResponse);
					},
					lSpec,
					2000
					);

			// check the result
			runs(function () {
				expect(lResponse.code).toEqual(-1);
			});
		});
	},
	// this spec tests the sticky routes feature
	testStickyRoutes: function ( ) {
		var lSpec = "Sticky routes ()";
		var lResponse = null;

		it(lSpec, function () {

			// perform the sticky routes feature on the server
			jws.Tests.getAdminTestConn().lbStickyRoutes({
				OnResponse: function (aResponse) {
					lResponse = aResponse;
				}
			});

			// wait for result, consider reasonable timeout
			waitsFor(
					function () {
						return (null !== lResponse);
					},
					lSpec,
					2000
					);

			// check the result
			runs(function () {
				expect(lResponse.code).toEqual(0);
			});
		});
	},
	// this spec tests the test services feature
	testServices: function ( ) {
		var lSpec = "Testing services()";
		it(lSpec, function () {
			var lResponses = [];
			var lClusters = [];

			// perform the clusters information feature on the server
			jws.Tests.getAdminTestConn().lbClustersInfo({
				OnResponse: function (aResponse) {
					lClusters = aResponse.data;

					for (var lPos = 0; lPos < lClusters.length; lPos++) {
						jws.Tests.getAdminTestConn().sendToken({
							ns: lClusters[lPos].clusterNS,
							type: 'test'
						}, {
							OnResponse: function (aResponse) {
								lResponses.push(aResponse);
							}
						});
					}
				}
			});

			// wait for result, consider reasonable timeout
			waitsFor(
					function () {
						return (lResponses.length === lClusters.length);
					},
					lSpec,
					2000
					);

			// check the result
			runs(function () {
				for (var lPos = 0; lPos < lResponses.length; lPos++) {
					expect(lResponses[lPos].type).toEqual('response');
					expect(lResponses[lPos].reqType).toEqual('test');
				}
			});
		});
	},
	// this spec tests the shutdown service endpoint feature
	testShutdownEndPoint1: function () {
		var lSpec = "Shutdown service ( invalid password, valid endPointId, valid service )";
		var lResponse = null;

		it(lSpec, function () {

			// perform the clusters information feature on the server
			jws.Tests.getAdminTestConn().lbClustersInfo({
				OnResponse: function (aResponse) {
					var lClusterInfoValues = aResponse.data;

					// perform the create sample service on the server
					// with valid credential and valid arguments
					jws.Tests.getAdminTestConn().lbSampleService(
							lClusterInfoValues[0].clusterAlias, "admin", {
						nameSpace: lClusterInfoValues[0].clusterNS,
						OnSuccess: function (aResponse) {
							jws.tests.LoadBalancer.mEndPointId = aResponse.endPointId;
							jws.tests.LoadBalancer.mClusterAlias = lClusterInfoValues[0].clusterAlias;

							// perform the shutdown feature an specific service endpoint
							// with invalid credential and valid arguments
							jws.Tests.getAdminTestConn().lbShutdownEndPoint(
									jws.tests.LoadBalancer.mClusterAlias,
									"wrongPassword",
									jws.tests.LoadBalancer.mEndPointId, {
										OnResponse: function (aResponse) {
											lResponse = aResponse;
										}
									});
						}
					});
				}
			});

			// wait for result, consider reasonable timeout
			waitsFor(
					function () {
						return(null !== lResponse);
					},
					lSpec,
					3000
					);

			// check the result
			runs(function () {
				expect(lResponse.code).toEqual(-1);
			});
		});
	},
	// this spec tests the shutdown service endpoint feature
	testShutdownEndPoint2: function () {
		var lSpec = "Shutdown service ( valid password, invalid endPointId, invalid service )";
		var lResponse = null;

		it(lSpec, function () {

			// perform the shutdown feature an specific service endpoint
			// with valid credential and invalid arguments
			jws.Tests.getAdminTestConn().lbShutdownEndPoint("wrongClusterAlias", "admin", "wrongEndPointId", {
				OnResponse: function (aResponse) {
					lResponse = aResponse;
				}
			});

			// wait for result, consider reasonable timeout
			waitsFor(
					function () {
						return(null !== lResponse);
					},
					lSpec,
					3000
					);

			// check the result
			runs(function () {
				expect(lResponse.code).toEqual(-1);
			});
		});
	},
	// this spec tests the shutdown service endpoint feature
	testShutdownEndPoint3: function () {
		var lSpec = "Shutdown service ( invalid password, invalid endPointId, invalid service )";
		var lResponse = null;

		it(lSpec, function () {

			// perform the shutdown feature an specific service endpoint
			// with invalid credential and invalid arguments
			jws.Tests.getAdminTestConn().lbShutdownEndPoint(
					"wrongClusterAlias", "wrongPassword", "wrongEndPointId", {
						OnResponse: function (aResponse) {
							lResponse = aResponse;
						}
					});

			// wait for result, consider reasonable timeout
			waitsFor(
					function () {
						return(null !== lResponse);
					},
					lSpec,
					3000
					);

			// check the result
			runs(function () {
				expect(lResponse.code).toEqual(-1);
			});
		});
	},
	// this spec tests the shutdown service endpoint feature
	testShutdownEndPoint4: function () {
		var lSpec = "Shutdown service ( valid password, valid endPointId, valid service )";
		var lResponse = null;

		it(lSpec, function () {

			// perform the shutdown feature an specific service endpoint
			// with valid credential and invalid arguments
			jws.Tests.getAdminTestConn().lbShutdownEndPoint(
					jws.tests.LoadBalancer.mClusterAlias,
					"admin",
					jws.tests.LoadBalancer.mEndPointId, {
						OnResponse: function (aResponse) {
							lResponse = aResponse;
						}
					});

			// wait for result, consider reasonable timeout
			waitsFor(
					function () {
						return(null !== lResponse);
					},
					lSpec,
					3000
					);

			// check the result
			runs(function () {
				expect(lResponse.code).toEqual(0);
			});
		});
	},
	// this spec tests the deregister service endpoint feature
	testDeregisterServiceEndPoint1: function () {
		var lSpec = "Deregister service ( invalid password, valid endPointId, valid service )";
		var lResponse = null;

		it(lSpec, function () {

			// perform the clusters information feature on the server
			jws.Tests.getAdminTestConn().lbClustersInfo({
				OnResponse: function (aResponse) {
					var lClusterInfoValues = aResponse.data;

					// perform the create sample service on the server
					// with valid credential and valid arguments
					jws.tests.LoadBalancer.mDeregisterConn = jws.Tests.getAdminTestConn().lbSampleService(
							lClusterInfoValues[0].clusterAlias, 'admin', {
						nameSpace: lClusterInfoValues[0].clusterNS,
						OnSuccess: function (aResponse) {
							jws.tests.LoadBalancer.mEndPointId = aResponse.endPointId;
							jws.tests.LoadBalancer.mClusterAlias = lClusterInfoValues[0].clusterAlias;

							// perform the deregister feature an specific service endpoint
							// with invalid credential and valid arguments
							jws.Tests.getAdminTestConn().lbDeregisterServiceEndPoint(
									jws.tests.LoadBalancer.mClusterAlias,
									"wrongPassword",
									jws.tests.LoadBalancer.mEndPointId, {
										OnResponse: function (aResponse) {
											lResponse = aResponse;
										}
									});
						}
					});
				}
			});

			// wait for result, consider reasonable timeout
			waitsFor(
					function () {
						return(null !== lResponse);
					},
					lSpec,
					3000
					);

			// check the result
			runs(function () {
				expect(lResponse.code).toEqual(-1);
			});
		});
	},
	// this spec tests the deregister service endpoint feature
	testDeregisterServiceEndPoint2: function () {
		var lSpec = "Deregister service ( valid password, invalid endPointId, invalid service )";
		var lResponse = null;

		it(lSpec, function () {

			// perform the shutdown feature an specific service endpoint
			// with valid credential and invalid arguments
			jws.Tests.getAdminTestConn().lbDeregisterServiceEndPoint(
					"wrongClusterAlias", "admin", "wrongEndPointId", {
						OnResponse: function (aResponse) {
							lResponse = aResponse;
						}
					});

			// wait for result, consider reasonable timeout
			waitsFor(
					function () {
						return(null !== lResponse);
					},
					lSpec,
					3000
					);

			// check the result
			runs(function () {
				expect(lResponse.code).toEqual(-1);
			});
		});
	},
	// this spec tests the deregister service endpoint feature
	testDeregisterServiceEndPoint3: function () {
		var lSpec = "Deregister service ( invalid password, invalid endPointId, invalid service )";
		var lResponse = null;

		it(lSpec, function () {

			// perform the deregister feature an specific service endpoint
			// with invalid credential and invalid arguments
			jws.Tests.getAdminTestConn().lbDeregisterServiceEndPoint(
					"wrongClusterAlias", "wrongPassword", "wrongEndPointId", {
						OnResponse: function (aResponse) {
							lResponse = aResponse;
						}
					});

			// wait for result, consider reasonable timeout
			waitsFor(
					function () {
						return(null !== lResponse);
					},
					lSpec,
					3000
					);

			// check the result
			runs(function () {
				expect(lResponse.code).toEqual(-1);
			});
		});
	},
	// this spec tests the deregister service endpoint feature
	testDeregisterServiceEndPoint4: function () {
		var lSpec = "Deregister service ( valid password, valid endPointId, valid service )";
		var lResponse = null;

		it(lSpec, function () {

			// perform the deregister feature an specific service endpoint
			// with valid credential and invalid arguments
			jws.Tests.getAdminTestConn().lbDeregisterServiceEndPoint(
					jws.tests.LoadBalancer.mClusterAlias,
					"admin",
					jws.tests.LoadBalancer.mEndPointId, {
						OnResponse: function (aResponse) {
							lResponse = aResponse;
							jws.tests.LoadBalancer.mDeregisterConn.close();
						}
					});

			// wait for result, consider reasonable timeout
			waitsFor(
					function () {
						return(null !== lResponse);
					},
					lSpec,
					3000
					);

			// check the result
			runs(function () {
				expect(lResponse.code).toEqual(0);
			});
		});
	},
	runSpecs: function () {

		//run alls tests
		this.testClustersInfo();

		this.testRegisterServiceEndPoint1();
		this.testRegisterServiceEndPoint2();
		this.testRegisterServiceEndPoint3();
		this.testRegisterServiceEndPoint4();

		this.testStickyRoutes();

		this.testChangeAlgorithm1();
		this.testChangeAlgorithm2();

		this.testServices();


		this.testShutdownEndPoint1();
		this.testShutdownEndPoint2();
		this.testShutdownEndPoint3();
		this.testShutdownEndPoint4();

		this.testDeregisterServiceEndPoint1();
		this.testDeregisterServiceEndPoint2();
		this.testDeregisterServiceEndPoint3();
		this.testDeregisterServiceEndPoint4();
	}
};
//	---------------------------------------------------------------------------
//	jWebSocket System Plug-in test specs (Community Edition, CE)
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
if (typeof jws.tests === "undefined") {
	jws.tests = {};
}
jws.tests.Load = {
	title: "Load tests",
	description: "jWebSocket server performance tests.",
	category: "Server Benchmarks",
	// this spec tests the speed of a complete client connection to the server
	testConcurrentConnections: function(aAmount, aFlag) {
		var lSpec = "Trying to establish " + aAmount + " concurrent connections...";
		it(lSpec, function() {
			var lConnected = 0;
			var lConns = [];

			if (jws.isIExplorer()) {
				waitsFor(
						function() {
							return(aFlag.running == 0);
						},
						'waiting for previous test round',
						10000
						);

				runs(function() {
					aFlag.running = aAmount;
					for (var lIdx = 0; lIdx < aAmount; lIdx++) {
						lConns[ lIdx ] = new jws.jWebSocketJSONClient();
						lConns[ lIdx ].setParam("connectionIndex", lIdx);
						lConns[ lIdx ].open(jws.getDefaultServerURL(), {
							OnWelcome: function(aToken) {
								lConnected++;
							},
							OnClose: function() {
								aFlag.running--;
							}
						});
					}
				});
			} else {
				for (var lIdx = 0; lIdx < aAmount; lIdx++) {
					lConns[ lIdx ] = new jws.jWebSocketJSONClient();
					lConns[ lIdx ].setParam("connectionIndex", lIdx);
					lConns[ lIdx ].open(jws.getDefaultServerURL(), {
						OnWelcome: function(aToken) {
							lConnected++;
						}
					});
				}
			}
			waitsFor(
					// wait a maximum of 300ms per connection
							function() {
								return(lConnected == aAmount);
							},
							lSpec,
							aAmount * 500
							);

					runs(function() {
						expect(lConnected).toEqual(aAmount);
						for (var lIdx = 0, lCnt = lConns.length; lIdx < lCnt; lIdx++) {
							if (jws.isIExplorer()) {
								lConns[ lIdx ].close({
									fireClose: true
								});
							} else {
								lConns[ lIdx ].close();
							}
						}
					});
				});
	},
	// this spec tests the send method of the system plug-in by sending
	// this spec requires an established connection
	testEcho: function() {
		var lSpec = "Send and Loopback";
		it(lSpec, function() {

			// we need to "control" the server to broadcast to all connections here
			var lResponse = {};
			var lMsg = "This is my message";

			// open a separate control connection
			var lToken = {
				ns: jws.NS_SYSTEM,
				type: "send",
				targetId: jws.Tests.getAdminTestConn().getId(),
				sourceId: jws.Tests.getAdminTestConn().getId(),
				sender: jws.Tests.getAdminTestConn().getUsername(),
				data: lMsg
			};

			var lListener = function(aToken) {
				if ("org.jwebsocket.plugins.system" == aToken.ns
						&& "send" == aToken.type) {
					lResponse = aToken;
				}
			};

			jws.Tests.getAdminTestConn().addListener(lListener);
			jws.Tests.getAdminTestConn().sendToken(lToken);

			waitsFor(
					function() {
						return(lResponse.data == lMsg);
					},
					lSpec,
					1500
					);

			runs(function() {
				expect(lResponse.data).toEqual(lMsg);
				jws.Tests.getAdminTestConn().removeListener(lListener);
			});

		});
	},
	runSpecs: function() {
		// jws.tests.System.testEcho();

		// considering that IE only supports 6 concurrent WebSocket connections
		var lConcurrentConnections = (jws.isIExplorer()) ? (4 - ($('#tls_set').val() === 'wss' ? 2 : 0)) : 10;

		// creating connections
		var lFlag = {running: 0};
		for (var lIndex = 0; lIndex < 10; lIndex++) {
			jws.tests.Load.testConcurrentConnections(lConcurrentConnections, lFlag);
		}
	}
};

//	---------------------------------------------------------------------------
//	jWebSocket Logging-Plug-in test specs (Community Edition, CE)
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
if (typeof jws.tests === "undefined") {
	jws.tests = {};
}
jws.tests.Logging = {
	title: "Logging plug-in",
	description: "jWebSocket logging plug-in",
	category: "Community Edition",
	enabled: false,
	TABLE: "SYSTEM_LOG",
	PRIMARY_KEY: "ID",
	SEQUENCE: "SQ_PK_SYSTEM_LOG",
	MESSAGE: "This is an message from the automated test suite.",
	mLogId: null,
	dependsOn: [{
			plugInId: "jws.logging"
		}],
	// this spec tests the file save method of the fileSystem plug-in
	testLog: function () {
		var lSpec = "LogEvent";

		it(lSpec, function () {

			var lResponse = {};
			var lNow = new Date();
			var lFlashBridgeVer = "n/a";
			if (swfobject) {
				var lInfo = swfobject.getFlashPlayerVersion();
				lFlashBridgeVer = lInfo.major + "." + lInfo.minor + "." + lInfo.release;
			}
			var lData = {
				"event_type": "loggingTest",
				"customer": "jWebSocket.org",
				"app_name": "jWebSocket",
				"app_version": jws.VERSION,
				"app_module": "test automation",
				"app_dialog": "full tests",
				"user_name": jws.Tests.getAdminTestConn().getUsername(),
				"data_size": jws.tests.Logging.MESSAGE.length,
				"url": jws.Tests.getAdminTestConn().getURL(),
				"message": jws.tests.Logging.MESSAGE,
				"browser": jws.getBrowserName(),
				"browser_version": jws.getBrowserVersionString(),
				"ws_version": (
						jws.browserSupportsNativeWebSockets
						? "native"
						: "flash " + lFlashBridgeVer
						),
				"json": JSON.stringify({
					userAgent: navigator.userAgent
				}),
				"ip": "${ip}",
				"time_stamp":
						// jws.tools.dateToISO( lNow )
						/* oracle 
						 "TO_DATE('" +
						 lNow.getUTCFullYear().toString() + "/" +
						 jws.tools.zerofill( lNow.getUTCMonth() + 1, 2 ) + "/" +
						 jws.tools.zerofill( lNow.getUTCDate(), 2 ) + " " +
						 jws.tools.zerofill( lNow.getUTCHours(), 2 ) + "/" +
						 jws.tools.zerofill( lNow.getUTCMinutes(), 2 ) + "/" +
						 jws.tools.zerofill( lNow.getUTCSeconds(), 2 ) +
						 "','YYYY/MM/DD HH24/MI/SS')"
						 */
						/* mysql */
						lNow.getUTCFullYear().toString() + "-" +
						+jws.tools.zerofill(lNow.getUTCMonth() + 1, 2) + "-"
						+ jws.tools.zerofill(lNow.getUTCDate(), 2) + " "
						+ jws.tools.zerofill(lNow.getUTCHours(), 2) + ":"
						+ jws.tools.zerofill(lNow.getUTCMinutes(), 2) + ":"
						+ jws.tools.zerofill(lNow.getUTCSeconds(), 2) + "."
						+ jws.tools.zerofill(lNow.getUTCMilliseconds(), 3)
			};
			jws.Tests.getAdminTestConn().loggingEvent(jws.tests.Logging.TABLE, lData, {
				primaryKey: jws.tests.Logging.PRIMARY_KEY,
				sequence: jws.tests.Logging.SEQUENCE,
				OnResponse: function (aToken) {
					lResponse = aToken;
					jws.tests.Logging.mLogId = lResponse.key;
				}
			});

			waitsFor(
					function () {
						return(lResponse.rowsAffected && lResponse.rowsAffected[0] == 1 && lResponse.key > 0);
					},
					lSpec,
					1500
					);

			runs(function () {
				expect(lResponse.rowsAffected[0]).toEqual(1);
			});

		});
	},
	// this spec tests the file save method of the fileSystem plug-in
	testGetLog: function () {
		var lSpec = "GetLog";

		it(lSpec, function () {

			var lResponse = {};
			var lDone = false;
			jws.Tests.getAdminTestConn().loggingGetEvents(jws.tests.Logging.TABLE, {
				primaryKey: jws.tests.Logging.PRIMARY_KEY,
				fromKey: jws.tests.Logging.mLogId,
				toKey: jws.tests.Logging.mLogId,
				OnResponse: function (aToken) {
					lResponse = aToken;
					// check if only one row is returned
					if (lResponse.data.length == 1) {
						// check if the row contains the message previously sent.
						var lRow = lResponse.data[ 0 ];
						for (var lIdx = 0, lCnt = lRow.length; lIdx < lCnt; lIdx++) {
							if (lRow[ lIdx ] == jws.tests.Logging.MESSAGE) {
								lDone = true;
								break;
							}
						}
					}
				}
			});

			waitsFor(
					function () {
						return(lDone == true);
					},
					lSpec,
					1500
					);

			runs(function () {
				expect(lDone).toEqual(true);
			});

		});
	},
	runSpecs: function () {
		this.testLog();
		this.testGetLog();
	}
};//	---------------------------------------------------------------------------
//	jWebSocket Reporting Plug-in test specs (Community Edition, CE)
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
if (typeof jws.tests === "undefined") {
	jws.tests = {};
}
jws.tests.Quota = {
	title: "Quota plug-in",
	description: "jWebSocket Quota plug-in automated functional tests",
	category: "Community Edition",
	NS: "jws.tests.quota",
	NS_PLUGIN: "org.jwebsocket.plugins.quota",
	NS_QUOTA_TEST: "org.jwebsocket.plugins.testingQuota",
	//Quota detail for testing
	QUOTA_IDENTIFIER: "CountDown",
	QUOTA_INSTANCE: "defaultUser",
	QUOTA_INSTANCE_TYPE: "Group",
	QUOTA_ACTIONS: "*",
	QUOTA_INSTANCE_REG: "guest",
	dependsOn: [{
			plugInId: "jws.quota"
		}],
	refObject: {},
	// this spec tests the 'get report templates' feature 
	testCreateQuota: function (aIdentifier, aValue, aInstance, aInstanceType,
			aActions, aExpectedCode, aRefObject) {

		var lMe = this;
		var lSpec = this.NS + ": create quota (admin)";
		it(lSpec, function () {
			var lResponse = null;

			jws.Tests.getAdminTestConn().createQuota(
					aIdentifier, lMe.NS_QUOTA_TEST,
					aInstance, aInstanceType, aActions, 5, {
						OnResponse: function (aToken) {
							lResponse = aToken;
							aRefObject.uuid = aToken.uuid;
						}
					}
			);

			// wait for result, consider reasonable timeout
			waitsFor(
					function () {
						// check response
						return(null != lResponse);
					},
					lSpec,
					1500
					);

			// check the result 
			runs(function () {
				expect(aExpectedCode).toEqual(lResponse.code);
			});
		});
	},
	testGetQuota: function (aIdentifier, aInstance, aInstanceType,
			aActions, aExpectedCode, aRefObject) {

		var lMe = this;
		var lSpec = this.NS + ": get quota (admin)";
		it(lSpec, function () {
			var lResponse = null;

			jws.Tests.getAdminTestConn().getQuota(aIdentifier, lMe.NS_QUOTA_TEST,
					aInstance, aInstanceType, aActions, {
						OnResponse: function (aToken) {
							lResponse = aToken;
						}
					});

			// wait for result, consider reasonable timeout
			waitsFor(
					function () {
						// check response
						return(null != lResponse);
					},
					lSpec, 1500
					);

			// check the result 
			runs(function () {
				expect(aExpectedCode).toEqual(lResponse.code);
				expect("*").toEqual(lResponse.actions);
				expect("defaultUser").toEqual(lResponse.instance);
				expect(aRefObject.uuid).toEqual(lResponse.uuid);
			});
		});
	},
	testUnregisterQuota: function (aIdentifier, aInstance, aExpectedCode, aRefObject) {

		var lSpec = this.NS + ": unregister quota (admin)";
		it(lSpec, function () {
			var lResponse = null;

			// perform the get report templates feature on the server
			jws.Tests.getAdminTestConn().unregisterQuota(aIdentifier, aInstance,
					aRefObject.uuid, {
						OnResponse: function (aToken) {
							lResponse = aToken;
						}
					});
			// wait for result, consider reasonable timeout
			waitsFor(
					function () {
						// check response
						return(null != lResponse);
					}, lSpec, 1500
					);
			// check the result 
			runs(function () {
				expect(aExpectedCode).toEqual(lResponse.code);
				//expect(lResponse.).toEqual(lResponse.code);
			});

		});
	},
	/**
	 * 
	 * @param {type} aIdentifier
	 * @param {type} aInstance
	 * @param {type} aInstance_type
	 * @param {type} aExpectedCode
	 * @returns {undefined}
	 */
	testRegisterQuota: function (aIdentifier, aInstance, aInstance_type,
			aExpectedCode, aRefObject) {

		var lMe = this;
		var lSpec = this.NS + ": register quota (admin)";
		it(lSpec, function () {
			var lResponse = null;

			//retgister the quota on the server
			jws.Tests.getAdminTestConn().registerQuota(aIdentifier, aInstance,
					aRefObject.uuid, {
						OnResponse: function (aToken) {
							lResponse = aToken;
						}
					});
			// wait for result, consider reasonable timeout
			waitsFor(
					function () {
						// check response
						return(null != lResponse);
					},
					lSpec,
					1500
					);
			// check the result 
			runs(function () {
				expect(aExpectedCode).toEqual(lResponse.code);
				expect(lMe.QUOTA_INSTANCE_REG).toEqual(lResponse.instance);
				expect(aRefObject.uuid).toEqual(lResponse.uuid);
				//expect(lResponse.).toEqual(lResponse.code);
			});
		});
	},
	/**
	 * 
	 * @param {type} aIdentifier
	 * @param {type} aInstance
	 * @param {type} aInstanceType
	 * @param {type} aValue
	 * @param {type} ExpectedValue
	 * @param {type} aExpectedCode
	 * @returns {undefined}
	 */
	testReduceQuota: function (aIdentifier, aInstance, aInstanceType, aActions,
			aValue, ExpectedValue, aExpectedCode) {

		var lMe = this;
		var lSpec = this.NS + ": reduce quota (admin)";
		it(lSpec, function () {
			var lResponse = null;

			// perform the get report templates feature on the server
			jws.Tests.getAdminTestConn().reduceQuota(aIdentifier,
					lMe.NS_QUOTA_TEST, aInstance, aInstanceType, aActions, aValue, {
						OnResponse: function (aToken) {
							lResponse = aToken;
						}
					});
			// wait for result, consider reasonable timeout
			waitsFor(
					function () {
						// check response
						return(null != lResponse);
					},
					lSpec,
					1500
					);
			// check the result 
			runs(function () {
				expect(aExpectedCode).toEqual(lResponse.code);
				expect(ExpectedValue).toEqual(lResponse.value);
			});
		});
	},
	testReduceQuotaByUuid: function (aIdentifier, aInstance, aValue, ExpectedValue,
			aExpectedCode, aRefObject) {

		var lSpec = this.NS + ": reduce quota by uuid (admin)";
		it(lSpec, function () {
			var lResponse = null;

			//aIdentifier, aInstance, aUuid, aValue
			// perform the get report templates feature on the server
			jws.Tests.getAdminTestConn().reduceQuotaByUuid(aIdentifier, aInstance,
					aRefObject.uuid, aValue, {
						OnResponse: function (aToken) {
							lResponse = aToken;
						}
					});

			// wait for result, consider reasonable timeout
			waitsFor(
					function () {
						// check response
						return(null != lResponse);
					},
					lSpec,
					1500
					);

			// check the result 
			runs(function () {
				expect(aExpectedCode).toEqual(lResponse.code);
				expect(ExpectedValue).toEqual(lResponse.value);
				//expect(lResponse.).toEqual(lResponse.code);
			});
		});
	},
	testSetQuota: function (aIdentifier, aInstance, aInstanceType, aActions,
			aValue, ExpectedValue, aExpectedCode) {
		var lMe = this;

		var lSpec = this.NS + ": set quota (admin)";
		it(lSpec, function () {

			var lResponse = null;


			//aIdentifier, aInstance, aUuid, aValue
			jws.Tests.getAdminTestConn().setQuota(aIdentifier, lMe.NS_QUOTA_TEST,
					aInstance, aInstanceType, aActions, aValue, {
						OnResponse: function (aToken) {
							lResponse = aToken;
						}
					});

			// wait for result, consider reasonable timeout
			waitsFor(
					function () {
						// check response
						return(null != lResponse);
					},
					lSpec,
					1500
					);

			// check the result 
			runs(function () {
				expect(aExpectedCode).toEqual(lResponse.code);
				expect(ExpectedValue).toEqual(lResponse.value);
				//expect(lResponse.).toEqual(lResponse.code);
			});
		});
	},
	testSetQuotaByUuid: function (aIdentifier, aInstance, aValue, ExpectedValue,
			aExpectedCode, aRefObject) {

		var lSpec = this.NS + ": set quota by uuid (admin)";
		it(lSpec, function () {
			var lResponse = null;


			jws.Tests.getAdminTestConn().setQuotaByUuid(aIdentifier, aInstance,
					aRefObject.uuid, aValue, {
						OnResponse: function (aToken) {
							lResponse = aToken;
						}
					});

			// wait for result, consider reasonable timeout
			waitsFor(
					function () {
						// check response
						return(null != lResponse);
					},
					lSpec,
					1500
					);

			// check the result 
			runs(function () {
				expect(aExpectedCode).toEqual(lResponse.code);
				expect(ExpectedValue).toEqual(lResponse.value);
				//expect(lResponse.).toEqual(lResponse.code);
			});
		});
	},
	testIncreaseQuotaByUuid: function (aIdentifier, aInstance, aValue, ExpectedValue,
			aExpectedCode, aRefObject) {

		var lSpec = this.NS + ": increase quota by uuid (admin)";
		it(lSpec, function () {
			var lResponse = null;

			jws.Tests.getAdminTestConn().increaseQuotaByUuid(aIdentifier,
					aInstance, aRefObject.uuid, aValue, {
						OnResponse: function (aToken) {
							lResponse = aToken;
						}
					});

			// wait for result, consider reasonable timeout
			waitsFor(
					function () {
						// check response
						return(null != lResponse);
					},
					lSpec,
					1500
					);

			// check the result 
			runs(function () {
				expect(aExpectedCode).toEqual(lResponse.code);
				expect(ExpectedValue).toEqual(lResponse.value);
				//expect(lResponse.).toEqual(lResponse.code);
			});
		});
	},
	testIncreaseQuota: function (aIdentifier, aInstance, aInstanceType, aActions,
			aValue, ExpectedValue, aExpectedCode) {
		var lMe = this;

		var lSpec = this.NS + ": increase quota (admin)";
		it(lSpec, function () {
			var lResponse = null;

			var lToken = {
				ns: lMe.NS_PLUGIN,
				type: "increaseQuota",
				namespace: lMe.NS_QUOTA_TEST,
				instance: aInstance,
				instance_type: aInstanceType,
				identifier: aIdentifier,
				actions: aActions,
				value: aValue
			};

			jws.Tests.getAdminTestConn().increaseQuota(aIdentifier, lMe.NS_QUOTA_TEST,
					aInstance, aInstanceType, aActions, aValue, {
						OnResponse: function (aToken) {
							lResponse = aToken;
						}
					});

			// wait for result, consider reasonable timeout
			waitsFor(
					function () {
						// check response
						return(null != lResponse);
					},
					lSpec,
					1500
					);

			// check the result 
			runs(function () {
				expect(aExpectedCode).toEqual(lResponse.code);
				expect(ExpectedValue).toEqual(lResponse.value);
				//expect(lResponse.).toEqual(lResponse.code);
			});
		});
	},
	runSpecs: function () {

		//run alls tests within an outer test suite
		//create a temporary quota to testing all operations with
		this.testCreateQuota(this.QUOTA_IDENTIFIER, 5, this.QUOTA_INSTANCE,
				this.QUOTA_INSTANCE_TYPE, this.QUOTA_ACTIONS, 0, this.refObject);

		this.testCreateQuota(this.QUOTA_IDENTIFIER, 5, this.QUOTA_INSTANCE,
				this.QUOTA_INSTANCE_TYPE, this.QUOTA_ACTIONS, -1, {});


		this.testGetQuota(this.QUOTA_IDENTIFIER, this.QUOTA_INSTANCE,
				this.QUOTA_INSTANCE_TYPE, this.QUOTA_ACTIONS, 0, this.refObject);

		this.testRegisterQuota(this.QUOTA_IDENTIFIER, this.QUOTA_INSTANCE_REG,
				"User", 0, this.refObject);

		this.testReduceQuota(this.QUOTA_IDENTIFIER, this.QUOTA_INSTANCE_REG,
				"User", this.QUOTA_ACTIONS, 2, 3, 0);

		this.testReduceQuotaByUuid(this.QUOTA_IDENTIFIER, this.QUOTA_INSTANCE_REG,
				1, 2, 0, this.refObject);

		this.testSetQuota(this.QUOTA_IDENTIFIER, this.QUOTA_INSTANCE,
				this.QUOTA_INSTANCE_TYPE, this.QUOTA_ACTIONS, 5, 5, 0);

		this.testSetQuotaByUuid(this.QUOTA_IDENTIFIER, this.QUOTA_INSTANCE_REG,
				10, 10, 0, this.refObject);

		this.testIncreaseQuota(this.QUOTA_IDENTIFIER, this.QUOTA_INSTANCE_REG,
				"User", this.QUOTA_ACTIONS, 2, 12, 0);

		this.testIncreaseQuotaByUuid(this.QUOTA_IDENTIFIER, this.QUOTA_INSTANCE_REG,
				3, 15, 0, this.refObject);

		this.testUnregisterQuota(this.QUOTA_IDENTIFIER, this.QUOTA_INSTANCE,
				0, this.refObject);
	}
};//	---------------------------------------------------------------------------
//	jWebSocket Reporting Plug-in test specs (Community Edition, CE)
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
if (typeof jws.tests === "undefined") {
	jws.tests = {};
}
// requires web/res/js/jwsReportingPlugIn.js previously loaded
jws.tests.Reporting = {
	title: "Reporting plug-in",
	description: "jWebSocket reporting plug-in for application reports generation",
	category: "Community Edition",
	dependsOn: [{
			plugInId: "jws.reporting"
		}],
	// this spec tests the 'get report templates' feature 
	testGetReports: function () {

		var lSpec = "get report templates(admin)";
		it(lSpec, function () {
			var lResponse = null;

			// perform the get report templates feature on the server
			jws.Tests.getAdminTestConn().reportingGetReports({
				OnResponse: function (aToken) {
					lResponse = aToken;
				}
			}
			);

			// wait for result, consider reasonable timeout
			waitsFor(
					function () {
						// check response
						return(null != lResponse);
					},
					lSpec,
					1500
					);

			// check the result 
			runs(function () {
				expect(lResponse.code).toEqual(0);
				expect(lResponse.data.indexOf("jWebSocketContactReport") > -1).toEqual(true);
			});

		});
	},
	// this spec tests the generateReport feature
	testGenerateReport: function (aReportName, aParams, aFields) {

		var lSpec = "generateReport(" + aReportName + "," + aFields + "," + aParams + ")";
		it(lSpec, function () {
			var lResponse = null;

			// perform the generate reports on the server
			jws.Tests.getAdminTestConn().reportingGenerateReport(
					aReportName,
					aParams,
					aFields,
					{
						OnResponse: function (aToken) {
							lResponse = aToken;
						}
					}
			);

			// wait for result, consider reasonable timeout
			waitsFor(
					function () {
						return(null != lResponse);
					},
					lSpec,
					5000
					);

			// check the result 
			runs(function () {
				expect(lResponse.code).toEqual(0);
				expect(lResponse.path.indexOf("jWebSocketContactReport.pdf") > -1);

				jws.Tests.getAdminTestConn().fileLoad(lResponse.path, jws.FileSystemPlugIn.ALIAS_PRIVATE, {
					OnSuccess: function (aToken) {
						if (!jws.isIExplorer())
							window.open("data:application/pdf;base64," + aToken.data, "_blank");
					}
				});
			});
		});
	},
	testGenerateJDBCReport: function (aReportName, aParams, aFields) {

		var lSpec = "generateReport(" + aReportName + "," + aFields + "," + aParams + ")";
		it(lSpec, function () {
			var lResponse = null;

			// perform the generate reports on the server
			jws.Tests.getAdminTestConn().reportingGenerateReport(
					aReportName,
					aParams,
					aFields,
					{
						useJDBCConnection: true,
						connectionAlias: "default",
						outputType: "pdf",
						OnResponse: function (aToken) {
							lResponse = aToken;
						}
					}
			);

			// wait for result, consider reasonable timeout
			waitsFor(
					function () {
						return(null != lResponse);
					},
					lSpec,
					5000
					);

			// check the result 
			runs(function () {
				expect(lResponse.code).toEqual(0);
				expect(lResponse.path.indexOf("jWebSocketContactReport.pdf") > -1);

				jws.Tests.getAdminTestConn().fileLoad(lResponse.path, jws.FileSystemPlugIn.ALIAS_PRIVATE, {
					OnSuccess: function (aToken) {
						if (!jws.isIExplorer())
							window.open("data:application/pdf;base64," + aToken.data, "_blank");
					}
				});
			});
		});
	},
	runSpecs: function () {
		this.testGetReports();

		// generate report calling args
		var lReportName = "jWebSocketContactReport";
		var lParams = {
			reportTitle: 'jWebSocket Contact Report'
		};
		var lFields = [
			{
				name: 'Alexander',
				lastName: 'Schulze',
				age: 40,
				email: 'a.schulze@jwebsocket.org'
			},
			{
				name: 'Rolando',
				lastName: 'Santamaria Maso',
				age: 27,
				email: 'rsantamaria@jwebsocket.org'
			},
			{
				name: 'Lisdey',
				lastName: 'Perez',
				age: 27,
				email: 'lperez@jwebsocket.org'
			},
			{
				name: 'Marcos',
				lastName: 'Gonzalez',
				age: 27,
				email: 'mgonzalez@jwebsocket.org,'
			},
			{
				name: 'Osvaldo',
				lastName: 'Aguilar',
				age: 27,
				email: 'oaguilar@jwebsocket.org,'
			},
			{
				name: 'Victor',
				lastName: 'Barzana',
				age: 27,
				email: 'vbarzana@jwebsocket.org,'
			},
			{
				name: 'Javier Alejandro',
				lastName: 'Puentes Serrano',
				age: 27,
				email: 'jpuentes@jwebsocket.org'
			}];

		this.testGenerateReport(lReportName, lParams, lFields);
		// generate report with jdbc connection
		lReportName = "JDBCExampleReport";

		// generating/creating the report
		this.testGenerateJDBCReport(lReportName, null, null);
	}
};//	---------------------------------------------------------------------------
//	jWebSocket REST Engine test specs (Community Edition, CE)
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
if (typeof jws.tests === "undefined") {
	jws.tests = {};
}
jws.tests.REST = {
	title: "REST support (http://localhost:8787/jWebSocket/http)",
	description: "jWebSocket REST support for remote interaction with the jWebSocket server infrastructure",
	category: "REST",
	connectionId: new Date().getTime(),
	checked: false,
	dependsOn: [{
			engineId: "org.jwebsocket.tomcat.TomcatEngine"
		}],
	getURL: function () {
		return "http://localhost:8787/jWebSocket/http?connectionId=" + jws.tests.REST.connectionId;
	},
	// this spec tests the 'open' feature 
	testOpen: function () {

		var lSpec = "open connection";
		it(lSpec, function () {
			var lResponse = null;
			$.getJSON(jws.tests.REST.getURL() + "&action=open", function (aJson) {
				lResponse = aJson;
			});

			// wait for result, consider reasonable timeout
			waitsFor(function () {
				return(null !== lResponse);
			}, lSpec, 1500);

			// check the result 
			runs(function () {
				expect(true).toEqual(true);
			});

		});
	},
	// this spec tests the 'login' feature 
	testLogin: function () {

		var lSpec = "login (root, root)";
		it(lSpec, function () {
			var lResponse = null;
			$.getJSON(jws.tests.REST.getURL() + "&action=login&username=root&password=root", function (aJson) {
				lResponse = aJson;
			});

			// wait for result, consider reasonable timeout
			waitsFor(function () {
				return(null !== lResponse);
			}, lSpec, 1500);

			// check the result 
			runs(function () {
				expect(lResponse.code).toEqual(0);
				expect(lResponse.username).toEqual("root");
			});

		});
	},
	// this spec tests the 'sync' feature 
	testSync: function () {

		var lSpec = "sync";
		it(lSpec, function () {
			var lResponse = null;
			$.getJSON(jws.tests.REST.getURL() + "&action=sync", function (aJson) {
				lResponse = aJson;
			});

			// wait for result, consider reasonable timeout
			waitsFor(function () {
				return(null !== lResponse);
			}, lSpec, 1500);

			// check the result 
			runs(function () {
				expect(jws.tools.getType(lResponse)).toEqual("array");
				expect(lResponse.length > 0).toEqual(true);
			});

		});
	},
	// this spec tests the 'login' feature 
	testSend: function () {

		var lSpec = "send (echo)";
		it(lSpec, function () {
			var lResponse = null;
			$.getJSON(jws.tests.REST.getURL() + "&action=send&data=" + JSON.stringify({
				ns: "org.jwebsocket.plugins.system",
				type: "echo",
				data: "REST"}), function (aJson) {
				lResponse = aJson;
			});

			// wait for result, consider reasonable timeout
			waitsFor(function () {
				return(null !== lResponse);
			}, lSpec, 1500);

			// check the result 
			runs(function () {
				expect(lResponse.code).toEqual(0);
				expect(lResponse.data).toEqual("REST");
			});

		});
	},
	// this spec tests the 'logout' feature 
	testLogout: function () {

		var lSpec = "logout (root)";
		it(lSpec, function () {
			var lResponse = null;
			$.getJSON(jws.tests.REST.getURL() + "&action=logout", function (aJson) {
				lResponse = aJson;
			});

			// wait for result, consider reasonable timeout
			waitsFor(function () {
				return(null !== lResponse);
			}, lSpec, 1500);

			// check the result 
			runs(function () {
				expect(lResponse.code).toEqual(0);
			});

		});
	},
	// this spec tests the 'close' feature 
	testClose: function () {

		var lSpec = "close connection";
		it(lSpec, function () {
			var lResponse = null;
			$.get(jws.tests.REST.getURL() + "&action=close", function (aResponse) {
				lResponse = aResponse;
			});

			// wait for result, consider reasonable timeout
			waitsFor(function () {
				return(null !== lResponse);
			}, lSpec, 1500);

			// check the result 
			runs(function () {
				expect(lResponse).toEqual("http.command.close");
			});

		});
	},
	runSpecs: function () {
		this.testOpen();
		this.testLogin();
		this.testSync();
		this.testSend();
		this.testLogout();
		this.testClose();
	}
};//	---------------------------------------------------------------------------
//	jWebSocket RPC-Plug-in test specs (Community Edition, CE)
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
if (typeof jws.tests === "undefined") {
	jws.tests = {};
}
jws.tests.RPC = {
	title: "RPC plug-in",
	description: "jWebSocket RPC plug-in",
	category: "Community Edition",
	TEST_STRING: "This is a string to be MD5'ed",
	dependsOn: [{
			plugInId: "jws.rpc"
		}],
	// this spec tests the file save method of the fileSystem plug-in
	testMD5Demo: function () {

		var lSpec = "MD5 demo (admin)";

		it(lSpec, function () {

			// init response
			var lResponse = {};

			var lClassName = "org.jwebsocket.rpc.sample.SampleRPCLibrary";
			var lMethodName = "getMD5";
			var lArguments = jws.tests.RPC.TEST_STRING;
			var lMD5 = jws.tools.calcMD5(jws.tests.RPC.TEST_STRING);

			// perform the Remote Procedure Call...
			jws.Tests.getAdminTestConn().rpc(
					// pass class, method and argument for server java method:
					lClassName,
					lMethodName,
					lArguments,
					{// run it within the main thread
						spawnThread: false,
						// new easy-to-use response callback
						OnResponse: function (aToken) {
							lResponse = aToken;
						}
					}
			);

			// wait for result, consider reasonably timeout
			waitsFor(
					function () {
						// check response
						return(lResponse.code !== undefined);
					},
					lSpec,
					3000
					);

			// check result if ok
			runs(function () {
				expect(lResponse.code).toEqual(0);
				expect(lResponse.result).toEqual(lMD5);
			});

		});
	},
	runSpecs: function () {
		// run alls tests within an outer test suite
		this.testMD5Demo();
	}
};//	---------------------------------------------------------------------------
//	jWebSocket ScriptingPlugIn test specs (Community Edition, CE)
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
if (typeof jws.tests === "undefined") {
	jws.tests = {};
}
jws.tests.Scripting = {
	title: "Scripting plug-in",
	description: "jWebSocket Scripting plug-in for server side script apps.",
	category: "System",
	scriptApps: {},
	TEST_APP1: "demoApp",
	TEST_APP2: "someApp",
	dependsOn: [{
			plugInId: "jws.scripting"
		}],
	testListScriptApps: function () {
		var self = this;
		var lSpec = "getting script apps list";

		it(lSpec, function () {
			var lResponse = null;
			jws.Tests.getAdminTestConn().listScriptApps({userOnly: true, namesOnly: false,
				OnResponse: function (aResponse) {
					lResponse = aResponse;
					self.scriptApps = aResponse.data;
				}
			});

			waitsFor(
					function () {
						return null !== lResponse;
					},
					lSpec,
					3000
					);

			runs(function () {
				expect(null !== lResponse.data[self.TEST_APP1]).toEqual(true);
				expect(null !== lResponse.data[self.TEST_APP2]).toEqual(true);
			});
		});
	},
	testGetVersion: function (aAppName) {
		var self = this;
		var lSpec = "getting script app version '" + aAppName + "'";

		it(lSpec, function () {
			var lResponse = null;
			jws.Tests.getAdminTestConn().getScriptAppVersion(aAppName, {
				OnResponse: function (aResponse) {
					lResponse = aResponse;
				}
			});

			waitsFor(
					function () {
						return null !== lResponse;
					},
					lSpec,
					3000
					);

			runs(function () {
				expect(self.scriptApps[aAppName].version).toEqual(lResponse.version);
			});
		});
	},
	testGetManifest: function (aAppName) {
		var self = this;
		var lSpec = "getting script app manifest '" + aAppName + "'";

		it(lSpec, function () {
			var lResponse = null;
			jws.Tests.getAdminTestConn().getScriptAppManifest(aAppName, {
				OnResponse: function (aResponse) {
					lResponse = aResponse;
				}
			});

			waitsFor(
					function () {
						return null !== lResponse;
					},
					lSpec,
					3000
					);

			runs(function () {
				expect(undefined !== lResponse.data.jws_version).toEqual(true);
				expect(undefined !== lResponse.data.language_ext).toEqual(true);
				expect(undefined !== lResponse.data.jws_dependencies).toEqual(true);
				expect(undefined !== lResponse.data.author).toEqual(true);
				expect(undefined !== lResponse.data.permissions).toEqual(true);
			});
		});
	},
	testReload: function (aAppName, aHotReload, aExpectedCode) {
		var self = this;
		var lSpec = "reloading script app '" + aAppName + "', hot reload: " + aHotReload
				+ ", expected code: " + aExpectedCode;

		it(lSpec, function () {
			var lResponse = null;
			jws.Tests.getAdminTestConn().reloadScriptApp(aAppName, aHotReload, {
				OnResponse: function (aResponse) {
					lResponse = aResponse;
				}
			});

			waitsFor(
					function () {
						return null !== lResponse;
					},
					lSpec,
					3000
					);

			runs(function () {
				expect(lResponse.code).toEqual(aExpectedCode);
			});
		});
	},
	testGetScriptApp: function () {
		var self = this;
		var lSpec = "generating script app '" + self.TEST_APP1;

		it(lSpec, function () {
			var lApp = null;
			var lResponse = null;
			jws.Tests.getAdminTestConn().getScriptApp(self.TEST_APP1, function (aApp) {
				lApp = aApp;

				// calling method toMap on Main controller
				lApp.Main.toMap(function (aResponse) {
					lResponse = aResponse;
				});
			});

			waitsFor(
					function () {
						return null !== lResponse;
					},
					lSpec,
					3000
					);


			runs(function () {
				expect(lResponse.code).toEqual(0);
				expect(lResponse.result.name).toEqual("Rolando SM");
				expect(lResponse.result.email).toEqual("rsantamaria@jwebsocket.org");
				expect(lResponse.result.age).toEqual(28);
			});
		});
	},
	runSpecs: function () {
		// test list apps
		this.testListScriptApps();
		// test get script app version
		this.testGetVersion(this.TEST_APP1);
		this.testGetVersion(this.TEST_APP2);
		// test get script app manifest
		this.testGetManifest(this.TEST_APP1);
		this.testGetManifest(this.TEST_APP2);
		// test script app reloads
		this.testReload(this.TEST_APP1, true, 0);
		this.testReload(this.TEST_APP1, false, 0);
		this.testReload(this.TEST_APP2, true, 0);
		this.testReload(this.TEST_APP2, false, 0);
		this.testReload("InvalidAppName", false, -1);
		// test client side apps generation
		this.testGetScriptApp();
	}
};//	---------------------------------------------------------------------------
//	jWebSocket Shared test specs (Community Edition, CE)
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

if (typeof jws.tests === "undefined") {
	jws.tests = {};
}

// main test class
jws.Tests = {
	NS: "jws.tests",
	MAX_CONNECTIONS: 50,
	OPEN_CONNS_TIMEOUT: 30000,
	CLOSE_CONNS_TIMEOUT: 30000,
	ADMIN_USER: "root",
	ADMIN_PWD: "root",
	GUEST_USER: "guest",
	GUEST_PWD: "guest",
	mAdminConn: null,
	mGuestConn: null,
	mAdminConnSSL: null,
	mGuestConnSSL: null,
	mTestConnsOpened: 0,
	mTestConns: [],
	// run jwebsocket oriented test case
	runTC: function (aService, aMethod, aArgs, aAssertHandler) {
		var aExpectedCode = 0;
		if (jws.tools.getType(aAssertHandler) == "integer") {
			aExpectedCode = aAssertHandler;
		}

		var lTimeout = 3000;
		if (!aAssertHandler || jws.tools.getType(aAssertHandler) == "integer") {
			aAssertHandler = function (aResponse) {
				expect(aExpectedCode).toEqual(aResponse.code);
			};
		} else if (aAssertHandler["timeout"]) {
			lTimeout = aAssertHandler["timeout"];
		}
		if (typeof aAssertHandler["handler"] == "function") {
			aAssertHandler = aAssertHandler["handler"];
		}

		var lResponse = null;
		var lSpec = "Invoking '" + aMethod + "' with " + aArgs.length + " parameter(s). Timeout :" + lTimeout + ". Expected response code: " + aExpectedCode;

		aArgs.push({
			OnResponse: function (aResponse) {
				lResponse = aResponse;
			}
		});

		// arguments function evaluator
		var fnEval = function (aArgs) {
			if (jws.tools.getType(aArgs) == "function") {
				return fnEval(aArgs());
			} else if (jws.tools.getType(aArgs) != "array") {
				return aArgs;
			} else {
				for (var lIndex in aArgs) {
					aArgs[lIndex] = fnEval(aArgs[lIndex]);
				}
				 
				return aArgs;
			}
		};

		it(lSpec, function () {
			if (typeof aService == "function") {
				aService = aService();
			}
			// eval function args 
			fnEval(aArgs);

			// invoke method
			aService[aMethod].apply(aService, aArgs);
			waitsFor(function () {
				return (null != lResponse);
			}, lSpec, lTimeout);

			runs(function () {
				aAssertHandler(lResponse);
			});
		});
	},
	getAdminConn: function () {
		return this.mAdminConn;
	},
	setAdminConn: function (aConn) {
		this.mAdminConn = aConn;
	},
	getGuestConn: function () {
		return this.mGuestConn;
	},
	setGuestConn: function (aConn) {
		this.mGuestConn = aConn;
	},
	getAdminConnSSL: function () {
		return this.mAdminConnSSL;
	},
	setAdminConnSSL: function (aConn) {
		this.mAdminConnSSL = aConn;
	},
	getGuestConnSSL: function () {
		return this.mGuestConnSSL;
	},
	setGuestConnSSL: function (aConn) {
		this.mGuestConnSSL = aConn;
	},
	getTestConns: function () {
		return this.mTestConns;
	},
	getAdminTestConn: function () {
		return ($('#tls_set').val() == 'ws') ? this.getAdminConn() : this.getAdminConnSSL();
	},
	// this spec tries to open a connection to be shared across multiple tests
	testOpenSharedAdminConn: function () {
		var lSpec = this.NS + ": Opening shared connection with administrator role";
		it(lSpec, function () {

			// we need to "control" the server to broadcast to all connections here
			jws.Tests.setAdminConn(new jws.jWebSocketJSONClient());
			var lResponse = {};

			// open a separate control connection
			jws.Tests.getAdminConn().logon(jws.getDefaultServerURL() + ';sessionCookieName=ROOTSessionCookie',
					jws.Tests.ADMIN_USER,
					jws.Tests.ADMIN_PWD, {
						OnToken: function (aToken) {
							if ("org.jwebsocket.plugins.system" == aToken.ns
									&& "login" == aToken.reqType) {
								lResponse = aToken;
							}
						}
					});

			waitsFor(
					function () {
						return(lResponse.code != undefined);
					},
					lSpec,
					3000
					);

			runs(function () {
				expect(lResponse.username).toEqual(jws.Tests.ADMIN_USER);
			});
		});
	},
	// this spec tries to open a SSL connection to be shared across multiple tests
	testOpenSharedAdminConnSSL: function () {
		var lSpec = this.NS + ": Opening shared SSL connection with administrator role";
		it(lSpec, function () {

			// we need to "control" the server to broadcast to all connections here
			jws.Tests.setAdminConnSSL(new jws.jWebSocketJSONClient());
			var lResponse = {};

			// open a separate control connection
			jws.Tests.getAdminConnSSL().logon(jws.getDefaultSSLServerURL() + ';sessionCookieName=ROOTSSLSessionCookie',
					jws.Tests.ADMIN_USER,
					jws.Tests.ADMIN_PWD, {
						OnToken: function (aToken) {
							if ("org.jwebsocket.plugins.system" == aToken.ns
									&& "login" == aToken.reqType) {
								lResponse = aToken;
							}
						}
					});

			waitsFor(
					function () {
						return(lResponse.code != undefined);
					},
					lSpec,
					3000
					);

			runs(function () {
				expect(lResponse.username).toEqual(jws.Tests.ADMIN_USER);
			});
		});
	},
	// this spec tries to open a connection to be shared across multiple tests
	testCloseSharedAdminConn: function () {
		var lSpec = this.NS + ": Closing shared connection with administrator role";
		it(lSpec, function () {

			jws.Tests.getAdminConn().logout();
			jws.Tests.getAdminConn().close({
				timeout: 3000
			});

			waitsFor(
					function () {
						return(!jws.Tests.getAdminConn().isOpened());
					},
					lSpec,
					3000
					);

			runs(function () {
				expect(jws.Tests.getAdminConn().isOpened()).toEqual(false);
			});
		});
	},
	// this spec tries to open a SSL connection to be shared across multiple tests
	testCloseSharedAdminConnSSL: function () {
		var lSpec = this.NS + ": Closing shared SSL connection with administrator role";
		it(lSpec, function () {

			jws.Tests.getAdminConnSSL().logout();
			jws.Tests.getAdminConnSSL().close({
				timeout: 3000
			});

			waitsFor(
					function () {
						return(!jws.Tests.getAdminConnSSL().isOpened());
					},
					lSpec,
					3000
					);

			runs(function () {
				expect(jws.Tests.getAdminConnSSL().isOpened()).toEqual(false);
			});
		});
	},
	// this spec tries to open a connection to be shared across multiple tests
	testOpenSharedGuestConn: function () {
		var lSpec = this.NS + ": Opening shared connection with guest role";
		it(lSpec, function () {

			// we need to "control" the server to broadcast to all connections here
			jws.Tests.setGuestConn(new jws.jWebSocketJSONClient());
			var lResponse = {};

			// open a separate control connection
			jws.Tests.getGuestConn().logon(jws.getDefaultServerURL() + ';sessionCookieName=GUESTSessionCookie',
					jws.Tests.GUEST_USER,
					jws.Tests.GUEST_PWD, {
						OnToken: function (aToken) {
							if ("org.jwebsocket.plugins.system" == aToken.ns
									&& "login" == aToken.reqType) {
								lResponse = aToken;
							}
						}
					});

			waitsFor(
					function () {
						return(lResponse.code != undefined);
					},
					lSpec,
					3000
					);

			runs(function () {
				expect(lResponse.username).toEqual(jws.Tests.GUEST_USER);
			});
		});
	},
	// this spec tries to open a connection to be shared across multiple tests
	testOpenSharedGuestConnSSL: function () {
		var lSpec = this.NS + ": Opening shared SSL connection with guest role";
		it(lSpec, function () {

			// we need to "control" the server to broadcast to all connections here
			jws.Tests.setGuestConnSSL(new jws.jWebSocketJSONClient());
			var lResponse = {};

			// open a separate control connection
			jws.Tests.getGuestConnSSL().logon(jws.getDefaultSSLServerURL() + ';sessionCookieName=GUESTSSLSessionCookie',
					jws.Tests.GUEST_USER,
					jws.Tests.GUEST_PWD, {
						OnToken: function (aToken) {
							if ("org.jwebsocket.plugins.system" == aToken.ns
									&& "login" == aToken.reqType) {
								lResponse = aToken;
							}
						}
					});

			waitsFor(
					function () {
						return(lResponse.code != undefined);
					},
					lSpec,
					3000
					);

			runs(function () {
				expect(lResponse.username).toEqual(jws.Tests.GUEST_USER);
			});
		});
	},
	// this spec tries to open a connection to be shared across multiple tests
	testCloseSharedGuestConn: function () {
		var lSpec = this.NS + ": Closing shared connection with guest role";
		it(lSpec, function () {

			jws.Tests.getGuestConn().logout();
			jws.Tests.getGuestConn().close({
				timeout: 3000
			});

			waitsFor(
					function () {
						return(!jws.Tests.getGuestConn().isOpened());
					},
					lSpec,
					3000
					);

			runs(function () {
				expect(jws.Tests.getGuestConn().isOpened()).toEqual(false);
			});
		});
	},
	// this spec tries to open a connection to be shared across multiple tests
	testCloseSharedGuestConnSSL: function () {
		var lSpec = this.NS + ": Closing shared SSL connection with guest role";
		it(lSpec, function () {

			// open a separate control connection
			ws.Tests.getGuestConnSSL().logout();
			jws.Tests.getGuestConnSSL().close({
				timeout: 3000
			});

			waitsFor(
					function () {
						return(!jws.Tests.getGuestConnSSL().isOpened());
					},
					lSpec,
					3000
					);

			runs(function () {
				expect(jws.Tests.getGuestConnSSL().isOpened()).toEqual(false);
			});
		});
	},
	// this spec opens all connections
	testOpenConnections: function () {
		var lSpec = "Opening " + jws.Tests.MAX_CONNECTIONS + " connections";
		it(lSpec, function () {

			// reset all watches
			jws.StopWatchPlugIn.resetWatches();

			// start stop watch for this spec
			jws.StopWatchPlugIn.startWatch("openConn", lSpec);

			for (var lIdx = 0; lIdx < jws.Tests.MAX_CONNECTIONS; lIdx++) {

				this.getTestConns()[ lIdx ] = new jws.jWebSocketJSONClient();
				this.getTestConns()[ lIdx ].open(jws.getDefaultServerURL(), {
					OnOpen: function () {
						this.mTestConnsOpened++;
					},
					OnClose: function () {
						this.mTestConnsOpened--;
					},
					OnToken: function (aToken) {
						if ("s2c_performance" == aToken.type
								&& NS_BENCHMARK == aToken.ns) {
							lPacketsReceived++;
						}
					}

				});
			}

			// wait for expected connections being opened
			waitsFor(
					function () {
						return this.mTestConnsOpened == jws.Tests.MAX_CONNECTIONS;
					},
					"opening connection...",
					jws.Tests.OPEN_CONNS_TIMEOUT
					);

			runs(
					function () {
						expect(this.mTestConnsOpened).toEqual(jws.Tests.MAX_CONNECTIONS);
						// stop watch for this spec
						jws.StopWatchPlugIn.stopWatch("openConn");
					}
			);

		});
	},
	// this spec closes all connections
	testCloseConnections: function () {
		var lSpec = "Closing " + jws.Tests.MAX_CONNECTIONS + " connections";
		it(lSpec, function () {

			// start stop watch for this spec
			jws.StopWatchPlugIn.startWatch("closeConn", lSpec);

			for (var lIdx = 0; lIdx < jws.Tests.MAX_CONNECTIONS; lIdx++) {
				this.getTestConns()[ lIdx ].close({
					timeout: 3000,
					// fireClose: true,
					// noGoodBye: true,
					noLogoutBroadcast: true,
					noDisconnectBroadcast: true
				});
			}

			// wait for expected connections being opened
			waitsFor(
					function () {
						return this.mTestConnsOpened == 0;
					},
					"closing connections...",
					jws.Tests.CLOSE_CONNS_TIMEOUT
					);

			runs(
					function () {
						expect(this.mTestConnsOpened).toEqual(0);

						// stop watch for this spec
						jws.StopWatchPlugIn.stopWatch("closeConn");

						// print all watches to the console
						jws.StopWatchPlugIn.printWatches();

						// reset all watches
						jws.StopWatchPlugIn.resetWatches();
					}
			);
		});
	}
};//	---------------------------------------------------------------------------
//	jWebSocket Streaming plug-in test specs (Community Edition, CE)
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
if (typeof jws.tests === "undefined") {
	jws.tests = {};
}
jws.tests.Streaming = {
	title: "Streaming plug-in",
	description: "jWebSocket streaming plug-in",
	category: "Community Edition",
	dependsOn: [{
			plugInId: "jws.streaming"
		}],
	// this spec tests the register method of the streaming plug-in
	testRegister: function (aStreamId) {
		var lSpec = "register (" + aStreamId + ")";

		it(lSpec, function () {

			var lResponse = {};
			jws.Tests.getAdminTestConn().registerStream(
					aStreamId,
					{OnResponse: function (aToken) {
							lResponse = aToken;
						}
					}
			);

			waitsFor(
					function () {
						return(lResponse.code == 0);
					},
					lSpec,
					3000
					);

			runs(function () {
				expect(lResponse.code).toEqual(0);
			});

		});
	},
	// this spec tests the unregister method of the streaming plug-in
	testUnregister: function (aStreamId) {
		var lSpec = "unregister (" + aStreamId + ")";

		it(lSpec, function () {

			var lResponse = {};
			jws.Tests.getAdminTestConn().unregisterStream(
					aStreamId,
					{OnResponse: function (aToken) {
							lResponse = aToken;
						}
					}
			);

			waitsFor(
					function () {
						return(lResponse.code == 0);
					},
					lSpec,
					3000
					);

			runs(function () {
				expect(lResponse.code).toEqual(0);
			});

		});
	},
	runSpecs: function () {
		jws.tests.Streaming.testRegister("timeStream");
		jws.tests.Streaming.testUnregister("timeStream");
	}
};

//	---------------------------------------------------------------------------
//	jWebSocket System plug-in test specs (Community Edition, CE)
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
if (typeof jws.tests === "undefined") {
	jws.tests = {};
}
jws.tests.System = {
	title: "System plug-in",
	description: "jWebSocket server system plug-in. " +
			"Required for correct server execution.",
	category: "System",
	priority: 1,
	dependsOn: [{
			plugInId: "jws.system"
		}],
	// this spec tests the login function of the system plug-in
	testLoginValidCredentials: function () {
		var lSpec = "logging in with valid credentials";
		it(lSpec, function () {

			// we need to "control" the server to broadcast to all connections here
			var lConn = new jws.jWebSocketJSONClient();
			var lResponse = {};
			// open a separate control connection
			lConn.logon(jws.getDefaultServerURL() + ";sessionId=" + "tests" + new Date().getTime()
					, "guest", "guest", {
						OnResponse: function (aToken) {
							lResponse = aToken;
						}
					});

			waitsFor(
					function () {
						return(lResponse.code !== undefined);
					},
					lSpec,
					1500
					);

			runs(function () {
				expect(lResponse.code).toEqual(0);
				lConn.logout({
					OnResponse: function () {
						lConn.close();
					},
					OnTimeout: function () {
						lConn.close();
					}
				});
			});
			waitsFor(function () {
				return lConn.isConnected() == false;
			});
		});
	},
	// this spec tests the login function of the system plug-in
	testLoginInvalidCredentials: function () {
		var lSpec = "logging in with invalid credentials";
		it(lSpec, function () {

			// we need to "control" the server to broadcast to all connections here
			var lConn = new jws.jWebSocketJSONClient();
			var lResponse = {};

			// open a separate control connection
			lConn.logon(jws.getDefaultServerURL() + ";sessionId=" + "tests" + new Date().getTime(), "InVaLiD", "iNvAlId", {
				OnResponse: function (aToken) {
					lResponse = aToken;
				}
			});

			waitsFor(
					function () {
						return(lResponse.code !== undefined);
					},
					lSpec,
					1500
					);

			runs(function () {
				expect(lResponse.code).toEqual(-1);
				lConn.logout({
					OnResponse: function () {
						lConn.close();
					},
					OnTimeout: function () {
						lConn.close();
					}
				});
			});
			waitsFor(function () {
				return lConn.isConnected() == false;
			});
		});
	},
	// this spec tests the send method of the system plug-in by sending
	// this spec requires an established connection
	testSendLoopBack: function () {
		var lSpec = "send and Loopback";
		it(lSpec, function () {

			// we need to "control" the server to broadcast to all connections here
			var lResponse = {};
			var lMsg = "This is my message";

			// open a separate control connection
			var lToken = {
				ns: jws.NS_SYSTEM,
				type: "send",
				targetId: jws.Tests.getAdminTestConn().getId(),
				sourceId: jws.Tests.getAdminTestConn().getId(),
				sender: jws.Tests.getAdminTestConn().getUsername(),
				data: lMsg
			};

			var lListener = function (aToken) {
				if ("org.jwebsocket.plugins.system" === aToken.ns
						&& "send" === aToken.type) {
					lResponse = aToken;
				}
			};

			jws.Tests.getAdminTestConn().addListener(lListener);
			jws.Tests.getAdminTestConn().sendToken(lToken);

			waitsFor(
					function () {
						return(lResponse.data === lMsg);
					},
					lSpec,
					1500
					);

			runs(function () {
				expect(lResponse.data).toEqual(lMsg);
				jws.Tests.getAdminTestConn().removeListener(lListener);
			});

		});
	},
	// this spec tests the connect timeout behaviour of the client
	testConnectTimeout: function (aURL, aOpenTimeout, aExpectedResult) {
		var lSpec = "connect timeout"
				+ " (timeout: " + aOpenTimeout + "ms)";

		it(lSpec, function () {

			// we need to "control" the server to broadcast to all connections here
			var lConn = new jws.jWebSocketJSONClient();
			var lStatus = jws.CONNECTING;

			// open a separate control connection
			lConn.open(aURL ? aURL : jws.getDefaultServerURL(), {
				openTimeout: aOpenTimeout,
				OnOpenTimeout: function (aToken) {
					lStatus = jws.OPEN_TIMED_OUT;
				},
				OnOpen: function (aToken) {
					// prevent screwing up result 
					// if timeout has been fired before
					if (lStatus === jws.CONNECTING) {
						lStatus = jws.OPEN;
					}
				},
				OnClose: function (aToken) {
					lStatus = jws.CLOSED;
				}
			});

			waitsFor(
					function () {
						return(lStatus !== jws.CONNECTING);
					},
					lSpec,
					aOpenTimeout + 500
					);
			runs(function () {
				expect(lStatus).toEqual(aExpectedResult);
				lConn.close({
					forceClose: true
				});
			});
			waitsFor(function () {
				return lConn.isConnected() == false;
			});
		});
	},
	// this spec tests the response timeout behaviour of the client
	testResponseTimeout: function (aServerDelay, aClientTimeout) {
		var lSpec = "response timeout"
				+ " (Server: " + aServerDelay + "ms,"
				+ " client: " + aClientTimeout + "ms)";

		it(lSpec, function () {

			var lResponse = {};
			var lExpectTimeout = aServerDelay > aClientTimeout;
			var lTimeoutFired = false;
			jws.Tests.getAdminTestConn().testTimeout(
					aServerDelay,
					{
						OnResponse: function (aToken) {
							lResponse = aToken;
						},
						timeout: aClientTimeout,
						OnTimeout: function (aToken) {
							lTimeoutFired = true;
						}
					}
			);

			waitsFor(
					function () {
						if (lExpectTimeout) {
							return(lTimeoutFired === true);
						} else {
							return(lResponse.code === 0);
						}
					},
					lSpec,
					aClientTimeout + 1000
					);

			runs(function () {
				if (lExpectTimeout) {
					expect(lTimeoutFired).toEqual(true);
				} else {
					expect(lResponse.code).toEqual(0);
				}
			});

		});
	},
	testSessionPut: function (aKey, aValue, aPublic) {
		var lSpec = "putting data on the server session of the client";
		it(lSpec, function () {
			var lResponse = null;

			waitsFor(
					function () {
						return jws.Tests.getAdminTestConn() !== null;
					},
					"waiting for admin connection",
					1000
					);

			runs(function () {
				jws.Tests.getAdminTestConn().sessionPut(aKey, aValue, aPublic, {
					OnResponse: function (aResponse) {
						lResponse = aResponse;
					}
				});
			});

			waitsFor(
					function () {
						return(lResponse !== null);
					},
					lSpec,
					3000
					);

			runs(function () {
				expect(lResponse.code).toEqual(0);
			});
		});
	},
	testSessionGet: function (aKey, aPublic, aExpectedValue) {
		var lSpec = "getting data from the server session of a given client";
		it(lSpec, function () {
			var lResponse = null;

			runs(function () {
				jws.Tests.getAdminTestConn().sessionGet(jws.Tests.getAdminTestConn().getId(),
						aKey, aPublic, {
							OnResponse: function (aResponse) {
								lResponse = aResponse;
							}
						});
			});

			waitsFor(
					function () {
						return(lResponse !== null);
					},
					lSpec,
					3000
					);

			runs(function () {
				expect(lResponse.code).toEqual(0);
				expect(lResponse.data.key).toEqual((aPublic) ? "public::" + aKey : aKey);
				expect(lResponse.data.value).toEqual(aExpectedValue);
			});
		});
	},
	testSessionHas: function (aKey, aPublic, aExpectedValue) {
		var lSpec = "checking if the server session of a given client has a given entry";
		it(lSpec, function () {
			var lResponse = null;

			runs(function () {
				jws.Tests.getAdminTestConn().sessionHas(jws.Tests.getAdminTestConn().getId(),
						aKey, aPublic, {
							OnResponse: function (aResponse) {
								lResponse = aResponse;
							}
						});
			});

			waitsFor(
					function () {
						return(lResponse !== null);
					},
					lSpec,
					1000
					);

			runs(function () {
				expect(lResponse.code).toEqual(0);
				expect(lResponse.data.key).toEqual((aPublic) ? "public::" + aKey : aKey);
				expect(lResponse.data.exists).toEqual(aExpectedValue);
			});
		});
	},
	testSessionKeys: function (aPublic, aExpectedValue) {
		var lSpec = "getting the server session keys of a given client";
		it(lSpec, function () {
			var lResponse = null;

			runs(function () {
				jws.Tests.getAdminTestConn().sessionKeys(jws.Tests.getAdminTestConn().getId(),
						aPublic, {
							OnResponse: function (aResponse) {
								lResponse = aResponse;
							}
						});
			});

			waitsFor(
					function () {
						return(lResponse !== null);
					},
					lSpec,
					2000
					);

			runs(function () {
				expect(lResponse.code).toEqual(0);
				if (!aPublic) {
					// the server adds a session entry (session creation time)
					// KEEP THIS
					aExpectedValue++;
				}
				expect(lResponse.data.length >= aExpectedValue).toEqual(true);
			});
		});
	},
	testSessionRemove: function (aKey, aPublic, aExpectedCode) {
		var lSpec = "removing server session entry";
		it(lSpec, function () {
			var lResponse = null;

			runs(function () {
				jws.Tests.getAdminTestConn().sessionRemove(aKey, aPublic, {
					OnResponse: function (aResponse) {
						lResponse = aResponse;
					}
				});
			});

			waitsFor(
					function () {
						return(lResponse !== null);
					},
					lSpec,
					1000
					);

			runs(function () {
				expect(lResponse.code).toEqual(aExpectedCode);
				if (0 === aExpectedCode) {
					expect(lResponse.data.key).toEqual((aPublic) ? "public::" + aKey : aKey);
					expect(lResponse.data.value !== null).toEqual(true);
				}
			});
		});
	},
	testSessionGetAll: function (aPublic, aExpectedResult) {
		var lSpec = "getting the server session keys of a given client";
		it(lSpec, function () {
			var lResponse = null;

			runs(function () {
				jws.Tests.getAdminTestConn().sessionGetAll(jws.Tests.getAdminTestConn().getId(),
						aPublic, {
							OnResponse: function (aResponse) {
								lResponse = aResponse;
							}
						});
			});

			waitsFor(
					function () {
						return lResponse !== null;
					},
					lSpec,
					3000
					);

			runs(function () {
				expect(lResponse.code).toEqual(0);
				for (var lProp in aExpectedResult) {
					expect(lResponse.data[lProp]).toEqual(aExpectedResult[lProp]);
				}
			});
		});
	},
	testSessionGetMany: function (aKeys, aExpectedResult) {
		var lSpec = "getting multiple public session entries for a given collection of clients";
		it(lSpec, function () {
			var lResponse = null;
			var lClients = [jws.Tests.getAdminTestConn().getId()];
			runs(function () {
				jws.Tests.getAdminTestConn().sessionGetMany(lClients,
						aKeys, {
							OnResponse: function (aResponse) {
								lResponse = aResponse;
							}
						});
			});

			waitsFor(
					function () {
						return(lResponse !== null);
					},
					lSpec,
					3000
					);

			runs(function () {
				var lExpected = {};
				lExpected[jws.Tests.getAdminTestConn().getId()] = aExpectedResult;
				expect(lResponse.code).toEqual(0);
				for (var i = 0; i < lClients.length; i++) {
					for (var j = 0; j < aKeys.length; j++) {
						expect(lResponse.data[lClients[i]][aKeys[j]]).
								toEqual(lExpected[lClients[i]][aKeys[j]]);
					}
				}
			});
		});
	},
	runSpecs: function () {
		jws.tests.System.testLoginValidCredentials();
		jws.tests.System.testLoginInvalidCredentials();
		jws.tests.System.testSendLoopBack();

		jws.tests.System.testConnectTimeout(null, 5000, jws.OPEN);
		// jws.tests.System.testConnectTimeout( null, 20, jws.OPEN_TIMED_OUT );

		// use an invalid port to simulate "server not available" case
		// jws.tests.System.testConnectTimeout( "ws://jwebsocket.org:1234", 10000, jws.CLOSED );
		// jws.tests.System.testConnectTimeout( "ws://jwebsocket.org:1234", 1000, jws.OPEN_TIMED_OUT );

		// should return a result within timeout
		jws.tests.System.testResponseTimeout(500, 100);
		// should exceed the timeout and fire timeout event
		jws.tests.System.testResponseTimeout(1000, 500);

		// server side session management support
		jws.tests.System.testSessionPut("myVar", "myVarValue", true);
		jws.tests.System.testSessionPut("myPrivateVar", "myPrivateVarValue", false);
		jws.tests.System.testSessionGet("myVar", true, "myVarValue");
		jws.tests.System.testSessionHas("myVar", true, true);
		jws.tests.System.testSessionHas("myNonExistingVar", true, false);
		jws.tests.System.testSessionHas("myNonExistingVar", false, false);
		jws.tests.System.testSessionKeys(false, 2);
		jws.tests.System.testSessionKeys(true, 1);
		jws.tests.System.testSessionRemove("myVar", true, 0);
		jws.tests.System.testSessionRemove("myNonExistingVar", true, -1);
		jws.tests.System.testSessionRemove("myNonExistingVar", false, -1);
		jws.tests.System.testSessionKeys(false, 1);
		jws.tests.System.testSessionKeys(true, 0);
		jws.tests.System.testSessionPut("myVar2", "myVarValue2", true);
		jws.tests.System.testSessionGetAll(false, {
			"myPrivateVar": "myPrivateVarValue",
			"public::myVar2": "myVarValue2"
		});
		jws.tests.System.testSessionGetMany(["myVar2"], {
			"myVar2": "myVarValue2"
		});
		jws.tests.System.testSessionRemove("myVar2", true, 0);

	}
};

