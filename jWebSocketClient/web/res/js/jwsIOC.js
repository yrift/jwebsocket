//  ---------------------------------------------------------------------------
//  jWebSocket - Dependency Injection Container
//  Copyright (c) 2012 Innotrade GmbH, jWebSocket.org
//  ---------------------------------------------------------------------------
//  This program is free software; you can redistribute it and/or modify it
//  under the terms of the GNU Lesser General Public License as published by the
//  Free Software Foundation; either version 3 of the License, or (at your
//  option) any later version.
//  This program is distributed in the hope that it will be useful, but WITHOUT
//  ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
//  FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for
//  more details.
//  You should have received a copy of the GNU Lesser General Public License along
//  with this program; if not, see <http://www.gnu.org/licenses/lgpl.html>.
//  ---------------------------------------------------------------------------

/**
 * Author: Rolando Santamar�a Mas� <kyberneees@gmail.com>
 * 
 * This library depends of cujojs-aop (http://cujojs.com/)
 **/
jws.ioc = {};

/**
 * This class is used to reference services in dependencies
 **/
jws.ioc.ServiceReference = function ServiceReference(aName){
	this._name = aName;
}

jws.ioc.ServiceReference.prototype.getName = function(){
	return this._name;
}
  
/**
 * This class is used to reference parameters in dependencies
 **/
jws.ioc.ParameterReference = function ParameterReference(aName){
	this._name = aName;
}

jws.ioc.ParameterReference.prototype.getName = function(){
	return this._name;
}

/**
 * This class is used to reference DOM elements in dependencies
 **/
jws.ioc.DOMReference = function DOMReference(aName){
	this._name = aName;
}

jws.ioc.DOMReference.prototype.getName = function(){
	return this._name;
}

/**
 * This class is used to pass the result of method's execution as dependencies
 **/
jws.ioc.MethodExecutionReference = function MethodExecutionReference(aSource, aMethodName, aArguments){
	this._source = aSource;
	this._methodName = aMethodName;
	this._arguments = aArguments;
}

jws.ioc.MethodExecutionReference.prototype.getSource = function(){
	return this._source;
}

jws.ioc.MethodExecutionReference.prototype.setSource = function(aSource){
	this._source = aSource;
	
	return this;
}

jws.ioc.MethodExecutionReference.prototype.getMethodName = function(){
	return this._methodName;
}

jws.ioc.MethodExecutionReference.prototype.setMethodName = function(aMethodName){
	this._methodName = aMethodName;
	
	return this;
}

jws.ioc.MethodExecutionReference.prototype.getArguments = function(){
	return this._arguments;
}

jws.ioc.MethodExecutionReference.prototype.setArguments = function(aArguments){
	this._arguments = aArguments;
	
	return this;
}

/*
 * This class is used as a map for service"s instances
 */
jws.ioc.ServiceContainer = function ServiceContainer(){
	this._services   = {};
	this._parameters = {};
};

jws.ioc.ServiceContainer.prototype.getParameter = function (aName){
	if (this.hasParameter(aName)){
		return this._parameters[aName];
	}
      
	throw new Error("IndexOutOfBound:" + aName);
}

jws.ioc.ServiceContainer.prototype.setParameter = function (aName, aValue){
	this._parameters[aName] = aValue;

	return this;
}

jws.ioc.ServiceContainer.prototype.getService = function (aName){
	if (this.hasService(aName)){
		return this._services[aName];
	}

	throw new Error("IndexOutOfBound:"+aName);
}

jws.ioc.ServiceContainer.prototype.setService = function (aName, aService){
	this._services[aName] = aService;

	return this;
}

jws.ioc.ServiceContainer.prototype.hasParameter = function(aName){
	if (!aName){
		throw new Error("RequiredParameter:name");
	}
      
	if (undefined !== this._parameters[aName])
		return true;

	return false;
}

jws.ioc.ServiceContainer.prototype.hasService = function(aName){
	if (!aName){
		throw new Error("RequiredParameter:name");
	}
	
	if (undefined !== this._services[aName])
		return true;

	return false;
}

