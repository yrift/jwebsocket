// ---------------------------------------------------------------------------
// jWebSocket - JoystickProgram (Community Edition, CE)
//	---------------------------------------------------------------------------
//	Copyright 2010-2015 Innotrade GmbH (jWebSocket.org), Germany (NRW), Herzogenrath
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
package org.jwebsocket.plugins.arduino.util;

/**
 *
 * @author Dariel Noa (dnoa@hab.uci.cu, UCI, Artemisa)
 */
public class JoystickProgram {

	/**
	 *
	 * @param aData
	 * @return
	 */
	public static Integer[] treatValues(String aData) {
		Integer lX = Integer.valueOf(aData.split("_")[0]);
		String lTempY = aData.split("_")[1];
		Integer lY = Integer.valueOf(lTempY.substring(0, lTempY.length() - 1));

		return new Integer[]{lX, lY};
	}
}
