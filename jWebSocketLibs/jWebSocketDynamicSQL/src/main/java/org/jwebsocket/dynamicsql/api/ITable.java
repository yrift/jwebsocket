//	---------------------------------------------------------------------------
//	jWebSocket - ClassPathUpdater (Community Edition, CE)
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
package org.jwebsocket.dynamicsql.api;

import org.apache.ddlutils.model.Table;

/**
 *
 * @author markos
 */
public interface ITable {
    
    public String getName();
    public ITable addColumn(String aName, Integer aTypeCode, Boolean aRequired, 
            Boolean aPK, Integer aSize, Object aDefault);
//    public ITable addIndex(String aColumnName);
    public ITable addUniqueIndex(String aColumnName);
    public Table getTable();
}