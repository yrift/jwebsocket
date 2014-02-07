//  ---------------------------------------------------------------------------
//  jWebSocket - ImportFromToken (Community Edition, CE)
//	---------------------------------------------------------------------------
//	Copyright 2010-2014 Innotrade GmbH (jWebSocket.org)
//  Alexander Schulze, Germany (NRW)
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
package org.jwebsocket.eventmodel.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * This annotation allows automatic population in custom events fields. Copy or
 * move value from the incoming tokens to the targeted fields in events.
 *
 * @author kyberneees
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface ImportFromToken {

	/**
	 * Allowed strategies: "copy" | "move"
	 *
	 * copy: Keeps the original parameter in the incoming token move: Remove the
	 * original parameter from the incoming token
	 *
	 * @return The importing strategy
	 */
	String strategy() default "move";

	/**
	 * @return The key of the incoming parameter to import. By default use the
	 * same field name as the parameter name.
	 */
	String key() default "";
}