jws.ioc.ServiceContainer.prototype.removeParameter = function (aName){
	if (!aName){
		throw new Error("RequiredParameter:name");
	}
	
	var lResult = null;
	if (undefined !== this._parameters[aName]){
		lResult = this._parameters[aName];
		delete this._parameters[aName];
	}
	
	return lResult;
}

jws.ioc.ServiceContainer.prototype.removeService = function (aName){
	if (!aName){
		throw new Error("RequiredParameter:name");
	}
	
	var lResult = null;
	if (undefined !== this._services[aName]){
		lResult = this._services[aName];
		delete this._services[aName];
	}
	
	return lResult;
}

/*
 * This class is used to define a service
 */
jws.ioc.ServiceDefinition = function ServiceDefinition(aConfig){
	this._name = null;
	this._className = null;
	this._shared = true;
	this._initArguments = null;
	this._methodCalls = new Array();
	this._factoryMethod = null;
	this._initMethod = null;
	this._destroyMethod = null;
	this._onCreate = null;
	this._onRemove = null;
	this._extend = null;
	this._aspects = new Array();

	if (undefined != aConfig.className){
		this._className = aConfig.className;
	} else {
		throw new Error("RequiredParameter:{config.className}");
	}
	
	if (undefined != aConfig.name){
		this._name = aConfig.name;
	} 

	if (undefined != aConfig.shared){
		this._shared = aConfig.shared;
	}
	
	if (undefined != aConfig.factoryMethod){
		this._factoryMethod = aConfig.factoryMethod;
	}
	
	if (undefined != aConfig.initArguments){
		this._initArguments = aConfig.initArguments;
	}
	
	if (undefined != aConfig.initMethod){
		this._initMethod = aConfig.initMethod;
	}
	
	if (undefined != aConfig.destroyMethod){
		this._destroyMethod = aConfig.destroyMethod;
	}
	
	if ("function" == typeof(aConfig.onCreate)){
		this._onCreate = aConfig.onCreate;
	}
	
	if ("function" == typeof(aConfig.onRemove)){
		this._onRemove = aConfig.onRemove;
	}
	
	if (aConfig.methodCalls instanceof Array){
		this._methodCalls = aConfig.methodCalls;
	}
	
	if (null != aConfig.extend){
		this._extend = aConfig.extend;
	}
	
	if (null != aConfig.aspects){
		this._aspects = aConfig.aspects;
	}
}

jws.ioc.ServiceDefinition.prototype.getName = function(){
	return this._name;
}

jws.ioc.ServiceDefinition.prototype.setName = function (aName){
	this._name = aName;

	return this;
}

jws.ioc.ServiceDefinition.prototype.getClassName = function (){
	return this._className;
}

jws.ioc.ServiceDefinition.prototype.setClassName = function (aClassName){
	this._className = aClassName;

	return this;
}

jws.ioc.ServiceDefinition.prototype.isShared = function (){
	return this._shared;
}

jws.ioc.ServiceDefinition.prototype.setShared = function (aShared){
	this._shared = aShared;

	return this;
}

jws.ioc.ServiceDefinition.prototype.getFactoryMethod = function (){
	return this._factoryMethod;
}

jws.ioc.ServiceDefinition.prototype.setFactoryMethod = function (aFactoryMethod){
	this._factoryMethod = aFactoryMethod;

	return this;
}

jws.ioc.ServiceDefinition.prototype.getInitArguments = function (){
	return this._initArguments;
}

jws.ioc.ServiceDefinition.prototype.setInitArguments = function (aArguments){
	this._initArguments = aArguments;

	return this;
}

jws.ioc.ServiceDefinition.prototype.getOnCreate = function (){
	return this._onCreate;
}

jws.ioc.ServiceDefinition.prototype.setOnCreate = function (aFunction){
	this._onCreate = aFunction;

	return this;
}

jws.ioc.ServiceDefinition.prototype.getOnRemove = function (){
	return this._onRemove;
}

jws.ioc.ServiceDefinition.prototype.setOnRemove = function (aFunction){
	this._onRemove = aFunction;

	return this;
}

jws.ioc.ServiceDefinition.prototype.getInitMethod = function (){
	return this._initMethod;
}

jws.ioc.ServiceDefinition.prototype.setInitMethod = function (aMethodName){
	this._initMethod = aMethodName;

	return this;
}

