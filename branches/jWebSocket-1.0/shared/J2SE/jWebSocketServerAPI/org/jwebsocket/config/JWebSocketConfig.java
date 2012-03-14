//	---------------------------------------------------------------------------
//	jWebSocket - Copyright (c) 2010 jwebsocket.org
//	---------------------------------------------------------------------------
//	This program is free software; you can redistribute it and/or modify it
//	under the terms of the GNU Lesser General Public License as published by the
//	Free Software Foundation; either version 3 of the License, or (at your
//	option) any later version.
//	This program is distributed in the hope that it will be useful, but WITHOUT
//	ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
//	FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for
//	more details.
//	You should have received a copy of the GNU Lesser General Public License along
//	with this program; if not, see <http://www.gnu.org/licenses/lgpl.html>.
//	---------------------------------------------------------------------------
package org.jwebsocket.config;

import java.io.File;
import java.net.URI;
import java.net.URL;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import javolution.util.FastMap;
import org.apache.commons.io.FilenameUtils;
import org.apache.log4j.Logger;
import static org.jwebsocket.config.JWebSocketCommonConstants.WS_SUBPROT_DEFAULT;
import static org.jwebsocket.config.JWebSocketServerConstants.*;
import org.jwebsocket.config.xml.*;
import org.jwebsocket.kit.WebSocketRuntimeException;
import org.jwebsocket.logging.Logging;
import org.jwebsocket.spring.ServerXmlBeanFactory;
import org.jwebsocket.util.Tools;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;

/**
 * Represents the jWebSocket configuration. This class is immutable and should
 * not be overridden.
 * 
 * @author puran
 * @author Marcos Antonio González Huerta (markos0886, UCI)
 * @version $Id: JWebSocketConfig.java 345 2010-04-10 20:03:48Z fivefeetfurther$
 */
public class JWebSocketConfig implements Config {

	// DON'T SET LOGGER HERE! NEEDS TO BE INITIALIZED FIRST!
	private static Logger mLog = null;
	private final String mInstallation;
	private final String mNodeId;
	private final String mProtocol;
	private final String mLibraryFolder;
	private final String mInitializer;
	private final List<LibraryConfig> mLibraries;
	private final List<EngineConfig> mEngines;
	private final List<ServerConfig> mServers;
	private final List<UserConfig> mUsers;
	private final List<PluginConfig> mPlugins;
	private final List<FilterConfig> mFilters;
	private final LoggingConfig mLoggingConfig;
	private final List<RightConfig> mGlobalRights;
	private final List<RoleConfig> mGlobalRoles;
	private static JWebSocketConfig mConfig = null;
	private static ClassLoader mClassLoader = null;
	private static String mConfigOverrideRoot = null;
	private static String mJWebSocketHome = null;

	/**
	 * @return the mClassLoader
	 */
	public static ClassLoader getClassLoader() {
		return mClassLoader;
	}

	/**
	 * 
	 * @param aClassLoader 
	 */
	public static void setClassLoader(ClassLoader aClassLoader) {
		mClassLoader = aClassLoader;
	}

	/**
	 * @return the installation
	 */
	public String getInstallation() {
		if (mInstallation == null || mInstallation.length() == 0) {
			return DEFAULT_INSTALLATION;
		}
		return mInstallation;
	}

	/**
	 * @return the protocol
	 */
	public String getProtocol() {
		if (mProtocol == null || mProtocol.length() == 0) {
			return WS_SUBPROT_DEFAULT;
		}
		return mProtocol;
	}

	/**
	 * @return the node-id
	 */
	public String getNodeId() {
		if (mNodeId == null || mNodeId.length() == 0) {
			return DEFAULT_NODE_ID;
		}
		return mNodeId;
	}

