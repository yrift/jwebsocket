//	---------------------------------------------------------------------------
//	jWebSocket - jWebSocket JCaptcha Plug-in (Community Edition, CE)
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
package org.jwebsocket.plugins.jcaptcha;

/**
 *
 * @author mayra, Victor Antonio Barzana Crespo, Alexander Schulze, Rolando
 * Santamaria Maso
 */
import com.octo.captcha.service.CaptchaServiceException;
import java.awt.image.BufferedImage;
import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.StringReader;
import java.net.URL;
import javax.imageio.ImageIO;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;
import javax.net.ssl.HttpsURLConnection;
import org.apache.log4j.Logger;
import org.json.JSONException;
import org.json.JSONObject;
import org.jwebsocket.api.PluginConfiguration;
import org.jwebsocket.api.WebSocketConnector;
import org.jwebsocket.config.JWebSocketCommonConstants;
import org.jwebsocket.config.JWebSocketServerConstants;
import org.jwebsocket.kit.PlugInResponse;
import org.jwebsocket.logging.Logging;
import org.jwebsocket.plugins.TokenPlugIn;
import org.jwebsocket.token.Token;
import org.jwebsocket.util.Tools;

/**
 *
 * @author Alexander Schulze
 */
public class JCaptchaPlugIn extends TokenPlugIn {

	private static final Logger mLog = Logging.getLogger();
	private static final String NS_JCAPTCHA
			= JWebSocketServerConstants.NS_BASE + ".plugins.jcaptcha";
	private final static String VERSION = "1.0.0";
	private final static String VENDOR = JWebSocketCommonConstants.VENDOR_CE;
	private final static String LABEL = "jWebSocket JCaptchaPlugIn";
	private final static String COPYRIGHT = JWebSocketCommonConstants.COPYRIGHT_CE;
	private final static String LICENSE = JWebSocketCommonConstants.LICENSE_CE;
	private final static String DESCRIPTION = "jWebSocket JCaptchaPlugIn - Community Edition";
	private final static String TT_GET_CAPTCHA = "getcaptcha";
	private final static String TT_VALIDATE_CAPTCHA = "validate";
	private final static String TT_VALIDATE_RE_CAPTCHA = "validaterecaptcha";

	// reCaptcha secret key used to validate the user selection
	private String mReCaptchaSecretKey = "";
	private String mReCaptchaRemoteIp = "";
	private String mImgType = null;

	/**
	 *
	 * @param aConfiguration
	 */
	public JCaptchaPlugIn(PluginConfiguration aConfiguration) {
		super(aConfiguration);
		if (mLog.isDebugEnabled()) {
			mLog.debug("Instantiating JCaptcha plug-in...");
		}
		setNamespace(NS_JCAPTCHA);
		mReCaptchaSecretKey = aConfiguration.getString("recaptcha_secret_key");
		mReCaptchaRemoteIp = aConfiguration.getString("recaptcha_remote_ip");

		if (mLog.isInfoEnabled()) {
			mLog.info("JCaptcha plug-in successfully instantiated.");
		}
	}

	@Override
	public String getVersion() {
		return VERSION;
	}

	@Override
	public String getLabel() {
		return LABEL;
	}

	@Override
	public String getDescription() {
		return DESCRIPTION;
	}

	@Override
	public String getVendor() {
		return VENDOR;
	}

	@Override
	public String getCopyright() {
		return COPYRIGHT;
	}

	@Override
	public String getLicense() {
		return LICENSE;
	}

	@Override
	public String getNamespace() {
		return NS_JCAPTCHA;
	}

	@Override
	public void processToken(PlugInResponse aResponse, WebSocketConnector aConnector, Token aToken) {

		if (aToken.getNS().equals(getNamespace())) {
			if (TT_GET_CAPTCHA.equals(aToken.getType())) {
				mImgType = aToken.getString("imageType");
				mImgType
						= mImgType == null
								? "png"
								: mImgType.trim().toLowerCase();

				if (!mImgType.equalsIgnoreCase("png")
						&& !mImgType.equalsIgnoreCase("jpg")
						&& !mImgType.equalsIgnoreCase("jpeg")) {
					mImgType = "png";
				}

				generateCaptcha(aToken, aConnector);
			}
		}
	}

