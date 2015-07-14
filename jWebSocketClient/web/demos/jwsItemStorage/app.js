Ext.Loader.setConfig({
	enabled: true,
	// Don't set to true, it's easier to use the debugger option to disable caching
	disableCaching: false,
	paths: {
		'Ext.jws': '../../res/js/jWebSocketSenchaPlugIn/'
	}
});
Ext.application({
	name: 'IS',
	enableQuickTips: true,
	requires: [
		'Ext.jws.Client',
		'Ext.jws.data.Proxy',
		'Ext.jws.data.Reader'
	],
	controllers: [
		'Portal', 'Collection', 'Definition', 'Item'
	],
	paths: {
		'lib': 'app/lib'
	},
	launch: function () {
		var self = this;
		// declaring the collections definition cache container
		self.collection2def = {};
		self.itemSearchs = {};

		// declaring app events
		self.addEvents({
			collectionSaved: true,
			itemSaved: true,
			itemRemoved: true,
			collectionCleaned: true,
			collectionRestarted: true,
			collectionRemoved: true,
			collectionSubscription: true,
			collectionUnsubscription: true,
			collectionAuthorization: true
		});

		Ext.require('lib.VTypes');
		Ext.require('lib.FieldTypes');
		Ext.require('lib.Util');
		Ext.getBody().mask("Please wait, we are trying to connect to the server!");
		Ext.jwsClient.on('OnClose', function () {
			Ext.Msg.alert("Connection Closed", "Could not establish a connection with the server application.<br>Please contact the system administrator!");
			Ext.getBody().unmask();
		});
		
		Ext.jwsClient.on('OnOpen', function () {
			Ext.getBody().unmask();
			Ext.jwsClient.addPlugIn({
				// global behiavor for failure messages
				processToken: function (aMessage) {
					if ('response' === aMessage.type && 0 !== aMessage.code && aMessage.reqType !== "getAuthorities") {
						Ext.Msg.show({
							msg: aMessage.msg,
							buttons: Ext.Msg.OK,
							icon: Ext.Msg.ERROR
						});
					}
				}
			});

			// opening logon box
			var lLogonView = new Ext.create('IS.view.portal.Logon');
			lLogonView.showAt({
				y: 100
			});


			Ext.jwsClient.on('OnLogoff', function () {
				// remove main view
				Ext.destroy(Ext.getCmp('viewport'));

				// show logon box again
				lLogonView.showAt({
					y: 100
				});
			});

			Ext.jwsClient.on('OnLogon', function () {
				lLogonView.down('form').down('textfield[name=password]').setValue("");
				lLogonView.hide();

				// item storage plugin listener registration
				Ext.jwsClient.getConnection().setItemStorageCallbacks({
					OnCollectionSaved: function (aEvent) {
						self.fireEvent('collectionSaved', aEvent);
					},
					OnCollectionRestarted: function (aEvent) {
						self.fireEvent('collectionRestarted', aEvent);
					},
					OnCollectionCleaned: function (aEvent) {
						self.fireEvent('collectionCleaned', aEvent);
					},
					OnCollectionRemoved: function (aEvent) {
						self.fireEvent('collectionRemoved', aEvent);
					},
					OnItemRemoved: function (aEvent) {
						self.fireEvent('itemRemoved', aEvent);
					},
					OnItemSaved: function (aEvent) {
						self.fireEvent('itemSaved', aEvent);
					},
					OnCollectionSubscription: function (aEvent) {
						self.fireEvent('collectionSubscription', aEvent);
					},
					OnCollectionUnsubscription: function (aEvent) {
						self.fireEvent('collectionUnsubscription', aEvent);
					},
					OnCollectionAuthorization: function (aEvent) {
						self.fireEvent('collectionAuthorization', aEvent);
					}
				});

				// openning main view
				Ext.create('Ext.container.Viewport', {
					autoScroll: true,
					resizable: false,
					maxWidth: 700,
					id: 'viewport',
					items: [{
							xtype: 'p_header'
						}, {
							xtype: 'panel',
							id: 'body',
							border: 0,
							layout: 'column',
							items: [{
									xtype: 'panel',
									region: 'west',
									border: 0,
									items: [{
											xtype: 'p_left'
										}]
								}, {
									xtype: 'p_right'
								}]
						}]
				});

				IS.lib.Util.registerTooltip(['showUserOnly']);
			});
		});

		// creates a client connection with the server
		Ext.jwsClient.open();
	}
});