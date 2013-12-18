//  ---------------------------------------------------------------------------
//  jWebSocket - JMSEndPointSender (Community Edition, CE)
//	---------------------------------------------------------------------------
//	Copyright 2010-2013 Innotrade GmbH (jWebSocket.org)
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
package org.jwebsocket.jms.endpoint;

import java.util.Map;
import java.util.TimerTask;
import javax.jms.BytesMessage;
import javax.jms.JMSException;
import javax.jms.MapMessage;
import javax.jms.Message;
import javax.jms.MessageProducer;
import javax.jms.ObjectMessage;
import javax.jms.Session;
import javax.jms.TextMessage;
import javolution.util.FastMap;
import org.apache.log4j.Logger;
import org.jwebsocket.packetProcessors.JSONProcessor;
import org.jwebsocket.token.Token;
import org.jwebsocket.util.Tools;
import org.springframework.util.Assert;

/**
 *
 * @author Alexander Schulze
 */
public class JMSEndPointSender {

	// TODO: Introduce timeout management
	static final Logger mLog = Logger.getLogger(JMSEndPointSender.class);
	private final MessageProducer mProducer;
	private final Session mSession;
	private final String mEndPointId;
	private static final Map<String, IJMSResponseListener> mResponseListeners
			= new FastMap<String, IJMSResponseListener>().shared();
	private final JMSEndPoint mEndPoint;

	/**
	 *
	 * @param aEndPoint
	 */
	public JMSEndPointSender(JMSEndPoint aEndPoint) {
		mEndPoint = aEndPoint;
		mSession = aEndPoint.getSession();
		mProducer = aEndPoint.getProducer();
		mEndPointId = aEndPoint.getEndPointId();

		mEndPoint.addListener(new IJMSMessageListener() {
			@Override
			public JMSEndPointSender getSender() {
				return null;
			}

			@Override
			public void setSender(JMSEndPointSender aSender) {
			}

			@Override
			public void onMessage(Message aMessage) {
			}

			@Override
			public void onBytesMessage(BytesMessage aMessage) {
			}

			@Override
			public void onTextMessage(final TextMessage aMessage) {
				try {
					// getting the correlation ID
					String lKey = aMessage.getJMSCorrelationID();

					// TODO: fix this temporary patch in the future, using only the JMSCorrelationID
					if (null == lKey) {
						Token lToken = JSONProcessor.JSONStringToToken(aMessage.getText());
						if (null != lToken && lToken.getMap().containsKey("utid")) {
							lKey = String.valueOf(lToken.getInteger("utid"));
						}
					}

					if (null != lKey) {
						// trying to get available response listener
						final IJMSResponseListener lRespListener = mResponseListeners.remove(lKey);

						// if listener exists
						if (null != lRespListener) {
							// getting the response text
							final String lResponse = aMessage.getText();
							// invoke "onResponse" callback out of this thread 
							Tools.getThreadPool().submit(new Runnable() {
								@Override
								public void run() {
									lRespListener.onReponse(lResponse, aMessage);
								}
							});
						}
					}

				} catch (Exception lEx) {
				}
			}

			@Override
			public void onMapMessage(MapMessage aMessage) {
			}

			@Override
			public void onObjectMessage(ObjectMessage aMessage) {
			}
		});
	}

	/**
	 *
	 * @return
	 */
	public JMSEndPoint getEndPoint() {
		return mEndPoint;
	}

	/**
	 *
	 * @param aTargetId
	 * @param aCorrelationID
	 * @param aText
	 * @param aListener
	 */
	public void sendText(String aTargetId, String aCorrelationID,
			final String aText, IJMSResponseListener aListener) {
		sendText(aTargetId, aCorrelationID, aText, aListener, 1000 * 10);
	}

	/**
	 *
	 * @param aTargetId
	 * @param aCorrelationID
	 * @param aText
	 * @param aResponseListener
	 * @param aTimeout
	 */
	public void sendText(String aTargetId, final String aCorrelationID,
			final String aText, IJMSResponseListener aResponseListener,
			long aTimeout) {
		if (mLog.isDebugEnabled()) {
			mLog.debug("Sending text: "
					+ "[content suppressed, length: " + aText.length() + " bytes]"
					+ "...");
		}

		Message lMsg;
		try {
			lMsg = mSession.createTextMessage(aText);
			if (null != aCorrelationID) {
				lMsg.setJMSCorrelationID(aCorrelationID);
			}
			lMsg.setStringProperty("targetId", aTargetId);
			lMsg.setStringProperty("sourceId", mEndPointId);
			mProducer.send(lMsg);

			// processing callbacks
			if (null != aResponseListener) {
				Assert.notNull(aCorrelationID, "The 'correlationID' argument cannot be null!");
				Assert.isTrue(aTimeout > 0, "Invalid 'timeout' arguemnt. Expecting 'timeout' > 0");

				// setting the expiration time
				lMsg.setJMSExpiration(aTimeout);

				// saving the callback 
				mResponseListeners.put(aCorrelationID, aResponseListener);

				// schedule the timer task
				Tools.getTimer().schedule(new TimerTask() {
					@Override
					public void run() {
						Tools.getThreadPool().submit(new Runnable() {
							@Override
							public void run() {
								IJMSResponseListener lListener = mResponseListeners.remove(aCorrelationID);
								if (null != lListener) {
									lListener.onTimeout();
								}
							}
						});
					}
				}, aTimeout);
			}
		} catch (JMSException lEx) {
			mLog.error(lEx.getClass().getSimpleName() + " sending message.");
		}
	}

	/**
	 *
	 * @param aTargetId
	 * @param aCorrelationID
	 * @param aText
	 */
	public void sendText(String aTargetId, String aCorrelationID, final String aText) {
		sendText(aTargetId, aCorrelationID, aText, null);
	}

	/**
	 *
	 * @param aTargetId
	 * @param aText
	 */
	public void sendText(String aTargetId, final String aText) {
		sendText(aTargetId, null, aText);
	}

	/**
	 * @return the mJmsTemplate
	 */
	public MessageProducer getProducer() {
		return mProducer;
	}

	/**
	 * @return the EndPointId
	 */
	public String getEndPointId() {
		return mEndPointId;
	}
}