// services/auth-service.js

const axios = require("axios");
const url = require("url");
const envVariables = require("../env.json");
const keytar = require("keytar");
const os = require("os");

const { authDomain, screenClientId, screenClientSecret } = envVariables;

const redirectUri = "http://localhost/callback";

const keytarService = "TECKboard Companion - Screen";
const keytarAccount = os.userInfo().username;

let accessToken = null;
let refreshToken = null;

function getAccessToken() {
  return accessToken;
}
async function getKeyChainToken() {
  const token = await keytar.getPassword(keytarService, keytarAccount);
  return token;
}

function getAuthenticationURL() {
  return (
    "https://" +
    authDomain +
    "/oauth/authorize?" +
    "scope=&" +
    "response_type=code&" +
    "client_id=" +
    screenClientId +
    "&" +
    "redirect_uri=" +
    redirectUri
  );
}

async function loadTokens(callbackURL) {
  const urlParts = url.parse(callbackURL, true);
  const query = urlParts.query;

  const exchangeOptions = {
    grant_type: "authorization_code",
    client_id: screenClientId,
    client_secret: screenClientSecret,
    code: query.code,
    redirect_uri: redirectUri,
  };

  const options = {
    method: "POST",
    url: `https://${authDomain}/oauth/token`,
    headers: {
      "content-type": "application/json",
    },
    data: JSON.stringify(exchangeOptions),
  };

  try {
    const response = await axios(options);
    accessToken = response.data.access_token;
    await keytar.setPassword(keytarService, keytarAccount, accessToken);
  } catch (error) {
    await logout();

    throw error;
  }
}

async function logout() {
  await keytar.deletePassword(keytarService, keytarAccount);
  accessToken = null;
  refreshToken = null;
}

module.exports = {
  getAccessToken,
  getKeyChainToken,
  getAuthenticationURL,
  loadTokens,
  logout,
};
