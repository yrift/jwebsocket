//	---------------------------------------------------------------------------
//	jWebSocket Enterprise Cluster Admin PlugIn
//	(C) Copyright 2012-2013 Innotrade GmbH, Herzogenrath Germany
//	Author: Rolando Santamaria Maso
//	---------------------------------------------------------------------------
jws.ClusterAdminPlugInEE={NS:jws.NS_BASE+".plugins.clusteradmin",clusterGetinfo:function(c){var b=this.checkConnected();if(0===b.code){var a={ns:jws.ClusterAdminPlugInEE.NS,type:"getClusterInfo"};this.sendToken(a,c)}return b},clusterListNodes:function(c){var b=this.checkConnected();if(0===b.code){var a={ns:jws.ClusterAdminPlugInEE.NS,type:"listNodes"};this.sendToken(a,c)}return b},clusterGetOptimumNode:function(c){var b=this.checkConnected();if(0===b.code){var a={ns:jws.ClusterAdminPlugInEE.NS,type:"getOptimumNode"};this.sendToken(a,c)}return b},clusterPauseNode:function(d,c){var b=this.checkConnected();if(0===b.code){var a={ns:jws.ClusterAdminPlugInEE.NS,type:"pauseNode",nodeId:d};this.sendToken(a,c)}return b},clusterResumeNode:function(d,c){var b=this.checkConnected();if(0===b.code){var a={ns:jws.ClusterAdminPlugInEE.NS,type:"resumeNode",nodeId:d};this.sendToken(a,c)}return b},clusterShutdownNode:function(d,c){var b=this.checkConnected();if(0===b.code){var a={ns:jws.ClusterAdminPlugInEE.NS,type:"shutdownNode",nodeId:d};this.sendToken(a,c)}return b}};jws.oop.addPlugIn(jws.jWebSocketTokenClient,jws.ClusterAdminPlugInEE);