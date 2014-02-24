//	---------------------------------------------------------------------------
//	jWebSocket - BaseLogger (Community Edition, CE)
//	---------------------------------------------------------------------------
//	Copyright 2010-2014 Innotrade GmbH (jWebSocket.org)
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
package org.jwebsocket.plugins.logging;

/**
 *
 * @author aschulze
 */
public class BaseLogger implements ILogger {

	private LogLevel mLogLevel = null;

	/**
	 *
	 * @param aLogLevel
	 */
	@Override
	public void setLevel(LogLevel aLogLevel) {
		mLogLevel = aLogLevel;
	}

	/**
	 *
	 * @return
	 */
	@Override
	public LogLevel getLevel() {
		return mLogLevel;
	}

	/**
	 *
	 * @param aMsg
	 */
	@Override
	public void log(LogLevel aLogLevel, String aInfo, String aMsg) {
	}

	/**
	 *
	 * @param aMsg
	 */
	@Override
	public void debug(String aMsg) {
		log(LogLevel.DEBUG, null, aMsg);
	}

	/**
	 *
	 * @param aMsg
	 */
	@Override
	public void info(String aMsg) {
		log(LogLevel.INFO, null, aMsg);
	}

	/**
	 *
	 * @param aMsg
	 */
	@Override
	public void warn(String aMsg) {
		log(LogLevel.WARN, null, aMsg);
	}

	/**
	 *
	 * @param aMsg
	 */
	@Override
	public void error(String aMsg) {
		log(LogLevel.ERROR, null, aMsg);
	}

	/**
	 *
	 * @param aMsg
	 */
	@Override
	public void fatal(String aMsg) {
		log(LogLevel.FATAL, null, aMsg);
	}
}