	/**
	 * @return the jWebSocketHome (environment variable or command line option)
	 */
	public static String getJWebSocketHome() {
		// check if instance mJWebSocketHome is still null (not yet set)
		if (null == mJWebSocketHome) {
			mJWebSocketHome = System.getProperty(JWebSocketServerConstants.JWEBSOCKET_HOME);
			if (null != mJWebSocketHome) {
				System.out.println("Using property "
						+ JWebSocketServerConstants.JWEBSOCKET_HOME + ": "
						+ mJWebSocketHome);
			}	
		}
		if (null == mJWebSocketHome) {
			mJWebSocketHome = System.getenv(JWebSocketServerConstants.JWEBSOCKET_HOME);
			if (null != mJWebSocketHome) {
				System.out.println("Using environment variable "
						+ JWebSocketServerConstants.JWEBSOCKET_HOME + ": "
						+ mJWebSocketHome);
			}	
		}
		
		if (null == mJWebSocketHome) {
			mJWebSocketHome = "";
		}
		
		if (!mJWebSocketHome.isEmpty()) {
			// replace potential backslahes by normal slashes to be accepted in URLs
			mJWebSocketHome = mJWebSocketHome.replace('\\', '/');
			// add a trailing path separator
			String lFileSep = "/"; // System.getProperty("file.separator");
			if (!mJWebSocketHome.endsWith(lFileSep)) {
				mJWebSocketHome += lFileSep;
			}
		}
		return mJWebSocketHome;
	}

	/**
	 * Specify the jWebSocketHome (environment variable or command line option)
	 * 
	 * @param aJWebSocketHome 
	 */
	public static void setJWebSocketHome(String aJWebSocketHome) {
		if (null != aJWebSocketHome) {
			mJWebSocketHome = aJWebSocketHome;
			// add a trailing (back)slash
			String lFileSep = System.getProperty("file.separator");
			if (!mJWebSocketHome.endsWith(lFileSep)) {
				mJWebSocketHome += lFileSep;
			}
		}
	}

	/**
	 * 
	 * @param aString
	 * @return
	 */
	public static String expandEnvAndJWebSocketVars(String aString) {
		Map lVars = new FastMap<String, String>();
		lVars.putAll(System.getenv());
		lVars.put(JWebSocketServerConstants.JWEBSOCKET_HOME, JWebSocketConfig.getJWebSocketHome());
		String lRes = Tools.expandVars(aString, lVars, true);
		return lRes;
	}

	/**
	 * @return the libraryFolder
	 */
	public String getLibraryFolder() {
		return mLibraryFolder;
	}

	/**
	 * @return the initializer
	 */
	public String getInitializer() {
		return mInitializer;
	}

	/**
	 * @return the config
	 */
	public static JWebSocketConfig getConfig() {
		return mConfig;
	}

	/**
	 * private constructor used by the builder
	 */
	private JWebSocketConfig(Builder aBuilder) {
		if (aBuilder.mEngines == null
				|| aBuilder.mServers == null
				|| aBuilder.mPlugins == null
				|| aBuilder.mUsers == null
				|| aBuilder.mGlobalRights == null
				|| aBuilder.mGlobalRoles == null
				|| aBuilder.getFilters() == null
				|| aBuilder.mLoggingConfig == null) {
			throw new WebSocketRuntimeException("Configuration is not loaded completely.");
		}
		mInstallation = aBuilder.mInstallation;
		mProtocol = aBuilder.mProtocol;
		mNodeId = aBuilder.mNodeId;
		mLibraryFolder = aBuilder.mLibraryFolder;
		mInitializer = aBuilder.mInitializer;
		mLibraries = aBuilder.mLibraries;
		mEngines = aBuilder.mEngines;
		mServers = aBuilder.mServers;
		mUsers = aBuilder.mUsers;
		mPlugins = aBuilder.mPlugins;
		mFilters = aBuilder.getFilters();
		mLoggingConfig = aBuilder.mLoggingConfig;
		mGlobalRights = aBuilder.mGlobalRights;
		mGlobalRoles = aBuilder.mGlobalRoles;
		// validate the config
		validate();
	}

	/**
	 * Config builder class.
	 *
	 * @author puran
	 * @version $Id: JWebSocketConfig.java 596 2010-06-22 17:09:54Z
	 *          fivefeetfurther $
	 */
	public static class Builder {

		private String mInstallation;
		private String mProtocol;
		private String mNodeId;
		private String mLibraryFolder;
		private String mInitializer;
		private List<LibraryConfig> mLibraries;
		private List<EngineConfig> mEngines;
		private List<ServerConfig> mServers;
		private List<UserConfig> mUsers;
		private List<PluginConfig> mPlugins;
		private List<FilterConfig> mFilters;
		private LoggingConfig mLoggingConfig;
		private List<RightConfig> mGlobalRights;
		private List<RoleConfig> mGlobalRoles;

		/**
		 *
		 * @param aInstallation
		 * @return
		 */
		public Builder setInstallation(String aInstallation) {
			mInstallation = aInstallation;
			return this;
		}

