//	---------------------------------------------------------------------------
//	jWebSocket - ClassPathUpdater (Community Edition, CE)
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
package org.jwebsocket.dynamicsql;

import java.sql.Types;
import javax.sql.DataSource;
import org.jwebsocket.dynamicsql.api.ITable;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

/**
 *
 * @author markos
 */
public class Main {
    
    public static final String FIELD_ID = "id";
    public static final String FIELD_COLLECTION_NAME = "collectionName";
    public static final String FIELD_TYPE = "type";
    public static final String FIELD_UID = "UID";
    public static String CLIENTS_TABLE_NAME = "test_table";

    public static void main(String[] args) throws Exception {
        final ApplicationContext context = new ClassPathXmlApplicationContext(
                new String[]{"spring-config.xml"});
        DataSource lDataSource = (DataSource) context.getBean("dataSource");

        ITable lTable = new DynaTable(CLIENTS_TABLE_NAME)
                    .addColumn(FIELD_ID, Types.VARCHAR, Boolean.TRUE, Boolean.TRUE, 50, null)
                    .addColumn(FIELD_UID, Types.VARCHAR, Boolean.TRUE, Boolean.FALSE, 50, null)
                    .addColumn(FIELD_COLLECTION_NAME, Types.VARCHAR, Boolean.TRUE, Boolean.FALSE, 254, null)
                    .addColumn(FIELD_TYPE, Types.VARCHAR, Boolean.TRUE, Boolean.FALSE, 254, null)
                    .addIndex(FIELD_COLLECTION_NAME)
                    .addIndex(FIELD_TYPE);
        
        DynaDB db = new DynaDB("generate_db", lDataSource);
        db.addTable(lTable);

        System.out.println(db.existsTable(CLIENTS_TABLE_NAME));

        db.dropTable(CLIENTS_TABLE_NAME);

        System.out.println(db.existsTable(CLIENTS_TABLE_NAME));
    }
}
