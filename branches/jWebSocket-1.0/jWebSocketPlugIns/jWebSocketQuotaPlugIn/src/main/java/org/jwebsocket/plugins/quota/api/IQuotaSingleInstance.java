//	---------------------------------------------------------------------------
//	jWebSocket - jWebSocket IQuota Single Instance (Community Edition, CE)
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

import javolution.util.FastMap;
import org.jwebsocket.plugins.quota.definitions.singleIntance.QuotaChildSI;
import org.jwebsocket.token.Token;

/**
 *
 * @author Osvaldo Aguilar Lauzurique
 */
public interface IQuotaSingleInstance {

    /**
     *
     * @return the quota value
     */
    public long getvalue();

    /**
     * Return the Instance owner of the quota admin, administrator, sms-app, or
     * x-module
     *
     * @return
     */
    public String getInstance();

    /**
     *
     * @return the quota unique ID
     */
    public String getUuid();

    /**
     *
     * @return the namespace of the feature that the quota is apply to
     */
    public String getNamespace();

    /**
     *
     * @return the quota type
     */
    public String getQuotaType();

    /**
     * The type of the Instance (e.g) user, gruop of users, app or module
     *
     * @return
     */
    public String getInstanceType();

    /**
     *
     * @param aChildQuota
     * @return
     */
    public boolean addChildQuota(QuotaChildSI aChildQuota);

    /**
     *
     * @param aInstance
     * @return
     */
    public QuotaChildSI getChildQuota(String aInstance);

    /**
     *
     * @return
     */
    public String getQuotaIdentifier();

    /**
     *
     * @return
     */
    public String getActions();

    /**
     *
     * @param lAuxToken
     */
    public void writeToToken(Token lAuxToken);

    /**
     *
     * @return
     */
    public FastMap<String, Object> writeToMap();
}
