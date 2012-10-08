		
Ext.define( 'Ext.jws', {
	extend: 'Ext.util.Observable',
	singleton: true,

	constructor: function( aConfig ) {

		this.addEvents( {
			"open" : true,
			"close" : true,
			"timeout":true
		} );

		// Call our superclass constructor to complete construction process.
		this.superclass.constructor.call( this, aConfig )
	},
		
	init:function( aConfig ) {
        
		/*=== Override the submit method in the prototype of the class=====*/
		Ext.form.Basic.prototype.submit = function( options ) {
			return this.doAction( this.standardSubmit ? 'standardsubmit' : this.api ? 'directsubmit': this.jwsSubmit ? 'jwssubmit' : 'submit', options );
		}
	
		/*=== Override the load method in the prototype of the class=====*/
		Ext.form.Basic.prototype.load = function( aOptions ) {
			return this.doAction( this.api ? 'directload' : this.jwsSubmit ? 'jwsload' : 'load', aOptions );
		}
							
	},

	open: function( aURL, aTokenClient, aTimeout ) {
		var self = this;
		if( jws.browserSupportsWebSockets() ) {
			var lUrl = aURL || jws.getDefaultServerURL();

			if( aTokenClient )
				this.fTokenClient = aTokenClient;
			else
				this.fTokenClient = new jws.jWebSocketJSONClient();


			this.fTokenClient.open( lUrl, {
				OnOpen: function( aToken ) {
					self.init();
					self.fireEvent( 'open' );
				},
				OnClose: function() {
					self.fireEvent( 'close' );
				},
				OnTimeout: function() {
					self.fireEvent( 'timeout' );
				}
			} );
			if( aTimeout )
				this.setDefaultTimeOut( aTimeout );
		}
		else{
			var lMsg = jws.MSG_WS_NOT_SUPPORTED;
			Ext.Error.raise( lMsg );
		}
	},
	getConnection: function(){
		return this.fTokenClient;
	},
	send: function( aNS, aType, aArgs, aCallbacks, aScope ) {
        
		var lScope  = aScope;
		var lToken  = {};
		if ( aArgs ) {
			lToken = aArgs;
		}
		lToken.ns   = aNS;
		lToken.type = aType;

		this.fTokenClient.sendToken( lToken, {
			callbacks: aCallbacks,
			OnResponse: function( aToken ) {
				if ( aToken.code == -1 ) {
					if( aScope == undefined )
						return aCallbacks.failure( aToken );
					return aCallbacks.failure.call( lScope,aToken );

				}
				else if ( aToken.code == 0 ) {
					if( aScope == undefined )
						return aCallbacks.success( aToken );
					return aCallbacks.success.call( lScope,aToken );
						
				}
			},
			OnTimeOut: function( aToken ) {
				if( aScope == undefined )
					return aCallbacks.timeout( aToken );
				return aCallbacks.timeout.call( lScope,aToken );
					
			}
		} );
	},
		
	addPlugIn: function( aPlugIn ) {
		this.fTokenClient.addPlugIn( aPlugIn );
	},
	
	setDefaultTimeOut:function( aTimeout ) {
		if( this.fTokenClient )
			this.fTokenClient.DEF_RESP_TIMEOUT = aTimeout;
		else
			jws.DEF_RESP_TIMEOUT = aTimeout;
	},
	
	close : function() {
		this.fTokenClient.close();
		this.fireEvent( 'close' );
	}

} );
	
	
/*
 *    This class is the jWebSocket implementation for Ext.data.proxy     
 *                
 */       

Ext.define( 'Ext.jws.data.proxy', {
	extend: 'Ext.data.proxy.Server',
	alias: 'Ext.jws.data.proxy',
        
	/**
     * @cfg {String} ns default namespace used for all proxy's actions ( read, write, create,  )
    */
       
	ns: undefined,
    
	/**
     * @cfg {Object} api define tokens for each action that will be performs by the proxy
    */
	api: {
		create : 'create',
		read   : 'read',
		update : 'update',
		destroy: 'destroy'
	},     
       
	/**
     * Creates the proxy, throws an error if namespace is not given
     * @param {Object} aConfig Config object is not Opcional.
     */
	constructor: function( aConfig ) {
		var self = this;
			
		self.callParent( arguments );
        
		if ( self.ns == undefined )
			Ext.Error.raise( "the namespace must be specify, jwk proxy need a namespace" );
	},

    
	doRequest: function( aOperation, aCallback, aScope ) {
		var self     = this;
		var lWriter  = this.getWriter();
		var lRequest = this.buildRequest( aOperation, aCallback, aScope );
            
		if ( aOperation.allowWrite() ) {
			lRequest = lWriter.write( lRequest );
		}
        
		var lRequestData = this.setupDataForRequest( lRequest );
        
		Ext.jws.send( lRequestData.ns, lRequestData.tt, lRequestData.data, {
			success : function( aToken ) {
                
				var lText = Ext.encode( aToken );
                
				var lResponse = {
					request       : lRequest,
					requestId     : lRequest.id,
					status        : aToken.code,
					statusText    : aToken.msg,
					responseText  : lText,
					responseObject: aToken
				};
				
                
				self.processResponse( true, aOperation, lRequest, lResponse, aCallback, aScope );
			},
			
			failure:  function( aToken ) {
                
				var lText = Ext.encode( aToken );
                    
				var lResponse = {
					request       : lRequest,
					requestId     : lRequest.id,
					status        : aToken.code,
					statusText    : aToken.msg,
					responseText  : lText,
					responseObject: aToken
				};
                    
				self.processResponse( false, aOperation, lRequest, lResponse, aCallback, aScope );
			}
		},aScope );
	},
	
	setupDataForRequest:function( aOptions ) {
            
		var lParams  = aOptions.params || {},                     
		lJsonData    = aOptions.jsonData,
		lNS   = this.ns,
		lTokenType   = undefined,
		lData;
            
		var lScope = aOptions;
            
		if ( Ext.isFunction( lParams ) ) {
			lParams = lParams.call( lScope, aOptions );
		}
                
		lData = aOptions.rawData || aOptions.xmlData || lJsonData || null;    
               
		switch ( aOptions.action ) {
			case 'create':
				lTokenType = this.api.create;
				break;
			case 'update':
				lTokenType = this.api.update;
				break;
			case 'destroy':
				lTokenType = this.api.destroy;
				break;
			case 'read':
				lTokenType = this.api.read;
				break;
			default:
				break;
		}
            
		return  {
			ns: lNS,
			tt: lTokenType,
			data: lData || lParams || null
		};
            
            
	},
	setException: function( aOperation, aResponse ) {
		aOperation.setException( {
			status        : aResponse.status,
			statusText    : aResponse.statusText,
			responseText  : aResponse.responseText,
			responseObject: aResponse.responseObject
		} );     
	}
} );

