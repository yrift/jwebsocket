//	---------------------------------------------------------------------------
//	jWebSocket Load Balancer Plug-in (Community Edition, CE)
//	---------------------------------------------------------------------------
//	Copyright 2010-2014 Innotrade GmbH (jWebSocket.org)
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

//:package:*:jws
//:class:*:jws.LoadBalancerPlugIn
//:ancestor:*:-
//:d:en:Implementation of the [tt]jws.LoadBalancerPlugIn[/tt] class.
//:d:en:This client-side plug-in provides the API to access the features of the _
//:d:en:Load Balancer plug-in on the jWebSocket server.
jws.LoadBalancerPlugIn = {

	//:const:*:NS:String:org.jwebsocket.plugins.loadbalancer (jws.NS_BASE + ".plugins.loadbalancer")
	//:d:en:Namespace for the [tt]LoadBalancerPlugIn[/tt] class.
	// if namespace is changed update server plug-in accordingly!
	NS: jws.NS_BASE + ".plugins.loadbalancer",
	
	//:m:*:lbClustersInfo
	//:d:en:Gets a list (of maps) with the information about all clusters.
	//:a:en::aOptions:Object:Optional arguments for the raw client sendToken method.
	//:r:*:::void:none
	lbClustersInfo: function ( aOptions ) {
		var lRes = this.checkConnected();
		if( 0 === lRes.code ) {
			var lToken = {
				ns: jws.LoadBalancerPlugIn.NS,
				type: "clustersInfo"
			};
			this.sendToken( lToken,	aOptions );
		}
		return lRes;
	},
	
	//:m:*:lbStickyRoutes
	//:d:en:Gets a list of all sticky routes managed by the load balancer.
	//:a:en::aOptions:Object:Optional arguments for the raw client sendToken method.
	//:r:*:::void:none
	lbStickyRoutes: function ( aOptions ) {
		var lRes = this.checkConnected();
		if( 0 === lRes.code ) {
			var lToken = {
				ns: jws.LoadBalancerPlugIn.NS,
				type: "stickyRoutes"
			};
			this.sendToken( lToken,	aOptions );
		}
		return lRes;
	},
	
	//:m:*:lbRegisterServiceEndPoint
	//:d:en:Registers a new service endpoint in specific cluster.
	//:a:en::aPassword:String:Password to verify privileges.
	//:a:en::aOptions:Object:Optional arguments for the raw client sendToken method.
	//:r:*:::void:none
	lbRegisterServiceEndPoint: function ( aPassword, aOptions ) {
		var lRes = this.checkConnected();
		if( 0 === lRes.code ) {
			aOptions = jws.getOptions( aOptions, {
				clusterAlias: null
			});
			if(aPassword == undefined){
				aPassword = null;
			}
			var lToken = {
				ns: jws.LoadBalancerPlugIn.NS,
				type: "registerServiceEndPoint",
				clusterAlias: aOptions.clusterAlias,
				password: aPassword
			};
			this.sendToken( lToken,	aOptions );
		}
		return lRes;
	},
	
	//:m:*:lbDeregisterServiceEndPoint
	//:d:en:De-registers a connected service endpoint.
	//:a:en::aPassword:String:Password to verify privileges.
	//:a:en::aOptions:Object:Optional arguments for the raw client sendToken method.
	//:r:*:::void:none
	lbDeregisterServiceEndPoint: function ( aPassword, aOptions ) {
		var lRes = this.checkConnected();
		if( 0 === lRes.code ) {
			aOptions = jws.getOptions( aOptions, {
				clusterAlias: null
			});
			aOptions = jws.getOptions( aOptions, {
				endPointId: null
			});
			if(aPassword == undefined ) {
				aPassword = null;
			}
			var lToken = {
				ns: jws.LoadBalancerPlugIn.NS,
				type: "deregisterServiceEndPoint",
				endPointId: aOptions.endPointId,
				clusterAlias: aOptions.clusterAlias,
				password: aPassword
			};
			this.sendToken( lToken,	aOptions );
		}
		return lRes;
	},
	
	//:m:*:lbShutdownEndPoint
	//:d:en:Should send a message to the referenced endpoint to gracefully shutdown.
	//:a:en::aPassword:String:Password to verify privileges.
	//:a:en::aOptions:Object:Optional arguments for the raw client sendToken method.
	//:r:*:::void:none
	lbShutdownEndPoint: function ( aPassword, aOptions ) {
		var lRes = this.checkConnected();
		if( 0 === lRes.code ) {
			aOptions = jws.getOptions( aOptions, {
				clusterAlias: null
			});
			aOptions = jws.getOptions( aOptions, {
				endPointId: null
			});
			if(aPassword == undefined ) {
				aPassword = null;
			}
			var lToken = {
				ns: jws.LoadBalancerPlugIn.NS,
				type: "shutdownServiceEndPoint",
				endPointId: aOptions.endPointId,
				clusterAlias: aOptions.clusterAlias,
				password: aPassword
			};
			this.sendToken( lToken,	aOptions );
		}
		return lRes;
	},
	
	//:m:*:lbCreateResponse
	//:d:en:Create token response with all necessary data to send to remote client.
	//:a:en::aOptions:Object:Optional arguments for the raw client sendToken method.
	//:r:*:::void:none
	lbCreateResponse: function(aToken){
		var lResponse =  {
			ns: jws.LoadBalancerPlugIn.NS,
			type: 'response',
			utid: aToken.utid,
			sourceId: aToken.sourceId,
			reqType: aToken.type
		}
		
		return lResponse;
	}
};

// add the JWebSocket Load Balancer PlugIn into the TokenClient class
jws.oop.addPlugIn( jws.jWebSocketTokenClient, jws.LoadBalancerPlugIn );	
	
	
