const { google } = require('googleapis');
const TokenModel = require('../models/Token');

/* -------------------- GET AUTHORIZED CLIENT -------------------- */
async function getAuthorizedClient(ownerId) {
  // Fetch stored tokens for the owner
  const tokenDoc = await TokenModel.findOne({ ownerId });
  if (!tokenDoc) return null;

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  oauth2Client.setCredentials(tokenDoc.tokens);

  // Refresh token if expired
  if (tokenDoc.tokens.expiry_date < Date.now()) {
    try {
      const { credentials } = await oauth2Client.refreshAccessToken();
      tokenDoc.tokens = credentials;
      await tokenDoc.save();
      oauth2Client.setCredentials(credentials);
    } catch (error) {
      console.error('Failed to refresh Google token:', error);
      return null;
    }
  }

  return oauth2Client;
}

module.exports = {
  getAuthorizedClient
};