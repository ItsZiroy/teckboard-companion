// services/auth-service.js

const axios = require("axios");
const url = require("url");
const envVariables = require("../env.json");
const keytar = require("keytar");
const os = require("os");

const { authDomain, clientId, clientSecret } = envVariables;

const redirectUri = "http://localhost/callback";

const keytarService = "TECKboard Companion";
const keytarAccount = os.userInfo().username;

let accessToken = null;
let refreshToken = null;

function getAccessToken() {
  return accessToken;
}

function getAuthenticationURL() {
  return (
    "https://" +
    authDomain +
    "/oauth/authorize?" +
    "scope=&" +
    "response_type=code&" +
    "client_id=" +
    clientId +
    "&" +
    "redirect_uri=" +
    redirectUri
  );
}

async function refreshTokens() {
  const token = await keytar.getPassword(keytarService, keytarAccount);

  if (token) {
    const refreshOptions = {
      method: "POST",
      url: `https://${authDomain}/oauth/token`,
      headers: { "content-type": "application/json" },
      data: {
        grant_type: "refresh_token",
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: token,
      },
    };

    try {
      const response = await axios(refreshOptions);
      accessToken = response.data.access_token;
      refreshToken = response.data.refresh_token;
      await keytar.setPassword(keytarService, keytarAccount, refreshToken);
    } catch (error) {
      await logout();

      throw error;
    }
  } else {
    throw new Error("No available refresh token.");
  }
}

async function loadTokens(callbackURL) {
  const urlParts = url.parse(callbackURL, true);
  const query = urlParts.query;

  const exchangeOptions = {
    grant_type: "authorization_code",
    client_id: clientId,
    client_secret: clientSecret,
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
    refreshToken = response.data.refresh_token;

    if (refreshToken) {
      await keytar.setPassword(keytarService, keytarAccount, refreshToken);
    }
  } catch (error) {
    await logout();

    throw error;
  }
}

async function logout() {
  await keytar.deletePassword(keytarService, keytarAccount);
  accessToken = null;
  profile = null;
  refreshToken = null;
}

function getLogOutUrl() {
  return `https://${authDomain}/logout`;
}

module.exports = {
  getAccessToken,
  getAuthenticationURL,
  getLogOutUrl,
  loadTokens,
  logout,
  refreshTokens,
};
