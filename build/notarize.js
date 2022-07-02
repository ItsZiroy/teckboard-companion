require("dotenv").config();
const { notarize } = require("electron-notarize");

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== "darwin") {
    return;
  }

  const appName = context.packager.appInfo.productFilename;

  // eslint-disable-next-line consistent-return
  return await notarize({
    tool: "notarytool",
    appBundleId: "de.teckdigital.teckboard-companion",
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLEID,
    appleIdPassword: process.env.APPLEIDPASS,
    ascProvider: process.env.APPTEAM,
    teamId: process.env.APPTEAM,
  });
};