jws.ioc.ServiceDefinition.prototype.getDestroyMethod = function (){
	return this._destroyMethod;
}

jws.ioc.ServiceDefinition.prototype.setDestroyMethod = function (aMethodName){
	this._destroyMethod = aMethodName;

	return this;
}

jws.ioc.ServiceDefinition.prototype.getExtend = function (){
	return this._extend;
}

jws.ioc.ServiceDefinition.prototype.setExtend = function (aServiceName){
	this._extend = aServiceName;

	return this;
}

jws.ioc.ServiceDefinition.prototype.getAspects = function (){
	return this._aspects;
}

jws.ioc.ServiceDefinition.prototype.setAspects = function (aAspects){
	this._aspects = aAspects;

	return this;
}

jws.ioc.ServiceDefinition.prototype.addAspect = function (aPointcut, aAdvices){
	if (!aPointcut){
		throw new Error("RequiredParameter:pointcut");
	}
	if (!aAdvices){
		throw new Error("RequiredParameter:advices");
	}
	
	this._aspects.push({
		pointcut: aPointcut, 
		advices: aAdvices
	})

	return this;
}

jws.ioc.ServiceDefinition.prototype.addMethodCall = function (aMethod, aArguments){
	if (!aMethod){
		throw new Error("RequiredParameter:method");
	}
	
	this._methodCalls.push({
		method: aMethod,
		arguments: aArguments
	});

	return this;
}

jws.ioc.ServiceDefinition.prototype.getMethodCalls = function (){
	return this._methodCalls;
}

/*
 * This class represents the dependency injection container
 */
jws.ioc.ServiceContainerBuilder = function ServiceContainerBuilder(aConfig){
	this._definitions = {};
	this._id = null;
	
	if (aConfig.id){
		this._id = aConfig.id;
	} else {
		throw new Error("RequiredParameter:{config.id}");
	}

	if (aConfig.container){
		this._container = aConfig.container;
	} else {
		throw new Error("RequiredParameter:{config.container}");
	}

	if (aConfig.definitions){
		this._definitions = aConfig.definitions;
	}
	
	// Logging the service container operations using AOP
	var lRegExp = new RegExp("/.*/"); //  old expression: /[]*/
	aop.around(this, lRegExp, function(aArgs){
		jws.console.debug(">> " + this._id + ": Calling method '" + aArgs.method + "' with arguments '" + JSON.stringify(aArgs.args) + "'...");
		var lResponse = aArgs.proceed();
		var lClassName = lResponse.constructor.toString().split(" ", 2)[1].split("(", 1);
		jws.console.debug("<< " + this._id + ": Response for '" + aArgs.method + "' method call: (" + lClassName +")" + JSON.stringify(lResponse));
		 
		return lResponse;
	});
}	

jws.ioc.ServiceContainerBuilder.prototype.getParameter = function (aName){
	return this._container.getParameter(aName);
}

jws.ioc.ServiceContainerBuilder.prototype.getServiceDefinition = function (aName){
	if (this.hasServiceDefinition(aName)){
		return this._definitions[aName];
	}

	throw new Error("IndexOutOfBound:"+aName);
}

jws.ioc.ServiceContainerBuilder.prototype.setParameter = function (aName, aValue){
	this._container.setParameter(aName, aValue);

	return this;
}

jws.ioc.ServiceContainerBuilder.prototype.setService = function (aName, aValue){
	this._container.setService(aName, aValue);

	return this;
}

jws.ioc.ServiceContainerBuilder.prototype.getService = function (aName){
	var lResult = null;
	try {
		lResult =  this._container.getService(aName);
	} catch(err) {
		switch (err.message)
		{
			case "IndexOutOfBound:"+aName:
				var lServiceDef = this.getServiceDefinition(aName);
				lResult = this.createService(lServiceDef);
				break;
			default:
				throw err;
				break;
		}
	}
	
	return lResult;
}

jws.ioc.ServiceContainerBuilder.prototype.hasParameter = function (aName){
	return this._container.hasParameter(aName);
}

jws.ioc.ServiceContainerBuilder.prototype.hasService = function(aName){
	return this.hasServiceDefinition(aName) || this._container.hasService(aName);
}