		/**
		 *
		 * @param aProtocol
		 * @return
		 */
		public Builder setProtocol(String aProtocol) {
			mProtocol = aProtocol;
			return this;
		}

		/**
		 *
		 * @param aNodeId
		 * @return
		 */
		public Builder setNodeId(String aNodeId) {
			mNodeId = aNodeId;
			return this;
		}

		/**
		 *
		 * @param aInitializer
		 * @return
		 */
		public Builder setInitializer(String aInitializer) {
			mInitializer = aInitializer;
			return this;
		}

		/**
		 *
		 * @param aLibraryFolder
		 * @return
		 */
		public Builder setLibraryFolder(String aLibraryFolder) {
			mLibraryFolder = aLibraryFolder;
			return this;
		}

		/**
		 *
		 * @param aLibraries
		 * @return
		 */
		public Builder setLibraries(List<LibraryConfig> aLibraries) {
			mLibraries = aLibraries;
			return this;
		}

		/**
		 *
		 * @param aEngines
		 * @return
		 */
		public Builder setEngines(List<EngineConfig> aEngines) {
			mEngines = aEngines;
			return this;
		}

		/**
		 *
		 * @param aServers
		 * @return
		 */
		public Builder setServers(List<ServerConfig> aServers) {
			mServers = aServers;
			return this;
		}

		/**
		 *
		 * @param aPlugins
		 * @return
		 */
		public Builder setPlugins(List<PluginConfig> aPlugins) {
			mPlugins = aPlugins;
			return this;
		}

		/**
		 *
		 * @param aFilters
		 * @return
		 */
		public Builder setFilters(List<FilterConfig> aFilters) {
			mFilters = aFilters;
			return this;
		}

		/**
		 *
		 * @param aLoggingConfigs
		 * @return
		 */
		public Builder setLoggingConfig(List<LoggingConfig> aLoggingConfigs) {
			mLoggingConfig = aLoggingConfigs.get(0);
			return this;
		}

		/**
		 *
		 * @param aRights
		 * @return
		 */
		public Builder setGlobalRights(List<RightConfig> aRights) {
			mGlobalRights = aRights;
			return this;
		}

		/**
		 *
		 * @param aRoles
		 * @return
		 */
		public Builder setGlobalRoles(List<RoleConfig> aRoles) {
			mGlobalRoles = aRoles;
			return this;
		}

		/**
		 *
		 * @param aUsers
		 * @return
		 */
		public Builder setUsers(List<UserConfig> aUsers) {
			mUsers = aUsers;
			return this;
		}

		/**
		 *
		 * @return
		 */
		public synchronized JWebSocketConfig buildConfig() {
//			if (mConfig == null) {
			mConfig = new JWebSocketConfig(this);
//			}
			return mConfig;
		}

		/**
		 * @return the filters
		 */
		public List<FilterConfig> getFilters() {
			return mFilters;
		}
	}

	/**
	 * @return the engines
	 */
	public List<LibraryConfig> getLibraries() {
		if (mLibraries != null) {
			return Collections.unmodifiableList(mLibraries);
		}
		return null;
	}

	/**
	 * @return the engines
	 */
	public List<EngineConfig> getEngines() {
		if (mEngines != null) {
			return Collections.unmodifiableList(mEngines);
		}
		return null;
	}

	/**
	 * @return the servers
	 */
	public List<ServerConfig> getServers() {
		if (mServers != null) {
			return Collections.unmodifiableList(mServers);
		}
		return null;
	}

	/**
	 * @return the users
	 */
	public List<UserConfig> getUsers() {
		if (mUsers != null) {
			return Collections.unmodifiableList(mUsers);
		}
		return null;
	}

	/**
	 * @return the plugins
	 */
	public List<PluginConfig> getPlugins() {
		if (mPlugins != null) {
			return Collections.unmodifiableList(mPlugins);
		}
		return null;
	}

	/**
	 * 
	 * @param aIdPlugIn
	 * @return
	 */
	public PluginConfig getPlugin(String aIdPlugIn) {
		if (mPlugins != null) {
			for (int i = 0; i < mPlugins.size(); i++) {
				if (mPlugins.get(i).getId().equals(aIdPlugIn)) {
					return mPlugins.get(i);
				}
			}
		}
		return null;
	}

