// ---------------------------------------------------------------------------
// jWebSocket - < ITestManager >
// Copyright(c) 2010-2012 Innotrade GmbH, Herzogenrath, Germany, jWebSocket.org
// ---------------------------------------------------------------------------
// This program is free software; you can redistribute it and/or modify it
// under the terms of the GNU Lesser General Public License as published by the
// Free Software Foundation; either version 3 of the License, or (at your
// option) any later version.
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
// FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for
// more details.
// You should have received a copy of the GNU Lesser General Public License along
// with this program; if not, see <http://www.gnu.org/licenses/lgpl.html>.
// ---------------------------------------------------------------------------
package org.jwebsocket.watchdog.api;

import java.util.List;
import org.jwebsocket.api.IInitializable;
import org.jwebsocket.watchdog.test.TaskExecutionReport;

/**
 *
 * @author Lester Alfonso Zaila Viejo(telnet_1, UCI, Artemisa)
 */
public interface ITestManager extends IInitializable {
      
    /**
     * Get the list of listeners
     * 
     * @return 
     */
    List<IWatchDogTestListener> getListeners();

    /**
     * Execute the Task Execution Report receiving a Task
     * 
     * @param aTask
     * @return 
     */
    TaskExecutionReport execute(IWatchDogTask aTask);
}