//	---------------------------------------------------------------------------
//	jWebSocket - CallableListener (Community Edition, CE)
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
package org.jwebsocket.eventmodel.observable;

import java.util.concurrent.Callable;
import org.jwebsocket.eventmodel.api.IListener;

/**
 *
 * @author Rolando Santamaria Maso
 */
public class CallableListener implements Callable<Object> {

	private IListener mListener;
	private Event mEvent;
	private ResponseEvent mResponseEvent;

	/**
	 *
	 * @param aListener
	 * @param aEvent
	 * @param aResponseEvent
	 */
	public CallableListener(IListener aListener, Event aEvent, ResponseEvent aResponseEvent) {
		this.mListener = aListener;
		this.mEvent = aEvent;
		this.mResponseEvent = aResponseEvent;
	}

	/**
	 * {@inheritDoc }
	 */
	@Override
	public Object call() throws Exception {
		ObservableObject.callProcessEvent(mListener, mEvent, mResponseEvent);

		return null;
	}
}