	/**
	 * @return the filters
	 */
	public List<FilterConfig> getFilters() {
		if (mFilters != null) {
			return Collections.unmodifiableList(mFilters);
		}
		return null;
	}

	/**
	 * 
	 * @param aIdFilter
	 * @return
	 */
	public FilterConfig getFilter(String aIdFilter) {
		if (mFilters != null) {
			for (int i = 0; i < mFilters.size(); i++) {
				if (mFilters.get(i).getId().equals(aIdFilter)) {
					return mFilters.get(i);
				}
			}
		}
		return null;
	}

	/**
	 * @return the logging config object
	 */
	public LoggingConfig getLoggingConfig() {
		return mLoggingConfig;
	}

	/**
	 * @return the globalRights
	 */
	public List<RightConfig> getGlobalRights() {
		if (mGlobalRights != null) {
			return Collections.unmodifiableList(mGlobalRights);
		}
		return null;
	}

	/**
	 * @return the globalRoles
	 */
	public List<RoleConfig> getGlobalRoles() {
		if (mGlobalRoles != null) {
			return Collections.unmodifiableList(mGlobalRoles);
		}
		return null;
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void validate() {
		if ( // we at least need one engine to process the connections
				(mEngines == null || mEngines.isEmpty())
				// we at least need one server to route the messages
				|| (mServers == null || mServers.isEmpty())
				|| (mUsers == null || mUsers.isEmpty())
				// we at least need the system plug-in
				|| (mPlugins == null || mPlugins.isEmpty())
				// the libraries section does not necessarily need to exist!
				// if not simply no external libraries are loaded.
				// || (mLibraries == null || mLibraries.isEmpty())

				// we do not want to force the users to use filters.
				// please leave this comment to prevent introducing the
				// following line again!
				|| (mFilters == null) /* || mFilters.isEmpty() */
				|| (mLoggingConfig == null)
				|| (mGlobalRights == null || mGlobalRights.isEmpty())
				|| (mGlobalRoles == null || mGlobalRoles.isEmpty())) {
			throw new WebSocketRuntimeException("Missing one of the server configuration, please check your configuration file");
		}
	}

	private static void checkLogs() {
		if (mLog == null) {
			mLog = Logging.getLogger(JWebSocketConfig.class);
		}
	}

	/**
	 * private method that checks the path of the jWebSocket.xml file
	 * @return the path to jWebSocket.xml
	 */
	public static String getConfigurationPath() {
		String lWebSocketXML = null;
		String lWebSocketHome = null;
		String lFileSep = System.getProperty("file.separator");
		File lFile;
		// try to obtain JWEBSOCKET_HOME environment variable
		lWebSocketHome = JWebSocketConfig.getJWebSocketHome();
		System.out.println("Looking for config file: " + lWebSocketHome + "...");
		if (lWebSocketHome != null) {
			// jWebSocket.xml can be located in %JWEBSOCKET_HOME%/conf
			lWebSocketXML = lWebSocketHome + "conf" + lFileSep + JWEBSOCKET_XML;
			lFile = new File(lWebSocketXML);
			System.out.println("Checking config " + lWebSocketXML);
			if (lFile.exists()) {
				return lWebSocketXML;
			}
		}

		// finally try to find config file at %CLASSPATH%/conf/
		URL lURL = Thread.currentThread().getContextClassLoader().getResource("conf/" + JWEBSOCKET_XML);
		System.out.println("Looking for config file in classpath " + lURL.toString());
		if (lURL != null) {
			try {
				URI lFilename = lURL.toURI();
				lFile = new File(lFilename);
				System.out.println("Checking config " + lFile.getPath());
				if (lFile.exists()) {
					lWebSocketXML = lFile.getPath();
					return lWebSocketXML;
				}
			} catch (Exception ex) {
			}
		}

		return null;
	}

	/**
	 * private method that checks the path of the jWebSocket.xml file
	 *
	 * @param aText 
	 * @param aSubFolder 
	 * @param aFilename
	 * @param aClassLoader 
	 * @return the path to jWebSocket.xml
	 */
	public static String getSubFolder(String aText, String aSubFolder,
			String aFilename, ClassLoader aClassLoader) {

		String lPath;
		String lJWebSocketHome;
		File lFile;

		checkLogs();

		// try to load resource from %JWEBSOCKET_HOME%sub folder
		lJWebSocketHome = JWebSocketConfig.getJWebSocketHome();
		if (lJWebSocketHome != null) {

			// if JWEBSOCKET_HOME not set and not given try to eval from resource
			// System.out.println("Loading from folder...");
			if (lJWebSocketHome.isEmpty() && null != aClassLoader) {
				URL lURL = aClassLoader.getResource("/");
				if (null != lURL) {
					lJWebSocketHome = lURL.getPath();
					// System.out.println("URL found: " + lJWebSocketHome);
				} else {
					// System.out.println("URL not found!");
				}	
			}

			// file can to be located in %JWEBSOCKET_HOME%<folder>/
			lPath = lJWebSocketHome + aSubFolder + "/"
					+ (null != aFilename ? aFilename : "");
			lFile = new File(lPath);
			if (lFile.exists()) {
				if (mLog.isDebugEnabled()) {
					mLog.debug("Found " + aText + " at " + lPath + "...");
				}
				return lPath;
			} else {
				mLog.warn(aFilename + " not found at " + lPath + ".");
			}
		}
		return null;
	}

	/**
	 *
	 * @param aFilename
	 * @return
	 */
	public static String getLogsFolder(String aFilename) {
		return getSubFolder("log file", "logs", aFilename, null);
	}

	/**
	 *
	 * @param aFilename
	 * @return
	 */
	public static String getTempFolder(String aFilename) {
		return getSubFolder("temporary file", "temp", aFilename, null);
	}

	/**
	 *
	 * @param aFilename
	 * @return
	 */
	public static String getBinFolder(String aFilename) {
		return getSubFolder("binary file", "bin", aFilename, null);
	}

	/**
	 *
	 * @param aFilename
	 * @return
	 */
	public static String getConfigFolder(String aFilename) {
		return getSubFolder("config file", "conf", aFilename, null);
	}

	/**
	 * 
	 * @param aFilename
	 * @param aClassLoader
	 * @return
	 */
	public static String getConfigFolder(String aFilename, ClassLoader aClassLoader) {
		return getSubFolder("config file", "conf", aFilename, aClassLoader);
	}

	/**
	 *
	 * @param aFilename
	 * @param aClassLoader 
	 * @return
	 */
	public static String getLibsFolder(String aFilename, ClassLoader aClassLoader) {
		return getSubFolder("library", "libs", aFilename, aClassLoader);
	}

	/**
	 *
	 * @param aFilename
	 * @return
	 */
	public static String getLibsFolder(String aFilename) {
		return getSubFolder("library", "libs", aFilename, null);
	}

	/**
	 * 
	 * @param aPath
	 * @return
	 */
	public static URL getURLFromPath(String aPath) {
		// lURL = ClassLoader.getSystemClassLoader().getResource(aPath);
		URL lURL = getURLFromPath(aPath, Thread.currentThread().getContextClassLoader());
		return lURL;
	}

	/**
	 * 
	 * @param aPath
	 * @param aClassLoader
	 * @return
	 */
	public static URL getURLFromPath(String aPath, ClassLoader aClassLoader) {
		String lWebSocketHome = JWebSocketConfig.getJWebSocketHome();
		URL lURL = null;
		try {
			if (lWebSocketHome != null && !lWebSocketHome.isEmpty()) {
				lURL = new URL("file://" + aPath);
			} else {
				lURL = aClassLoader.getResource(aPath);
			}
		} catch (Exception lEx) {
			System.out.println(lEx.getClass().getSimpleName() + ": " + lEx.getMessage());
		}
		return lURL;
	}

	/**
	 * 
	 * @param aForClass
	 * @param aPath
	 * @return
	 */
	public static ServerXmlBeanFactory getConfigBeanFactory(Class aForClass, String aPath) {
		String lSpringConfig = aPath;
		lSpringConfig = JWebSocketConfig.expandEnvAndJWebSocketVars(lSpringConfig);
		String lPath = FilenameUtils.getPath(lSpringConfig);
		if (lPath == null || lPath.length() <= 0) {
			lPath = JWebSocketConfig.getConfigFolder(lSpringConfig);
		} else {
			lPath = lSpringConfig;
		}
		Resource lRes =
				JWebSocketConfig.getJWebSocketHome().isEmpty()
				? new ClassPathResource(lPath)
				: new FileSystemResource(lPath);
		ServerXmlBeanFactory lBeanFactory = new ServerXmlBeanFactory(lRes, aForClass.getClassLoader());
		return lBeanFactory;
	}
}
