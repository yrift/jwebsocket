// ---------------------------------------------------------------------------
// jWebSocket - FilterConfigHandler (Community Edition, CE)
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
package org.jwebsocket.config.xml;

import java.util.List;
import java.util.Map;

import javax.xml.stream.XMLStreamException;
import javax.xml.stream.XMLStreamReader;
import javolution.util.FastList;
import javolution.util.FastMap;

import org.jwebsocket.config.Config;
import org.jwebsocket.config.ConfigHandler;

/**
 * Config handler for reading plugins configuration
 *
 * @author puran
 * @version $Id: FilterConfigHandler.java 596 2010-06-22 17:09:54Z
 * fivefeetfurther $
 *
 */
public class FilterConfigHandler implements ConfigHandler {

	private static final String ELEMENT_FILTER = "filter";
	private static final String ID = "id";
	private static final String NAME = "name";
	private static final String JAR = "jar";
	private static final String NAMESPACE = "ns";
	private static final String SERVERS = "server-assignments";
	private static final String SERVER = "server-assignment";
	private static final String SETTINGS = "settings";
	private static final String SETTING = "setting";
	private static final String ENABLED = "enabled";

	/**
	 * {@inheritDoc}
	 *
	 * @param aStreamReader
	 * @throws javax.xml.stream.XMLStreamException
	 */
	@Override
	public Config processConfig(XMLStreamReader aStreamReader)
			throws XMLStreamException {
		String lId = "", lName = "", lPackageName = "", lJar = "", lNamespace = "";
		boolean lEnabled = true;
		List<String> lServers = new FastList<String>();
		Map<String, String> lSettings = null;
		while (aStreamReader.hasNext()) {
			aStreamReader.next();
			if (aStreamReader.isStartElement()) {
				String elementName = aStreamReader.getLocalName();
				if (elementName.equals(ID)) {
					aStreamReader.next();
					lId = aStreamReader.getText();
				} else if (elementName.equals(NAME)) {
					aStreamReader.next();
					lName = aStreamReader.getText();
				} else if (elementName.equals(JAR)) {
					aStreamReader.next();
					lJar = aStreamReader.getText();
				} else if (elementName.equals(NAMESPACE)) {
					aStreamReader.next();
					lNamespace = aStreamReader.getText();
				} else if (elementName.equals(SETTINGS)) {
					lSettings = getSettings(aStreamReader);
				} else if (elementName.equals(SERVERS)) {
					lServers = getServers(aStreamReader);
				} else if (elementName.equals(ENABLED)) {
					aStreamReader.next();
					try {
						lEnabled = Boolean.parseBoolean(aStreamReader.getText());
					} catch (Exception ex) {
						// ignore, per default true
					}
				} else {
					// ignore
				}
			}
			if (aStreamReader.isEndElement()) {
				String elementName = aStreamReader.getLocalName();
				if (elementName.equals(ELEMENT_FILTER)) {
					break;
				}
			}
		}

		return new FilterConfig(lId, lName, lPackageName, lJar, lNamespace, lServers, lSettings, lEnabled);
	}

	/**
	 * private method that reads the list of servers from the plugin
	 * configuration
	 *
	 * @param aStreamReader the stream reader object
	 * @return the list of right ids
	 * @throws XMLStreamException if exception while reading
	 */
	private List<String> getServers(XMLStreamReader aStreamReader)
			throws XMLStreamException {
		List<String> lServers = new FastList<String>();
		while (aStreamReader.hasNext()) {
			aStreamReader.next();
			if (aStreamReader.isStartElement()) {
				String lElementName = aStreamReader.getLocalName();
				if (lElementName.equals(SERVER)) {
					aStreamReader.next();
					String server = aStreamReader.getText();
					lServers.add(server);
				}
			}
			if (aStreamReader.isEndElement()) {
				String lElementName = aStreamReader.getLocalName();
				if (lElementName.equals(SERVERS)) {
					break;
				}
			}
		}
		return lServers;
	}

	/**
	 * Read the map of settings
	 *
	 * @param streamReader the stream reader object
	 * @return the list of domains for the engine
	 * @throws XMLStreamException in case of stream exception
	 */
	private Map<String, String> getSettings(XMLStreamReader aStreamReader)
			throws XMLStreamException {
		Map<String, String> lSettings = new FastMap<String, String>();
		while (aStreamReader.hasNext()) {
			aStreamReader.next();
			if (aStreamReader.isStartElement()) {
				String lElementName = aStreamReader.getLocalName();
				if (lElementName.equals(SETTING)) {
					// TODO: Don't just get first attribute here! Scan for key="xxx"!
					String lKey = aStreamReader.getAttributeValue(0);
					aStreamReader.next();
					String lValue = aStreamReader.getText();
					if (lKey != null && lValue != null) {
						lSettings.put(lKey, lValue);
					}
				}
			}
			if (aStreamReader.isEndElement()) {
				String lElementName = aStreamReader.getLocalName();
				if (lElementName.equals(SETTINGS)) {
					break;
				}
			}
		}
		return lSettings;
	}
}
