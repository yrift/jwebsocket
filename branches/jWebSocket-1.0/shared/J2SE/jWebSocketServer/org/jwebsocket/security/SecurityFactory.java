//	---------------------------------------------------------------------------
//	jWebSocket - Security Factory (Community Edition, CE)
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
package org.jwebsocket.security;

import java.util.List;
import java.util.Set;
import org.jwebsocket.config.JWebSocketConfig;
import org.jwebsocket.config.xml.RightConfig;
import org.jwebsocket.config.xml.RoleConfig;
import org.jwebsocket.config.xml.UserConfig;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.ProviderManager;

/**
 * implements the security capabilities of jWebSocket.
 *
 * @author aschulze
 */
public class SecurityFactory {

	// private static Logger log = Logging.getLogger(SecurityFactory.class);
	private static Users mUsers = null;
	private static Rights mRights = null;
	private static Roles mRoles = null;
	/**
	 *
	 */
	public static String USER_ANONYMOUS = "anonymous";
	/**
	 *
	 */
	public static String USER_GUEST = "guest";
	/**
	 *
	 */
	public static String USER_USER = "user";
	/**
	 *
	 */
	public static String USER_ROOT = "root";
	/**
	 *
	 */
	public static String USER_LOCKED = "locked";
	private static boolean mAutoAnonymous = false;
	private static final boolean mUseSpring = true;
	private static AuthenticationProvider mAuthProv;
	private static ProviderManager mAuthProvMgr;

	/**
	 * Initializes the security system programmatically to allow to a startup
	 * without a config file in embedded environments!
	 */
	/*
	 public static void initDefault() {
	 mRights = new Rights();
	 // specify rights
	 Right lRPC = new Right("org.jwebsocket.plugins.rpc", "rpc", "Allow Remote Procedure Calls (RPC) to server");
	 Right lRRPC = new Right("org.jwebsocket.plugins.rpc", "rrpc", "Allow Reverse Remote Procedure Calls (RRPC) to other clients");
	 mRights.addRight(lRPC);
	 mRights.addRight(lRRPC);
	
	 // specify roles and assign rights to roles
	 // TODO: needs to be removed in final release!
	 Role lGuestRole = new Role("guest", "Guests", lRPC, lRRPC);
	 Role lUserRole = new Role("regUser", "Registered Users", lRPC, lRRPC);
	 Role lAdminRole = new Role("admin", "Administrators", lRPC, lRRPC);
	
	 // specify role sets for a simpler assignment to the users
	 Roles lGuestRoles = new Roles(lGuestRole);
	 Roles lUserRoles = new Roles(lGuestRole, lUserRole);
	 Roles lAdminRoles = new Roles(lGuestRole, lUserRole, lAdminRole);
	
	 User lAnonymous = new User(User.generateUUID(), USER_ANONYMOUS, "anonymous", "", "", lGuestRoles);
	 User lGuest = new User(User.generateUUID(), USER_GUEST, "guest", "guest", "guest", lGuestRoles);
	 User lUser = new User(User.generateUUID(), USER_USER, "user", "user", "user", lUserRoles);
	 User lRoot = new User(User.generateUUID(), USER_ROOT, "root", "root", "root", lAdminRoles);
	 // add a locked user for test purposes, e.g. to reject token in system filter
	 User lLockedUser = new User(User.generateUUID(), USER_LOCKED, "locked", "locked", "locked", lGuestRoles);
	 lLockedUser.setStatus(User.ST_LOCKED);
	
	 mUsers = new Users();
	 mUsers.addUser(lAnonymous);
	 mUsers.addUser(lGuest);
	 mUsers.addUser(lUser);
	 mUsers.addUser(lRoot);
	 mUsers.addUser(lLockedUser);
	
	 // log.info("Default rights, roles and users initialized.");
	 }
	 */
	/**
	 * initializes the security system with the settings from the
	 * jWebSocket.xml.
	 *
	 * @param aConfig
	 */
	public static void initFromConfig(JWebSocketConfig aConfig) {

		// build list of rights
		List<RightConfig> lGlobalRights = aConfig.getGlobalRights();
		mRights = new Rights();
		for (RightConfig lRightConfig : lGlobalRights) {
			Right lRight = new Right(
					lRightConfig.getNamespace(),
					lRightConfig.getId(),
					lRightConfig.getDescription());
			mRights.addRight(lRight);
		}

		// build list of roles
		List<RoleConfig> globalRoles = aConfig.getGlobalRoles();
		mRoles = new Roles();
		for (RoleConfig lRoleConfig : globalRoles) {
			Rights lRights = new Rights();
			for (String lRightId : lRoleConfig.getRights()) {
				Right lRight = mRights.get(lRightId);
				if (lRight != null) {
					lRights.addRight(lRight);
				}
			}
			Role lRole = new Role(
					lRoleConfig.getId(),
					lRoleConfig.getDescription(),
					lRights);
			mRoles.addRole(lRole);
		}

		// build list of users
		List<UserConfig> globalUsers = aConfig.getUsers();
		mUsers = new Users();
		for (UserConfig lUserConfig : globalUsers) {
			Roles lRoles = new Roles();
			for (String lRoleId : lUserConfig.getRoles()) {
				Role lRole = mRoles.getRole(lRoleId);
				if (lRole != null) {
					lRoles.addRole(lRole);
				}
			}
			User lUser = new User(
					lUserConfig.getUUID(),
					lUserConfig.getLoginname(),
					lUserConfig.getFirstname(),
					lUserConfig.getLastname(),
					lUserConfig.getPassword(),
					lRoles);

			mUsers.addUser(lUser);
		}

		// log.info("Rights, roles and users successfully initialized.");
	}

