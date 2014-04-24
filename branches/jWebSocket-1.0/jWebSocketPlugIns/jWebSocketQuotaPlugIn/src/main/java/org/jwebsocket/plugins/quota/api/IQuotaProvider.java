//	---------------------------------------------------------------------------
//	jWebSocket - jWebSocket Quota Filter (Community Edition, CE)
//	---------------------------------------------------------------------------
//	Copyright 2010-2014 Innotrade GmbH (jWebSocket.org)
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
package org.jwebsocket.plugins.quota.api;

import java.util.Map;

/**
 *
 * @author Osvaldo Aguilar Lauzurique
 */
public interface IQuotaProvider {

	/**
	 *
	 * @param aType
	 * @return
	 * @throws Exception
	 */
	public IQuota getQuotaByIdentifier(String aType) throws Exception;

	/**
	 *
	 * @return
	 */
	public Map<String, IQuota> getActiveQuotas();

	/**
	 *
	 * @return
	 */
	public Map<String, IQuotaStorage> getActiveStorages();

	/**
	 *
	 * @param aPos
	 * @return
	 */
	public String getIdentifier(int aPos);
}