/*
 * This class is the jWebSocket implementation for Ext.form.action.Submit
 * 
 * 
 */

Ext.define( 'Ext.jws.form.action.Submit', {
	extend:'Ext.form.action.Submit',
	alternateClassName: 'Ext.jws.form.Action.Submit',
	alias: 'formaction.jwssubmit',

	type: 'jwssubmit',
	ns: undefined,
	tokentype: undefined,

	constructor:function( aConfig ) {
		var self = this;

		self.callParent( arguments );

		if ( self.ns == undefined )
			Ext.Error.raise( "you must specify the namespace" );
		if ( self.tokentype == undefined )
			Ext.Error.raise( "you must specify the tokentype" );
	},


	getNS: function() {
		return this.ns  || this.form.ns;
	},
	getTokenType: function() {
		return this.tokentype || this.form.tokentype;
	},

	doSubmit: function() {
		var lFormEl,
		
		jwsOptions = Ext.apply( {
			ns: this.getNS(),
			tokentype: this.getTokenType()
		} );
		var lCallbacks = this.createCallback();

		if ( this.form.hasUpload() ) {
			lFormEl = jwsOptions.form = this.buildForm();
			jwsOptions.isUpload = true;

		} else {
			jwsOptions.params = this.getParams();
		}

		Ext.jws.send( jwsOptions.ns, jwsOptions.tokentype, jwsOptions.params, lCallbacks,this );
		if ( lFormEl ) {
			Ext.removeNode( lFormEl );
		}
	},
	processResponse : function( aResponse ) {
		this.fResponse = aResponse;
		if ( !aResponse.responseText && !aResponse.responseXML && !aResponse.type ) {
			return true;
		}
		return ( this.fResult = this.handleResponse( aResponse ) );
	},
	handleResponse: function( aResponse ) {
		if ( aResponse ) {
			var lRecords = aResponse.data;
			var lData = [];
			if ( lRecords ) {
				for( var i = 0, len = lRecords.length; i < len; i++ ) {
					lData[i] = lRecords[i];
				}
			}
            
			if ( lData.length < 1 ) {
				lData = null;
			}
			return {
				success : aResponse.success,
				data : lData
			};
		}
		return Ext.decode( aResponse.data );
	}
  
} );

/*
 * 
 * This class is the jWebSocket implementation for Ext.form.action.Load
 * 
 * 
 */

Ext.define( 'Ext.jws.form.action.Load', {
	extend:'Ext.form.action.Load',
	requires: ['Ext.direct.Manager'],
	alternateClassName: 'Ext.jws.form.action.Load',
	alias: 'formaction.jwsload',

	type: 'jwsload',
	ns: undefined,
	tokentype: undefined,

	constructor:function( aConfig ) {
		var self = this;
		self.callParent( arguments );

		if ( self.ns == undefined )
			Ext.Error.raise( "you must specify the namespace" );
		if ( self.tokentype == undefined )
			Ext.Error.raise( "you must specify the tokentype" );
	},


	run: function() {
		var lCallbacks =  this.createCallback();
		Ext.jws.send( Ext.apply( 
		{
			ns:this.ns,
			tokentype:this.tokentype,
			params: this.getParams()
		}
		) );
		Ext.jws.send( this.ns, this.tokentype, this.getParams(), lCallbacks,this );
        
	},

	processResponse : function( aResponse ) {
		this.fResponse = aResponse;
		if ( !aResponse.responseText && !aResponse.responseXML && !aResponse.type ) {
			return true;
		}
		return ( this.fResult = this.handleResponse( aResponse ) );
	},
    
	handleResponse: function( aResponse ) {
		if ( aResponse ) {
			var data = aResponse.data[0] ? aResponse.data : null;
			return {
				success : aResponse.success,
				data : data
			};
		}
		return Ext.decode( aResponse.data );
	}
} );