//	---------------------------------------------------------------------------
//	jWebSocket - JMSServer (Community Edition, CE)
//	---------------------------------------------------------------------------
//	Copyright 2010-2015 Innotrade GmbH (jWebSocket.org)
//      Alexander Schulze, Germany (NRW)
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
package org.jwebsocket.jms;

import java.util.Collection;
import org.apache.log4j.Logger;
import org.jwebsocket.api.IEventBus;
import org.jwebsocket.api.ServerConfiguration;
import org.jwebsocket.api.WebSocketConnector;
import org.jwebsocket.api.WebSocketEngine;
import org.jwebsocket.api.WebSocketPacket;
import org.jwebsocket.eventbus.BaseEventBus;
import org.jwebsocket.eventbus.JMSDistributedEventBus;
import org.jwebsocket.jms.api.IClusterSynchronizer;
import org.jwebsocket.kit.BroadcastOptions;
import org.jwebsocket.kit.FilterResponse;
import org.jwebsocket.logging.Logging;
import org.jwebsocket.packetProcessors.JSONProcessor;
import org.jwebsocket.server.TokenServer;
import org.jwebsocket.token.Token;
import org.jwebsocket.util.JMSManager;

/**
 * JMS Token server implementation.
 *
 * @author Rolando Santamaria Maso
 */
public class JMSServer extends TokenServer {

	private final static Logger mLog = Logging.getLogger(JMSServer.class);
	private JMSManager mJMSManager = null;
	private IClusterSynchronizer mSynchronizer = null;
	private JMSEngine mEngine;

	/**
	 *
	 * @param aServerConfig
	 */
	public JMSServer(ServerConfiguration aServerConfig) {
		super(aServerConfig);
	}

	public JMSEngine getClusterEngine() {
		return mEngine;
	}

	@Override
	public void engineStarted(WebSocketEngine aEngine) {
		if (aEngine instanceof JMSEngine) {
			mEngine = (JMSEngine) aEngine;

			// instantiating the JMSManager
			mJMSManager = new JMSManager(false, mEngine.getConnection(), "topic://"
					+ mEngine.getDestination() + "_messagehub");
			mSynchronizer = mEngine.getNodesManager().getSynchronizer();

			// instantiating the EventBus
			mEventBus = new JMSDistributedEventBus(mEngine.getConnection(),
					mEngine.getDestination() + "_eventbus");
			mEventBus.setExceptionHandler(new IEventBus.IExceptionHandler() {

				@Override
				public void handle(Exception lEx) {
					mLog.error(Logging.getSimpleExceptionMessage(lEx, "uncaught exception inside event bus"));
				}
			});

			try {
				((BaseEventBus) mEventBus).initialize();
			} catch (Exception lEx) {
				mLog.error(Logging.getSimpleExceptionMessage(lEx, "initializing cluster event bus"));
			}
		}

		super.engineStarted(aEngine);
	}

	/**
	 *
	 * @return
	 */
	public IClusterSynchronizer getSynchronizer() {
		return mSynchronizer;
	}

	@Override
	public void broadcastToken(Token aToken) {
		broadcastToken(null, aToken);
	}

	@Override
	public void broadcastToken(WebSocketConnector aSource, Token aToken) {
		// before sending the token push it through filter chain
		FilterResponse lFilterResponse = getFilterChain().processTokenOut(
				null, null, aToken);
		if (lFilterResponse.isRejected()) {
			if (mLog.isDebugEnabled()) {
				mLog.debug("Broadcasting token '" + aToken + " rejected by filters...");
			}
			return;
		}

		WebSocketPacket lPacket = JSONProcessor.tokenToPacket(aToken);
		broadcastPacket(null, lPacket);
	}

	@Override
	public void broadcastPacket(WebSocketConnector aSource, WebSocketPacket aDataPacket) {
		Collection<WebSocketEngine> lEngines = getEngines().values();
		for (WebSocketEngine lEngine : lEngines) {
			lEngine.broadcastPacket(aSource, aDataPacket);
		}
	}

	@Override
	public void broadcastPacket(WebSocketConnector aSource, WebSocketPacket aDataPacket, BroadcastOptions aBroadcastOptions) {
		throw new UnsupportedOperationException("'Broadcast options' not supported on JMSServer!");
	}

	@Override
	public void broadcastToken(WebSocketConnector aSource, Token aToken, BroadcastOptions aBroadcastOptions) {
		throw new UnsupportedOperationException("'Broadcast options' not supported on JMSServer!");
	}

	@Override
	public void systemStopping() throws Exception {
		super.systemStopping();
		// shutdown message hub
		mJMSManager.shutdown();
		// shutdown event bus
		((BaseEventBus) mEventBus).shutdown();
	}

	@Override
	public JMSManager getJMSManager() {
		return mJMSManager;
	}

	@Override
	public IEventBus getEventBus() {
		return mEventBus;
	}
}