	@Override
	public Token invoke(WebSocketConnector aConnector, Token aToken) {
		Token lResponse = createResponse(aToken);
		lResponse.setInteger("code", -1);

		if (NS_JCAPTCHA.equals(aToken.getNS())) {
			if (TT_VALIDATE_CAPTCHA.equals(aToken.getType())) {
				if (validateCaptcha(aConnector.getSession().getSessionId(), aToken.getString("inputChars"))) {
					lResponse.setInteger("code", 0);
				} else {
					lResponse.setString("msg", "Invalid captcha!");
				}
			} else if (TT_VALIDATE_RE_CAPTCHA.equals(aToken.getType())) {
				// Execute the validation mechanism for re-captcha
				lResponse.setCode(0);
				boolean lCaptchaResult = validateReCaptcha(mReCaptchaSecretKey, aToken.getString("g-recaptcha-response"), mReCaptchaRemoteIp);
				lResponse.setBoolean("success", lCaptchaResult);
			} else {
				lResponse.setString("msg", "Operation not supported!");
			}
		}

		return lResponse;
	}

	/**
	 *
	 * @param aToken
	 * @param aConnector
	 */
	public void generateCaptcha(Token aToken, WebSocketConnector aConnector) {
		ByteArrayOutputStream lImgOutputStream = new ByteArrayOutputStream();
		byte[] lCaptchaBytes;
		Token lResponse = createResponse(aToken);
		try {
			// Session ID is used to identify the particular captcha.
			String lCaptchaId = aConnector.getSession().getSessionId();

			if (mLog.isDebugEnabled()) {
				mLog.debug("Generating captcha for id: " + lCaptchaId);
			}
			// Generate the captcha image.
			// BufferedImage challengeImage = JWebSocketCaptchaService.getInstance().getImageChallengeForID(captchaId , aToken.getString("locale"));
			BufferedImage lChallengeImage = JWebSocketCaptchaService.getInstance().getImageChallengeForID(lCaptchaId);

			ImageIO.write(lChallengeImage, mImgType, lImgOutputStream);

			lCaptchaBytes = lImgOutputStream.toByteArray();
			// Write the image to the client.
			lResponse.setString("image", Tools.base64Encode(lCaptchaBytes));

			getServer().sendToken(aConnector, lResponse);
		} catch (IOException lEx) {
			mLog.error(Logging.getSimpleExceptionMessage(lEx, "Error generating captcha!"));
		}
	}

	private boolean validateCaptcha(String aCaptchaId, String aInputChars) {
		boolean lValidated = false;
		try {
			lValidated = JWebSocketCaptchaService.getInstance().validateResponseForID(aCaptchaId, aInputChars);
		} catch (CaptchaServiceException lCSE) {
			mLog.error(Logging.getSimpleExceptionMessage(lCSE, "validating captcha"));
		}

		return lValidated;
	}

	/**
	 * ReCAPTCHA lets you embed a CAPTCHA in your web pages in order to protect 
	 * them against spam and other types of automated abuse. This method verifies 
	 * that a certain user response was true for a known and configured reCaptcha,
	 * for more information, please visit: https://developers.google.com/recaptcha/docs/verify
	 * @param aSecret (Required) The configured secret key in the jWebSocketJCaptchaPlugIn settings
	 * @param aResponse (Required) The response received from the client side returned by the recaptcha js library.
	 * @param aRemoteIp (Required) The remote ip required by gogle to know from which domain(s) come the captcha validation messages
	 * @return boolean lResponse, validates whether the captcha is valid or not
	 */
	private boolean validateReCaptcha(String aSecret, String aResponse, String aRemoteIp) {
		boolean lResponse = false;
		try {
			URL lURLObj = new URL("https://www.google.com/recaptcha/api/siteverify");
			HttpsURLConnection lConnection = (HttpsURLConnection) lURLObj.openConnection();

			// add reuqest header
			lConnection.setRequestMethod("POST");
			lConnection.setRequestProperty("User-Agent", "Mozilla/5.0");
			lConnection.setRequestProperty("Accept-Language", "en-US,en;q=0.5");

			String lParams = "secret=" + aSecret + "&response="
					+ aResponse + "&remoteip=" + aRemoteIp;

			// Send post request
			lConnection.setDoOutput(true);
			DataOutputStream lOutputStream = new DataOutputStream(lConnection.getOutputStream());
			lOutputStream.writeBytes(lParams);
			lOutputStream.flush();
			lOutputStream.close();

			BufferedReader lInputStreamReader = new BufferedReader(new InputStreamReader(
					lConnection.getInputStream()));
			String lInputLine;
			StringBuilder lJSONResponse = new StringBuilder();

			while ((lInputLine = lInputStreamReader.readLine()) != null) {
				lJSONResponse.append(lInputLine);
			}
			lInputStreamReader.close();
			//parse JSON response and return 'success' value
			JSONObject lJSONObject = new JSONObject(lJSONResponse.toString());
			lResponse = lJSONObject.getBoolean("success");
		} catch (IOException lEx) {
			mLog.error(lEx);
			lResponse = false;
		} catch (JSONException lEx) {
			mLog.error(lEx);
			lResponse = false;
		}
		return lResponse;
	}
}