jws.ioc.ServiceContainerBuilder.prototype.removeParameter = function (aName){
	return this._container.removeParameter(aName);
}

jws.ioc.ServiceContainerBuilder.prototype.removeService = function (aName){
	var lResult = null;
	
	try{
		lResult = this._container.removeService(aName);
	} catch(err){
	//Service instance not created already
	}
	
	var lServiceDef = this._definitions[aName];
	if (lServiceDef){
		delete this._definitions[aName];
		
		//Supporting destroy method
		if (null != lServiceDef.getDestroyMethod()){
			//Executing the destroy-method
			lServiceDef[lServiceDef.getDestroyMethod()]();
		}
		
		//Removing service definition
		if (null != lServiceDef.getOnRemove()){
			//Executing the callback
			lServiceDef.getOnRemove()(lResult);
		}
	}
	
	return lResult;
}

jws.ioc.ServiceContainerBuilder.prototype.addServiceDefinition = function (aServiceDefinition){
	var lName = aServiceDefinition.getName();
	
	//Generate a name for anonymous services
	if (null == lName){
		//Attach random posfix to avoid duplicate names
		var lPostfix = "";
			
		//Using the classname as name if missing
		lName = aServiceDefinition.getClassName().toString().toLowerCase();
		
		//Adding a postfix to avoid duplicate indexes
		while(this.hasServiceDefinition(lName + lPostfix)) {
			lPostfix = "#" + parseInt(Math.random() * 10000000);
		} 
		
		//Setting the generated name
		aServiceDefinition.setName(lName + lPostfix);
		lName = lName + lPostfix;
	}
	
	if (this._container.hasService(lName)){
		this._container.removeService(lName);
	}

	this._definitions[lName] = aServiceDefinition;
      
	return this;
}

jws.ioc.ServiceContainerBuilder.prototype.register = function (aName, aClassName){
	return this.addServiceDefinition(
		new jws.ioc.ServiceDefinition({
			name: aName,
			className: aClassName
		})
		).getServiceDefinition(aName);
}

jws.ioc.ServiceContainerBuilder.prototype.getServiceDefinition = function (aName){
	if (this.hasServiceDefinition(aName)){
		return this._definitions[aName];
	}
      
	throw new Error("IndexOutOfBound:"+aName);
}

jws.ioc.ServiceContainerBuilder.prototype.hasServiceDefinition = function (aName){
	if (!aName){
		throw new Error("RequiredParameter:name");
	}
	
	if (undefined !== this._definitions[aName]){
		return true;
	}

	return false;
}

jws.ioc.ServiceContainerBuilder.prototype._parseArguments = function(aArguments){
	var lArgs = {}
	
	//Guarantee that the service definitions are added first,
	//solve object properties ordering issue in JavaScript
	for (var lKey in aArguments){
		if (aArguments[lKey] instanceof jws.ioc.ServiceDefinition){
			this.addServiceDefinition(aArguments[lKey]);
		}
	}
	
	for (lKey in aArguments){
		if (aArguments[lKey] instanceof jws.ioc.ServiceReference){
			lArgs[lKey] = this.getService(aArguments[lKey].getName());
		} else if (aArguments[lKey] instanceof jws.ioc.ParameterReference){
			lArgs[lKey] = this.getParameter(aArguments[lKey].getName());
		} else if (aArguments[lKey] instanceof jws.ioc.ServiceDefinition){
			lArgs[lKey] =  this.getService(aArguments[lKey].getName());
		} else if (aArguments[lKey] instanceof jws.ioc.DOMReference){
			lArgs[lKey] =  document.getElementById(aArguments[lKey].getName());
		} else if (aArguments[lKey] instanceof jws.ioc.MethodExecutionReference){
			//Special treatment for dependencies of type MethodExecutionReference
			var lMER = aArguments[lKey];
			
			//Excluding reference conflicts
			var lSource = lMER.getSource();
			var lMERArgs = lMER.getArguments();
			
			if (lSource instanceof jws.ioc.ServiceReference){
				lSource = this.getService(lSource.getName());
			} else if (lSource instanceof jws.ioc.ParameterReference){
				lSource = this.getParameter(lSource.getName());
			}
			if ("object" == typeof(lMERArgs)){
				lMERArgs = this._parseArguments(lMERArgs);
			}
			
			//Calling the method
			lArgs[lKey] = lSource[lMER.getMethodName()](lMERArgs);
		} else {
			lArgs[lKey] = aArguments[lKey];
		}
	}

	return lArgs;
}

