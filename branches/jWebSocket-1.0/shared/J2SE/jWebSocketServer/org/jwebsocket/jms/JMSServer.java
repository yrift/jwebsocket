//	---------------------------------------------------------------------------
//	jWebSocket - JMS Server (Community Edition, CE)
//	---------------------------------------------------------------------------
//	Copyright 2010-2013 Innotrade GmbH (jWebSocket.org)
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
import org.jwebsocket.api.ServerConfiguration;
import org.jwebsocket.api.WebSocketConnector;
import org.jwebsocket.api.WebSocketEngine;
import org.jwebsocket.api.WebSocketPacket;
import org.jwebsocket.kit.BroadcastOptions;
import org.jwebsocket.kit.FilterResponse;
import org.jwebsocket.logging.Logging;
import org.jwebsocket.packetProcessors.JSONProcessor;
import org.jwebsocket.server.TokenServer;
import org.jwebsocket.token.Token;

/**
 * JMS Token server implementation.
 *
 * @author kyberneees
 */
public class JMSServer extends TokenServer {

	private static Logger mLog = Logging.getLogger(JMSServer.class);
	private JMSMessageHub mMessageHub = null;

	public JMSServer(ServerConfiguration aServerConfig) {
		super(aServerConfig);
	}

	@Override
	public void engineStarted(WebSocketEngine aEngine) {
		if (null == mMessageHub && aEngine instanceof JMSEngine) {
			mMessageHub = new JMSMessageHub((JMSEngine) aEngine);
			try {
				mMessageHub.initialize();
			} catch (Exception lEx) {
				mLog.error(Logging.getSimpleExceptionMessage(lEx, "initializing message hub"));
			}
		}

		super.engineStarted(aEngine);
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
		mMessageHub.shutdown();
	}

	public JMSMessageHub getMessageHub() {
		return mMessageHub;
	}
}