	/**
	 *
	 */
	public static void init() {
		// initialize the security factory with some default demo data
		// to show at least something even with no config
		// TODO: only temporary, will be removed in the final release!
		// SecurityFactory.initDefault();
	}

	/**
	 * Returns a user by its loginname or <tt>null</tt> if no user with the
	 * given loginname could be found.
	 *
	 * @param aLoginname
	 * @return
	 */
	public static User getUser(String aLoginname) {
		// if user is not logged in use configured "anonymous" account
		User lUser = null;
		if (aLoginname != null) {
			lUser = mUsers.getUserByLoginName(aLoginname);
			if (null == lUser && mAutoAnonymous) {
				lUser = mUsers.getUserByLoginName(USER_ANONYMOUS);
			}
		}
		return lUser;
	}

	/**
	 *
	 * @param aLoginname
	 * @return
	 */
	public static boolean isValidUser(String aLoginname) {
		User lUser = mUsers.getUserByLoginName(aLoginname);
		return (lUser != null);
	}

	/**
	 * Returns the root user for the jWebSocket system.
	 *
	 * @return
	 */
	public static User getRootUser() {
		return mUsers.getUserByLoginName(USER_ROOT);
	}

	/**
	 * checks if a user identified by its login name has a certain right.
	 *
	 * @param aLoginname
	 * @param aRight
	 * @return
	 */
	public static boolean hasRight(String aLoginname, String aRight) {
		boolean lHasRight = false;
		User lUser = getUser(aLoginname);
		if (lUser != null) {
			return lUser.hasRight(aRight);
		}
		return lHasRight;
	}

	/**
	 *
	 * @param aLoginname
	 * @param aAuthority
	 * @return
	 */
	public static boolean hasAuthority(String aLoginname, String aAuthority) {
		return hasRight(aLoginname, aAuthority);
	}

	/**
	 * checks if a user identified by its login name has a certain role.
	 *
	 * @param aLoginname
	 * @param aRole
	 * @return
	 */
	public static boolean hasRole(String aLoginname, String aRole) {
		boolean lHasRole = false;
		// if user is not logged in use configured "anonymous" account
		User lUser = getUser(aLoginname);
		if (lUser != null) {
			return lUser.hasRole(aRole);
		}
		return lHasRole;
	}

	/**
	 * returns an unmodifiable set of role ids for a user instance.
	 *
	 * @param aUsername
	 * @return
	 */
	public static Set<String> getRoleIdSet(String aUsername) {
		User lUser = getUser(aUsername);
		if (lUser != null) {
			return lUser.getRoleIdSet();
		}
		return null;
	}

	/**
	 * returns an unmodifiable set of right ids for a given user instance.
	 *
	 * @param aUsername
	 * @return
	 */
	public static Set<String> getRightIdSet(String aUsername) {
		User lUser = getUser(aUsername);
		if (lUser != null) {
			return lUser.getRightIdSet();
		}
		return null;
	}

	/**
	 * returns an unmodifiable set of roles for a given user instance.
	 *
	 * @param aUsername
	 * @return
	 */
	public static Roles getUserRoles(String aUsername) {
		User lUser = getUser(aUsername);
		if (lUser != null) {
			return lUser.getRoles();
		}
		return null;
	}

	/**
	 * returns an unmodifiable set of global roles.
	 *
	 * @return
	 */
	public static Roles getGlobalRoles() {
		return mRoles;
	}

	/**
	 * returns an unmodifiable set of rights for a given user instance.
	 *
	 * @param aUsername
	 * @return
	 */
	public static Rights getUserRights(String aUsername) {
		User lUser = getUser(aUsername);
		if (lUser != null) {
			return lUser.getRights();
		}
		return null;
	}

	/**
	 * returns an unmodifiable set of global rights.
	 *
	 * @return
	 */
	public static Rights getGlobalRights() {
		return mRights;
	}

	/**
	 * returns an unmodifiable set of rights for this user instance.
	 *
	 * @param aNamespace
	 * @return
	 */
	public static Rights getGlobalRights(String aNamespace) {
		// the getRights method of the Roles class already delivers an
		// unmodifiable set of rights
		Rights lRights = new Rights();
		if (aNamespace != null) {
			for (Right lRight : mRights.getRights()) {
				if (lRight.getId().startsWith(aNamespace)) {
					lRights.addRight(lRight);
				}
			}
		}
		return lRights;
	}

	/**
	 * returns an unmodifiable set of global users.
	 *
	 * @return
	 */
	public static Users getGlobalUsers() {
		return mUsers;
	}

	/**
	 * @return the mAutoAnonymous
	 */
	public static boolean isAutoAnonymous() {
		return mAutoAnonymous;
	}

	/**
	 * @param aAutoAnonymous the autoAnonymous flag to set
	 */
	public static void setAutoAnonymous(boolean aAutoAnonymous) {
		mAutoAnonymous = aAutoAnonymous;
	}
}