jws.ioc.ServiceContainerBuilder.prototype.createService =  function (aServiceDefinition){
	var lService = null;
	var lDef = aServiceDefinition;
	var lIndex = 0;
	
	//Supporting the service name as parameter
	if ("string" == typeof(lDef)){
		lDef = this.getServiceDefinition(lDef);
	}
	
	//Supporting extend feature for service definitions
	if (null != lDef.getExtend()){
		lDef = this.extendDefinition(lDef, this.getServiceDefinition(lDef.getExtend()));
	}
	
	//Supporting factory-method
	if (null != lDef.getFactoryMethod()){
		lService = eval(lDef.getClassName() + "['" + lDef.getFactoryMethod() + "']();");
		
		//Adding the service name in the service instance
		lService["__SERVICE_NAME__"] = lDef.getName();
	} else {
		lService = eval("new " + lDef.getClassName() + "();");
		
		//Adding the service name in the service instance
		lService["__SERVICE_NAME__"] = lDef.getName();
	
		//Adding aspects before initialize the service
		var lEnd = lDef.getAspects().length;
		var lAspect = null;
		for (lIndex = 0; lIndex < lEnd; lIndex++) {
			lAspect = lDef.getAspects()[lIndex];
			aop.add(lService, lAspect.pointcut, lAspect.advices);
		}
		
		//Supporting init-method
		if (null != lDef.getInitMethod()){
			if (null != lDef.getInitArguments()){
				lDef.getInitArguments()
				lService[lDef.getInitMethod()](this._parseArguments(lDef.getInitArguments()));
			} else {
				lService[lDef.getInitMethod()]();
			}
		}
	}

	//Executing method calls
	var lMethodCalls = lDef.getMethodCalls();
	for (lIndex = 0; lIndex < lMethodCalls.length; lIndex++){
		if (null != lMethodCalls[lIndex].arguments){
			lService[lMethodCalls[lIndex].method](this._parseArguments(lMethodCalls[lIndex].arguments));
		} else {
			lService[lMethodCalls[lIndex].method]();
		}
	}
	
	//Saving service if shared
	if (true == lDef.isShared())	{
		this._container.setService(lDef.getName(), lService);
	}
	
	if (null != lDef.getOnCreate()){
		//Calling the OnCreate callback passing the created service as argument
		lDef.getOnCreate()(lService);
	}

	return lService;
}

jws.ioc.ServiceContainerBuilder.prototype.extendDefinition = function(aChild, aParent){
	//Require to return a prototype to allow runtime changes on the parent definition property values
	var lExtendedDef = new jws.ioc.ServiceDefinition({
		name: aChild.getName(),
		className: aChild.getClassName(),
		shared: aChild.getShared(),
		extend: aChild.getExtend(),
		initArguments: (null != aChild.getInitArguments()) ? aChild.getInitArguments() : aParent.getInitArguments(),
		initMethod: (null != aChild.getInitMethod()) ? aChild.getInitMethod() : aParent.getInitMethod(),
		destroyMethod: (null != aChild.getDestroyMethod()) ? aChild.getDestroyMethod() : aParent.getDestoryMethod(),
		factoryMethod: (null != aChild.getFactoryMethod()) ? aChild.getFactoryMethod() : aParent.getFactoryMethod(),
		methodCalls: (0 < aChild.getMethodCalls().length) ? aChild.getMethodCalls() : aParent.getMethodCalls(),
		onCreate: (null != aChild.getOnCreate()) ? aChild.getOnCreate() : aParent.getOnCreate(),
		onRemove: (null != aChild.getOnRemove()) ? aChild.getOnRemove() : aParent.getOnRemove(),
		aspects: (0 < aChild.getAspects().length) ? aChild.getAspects() : aParent.getAspects()
	});
	
	return lExtendedDef;
}

// Create the service container default instance
jws.sc = new jws.ioc.ServiceContainerBuilder({
	id: "jws.sc",
	container: new jws.ioc.ServiceContainer()
});
