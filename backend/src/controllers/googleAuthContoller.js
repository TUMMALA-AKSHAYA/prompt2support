const { google } = require('googleapis');
const TokenModel = require('../models/Token'); // DB model (recommended)

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

/* -------------------- STEP 1: START OAUTH -------------------- */
exports.googleAuth = (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/gmail.modify',
      'https://www.googleapis.com/auth/calendar'
    ]
  });

  res.redirect(authUrl);
};

/* -------------------- STEP 2: OAUTH CALLBACK -------------------- */
exports.googleAuthCallback = async (req, res) => {
  try {
    const { code } = req.query;

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Store tokens in session (short term)
    req.session.tokens = tokens;

    // Store tokens in DB (persistent)
    await TokenModel.findOneAndUpdate(
      { ownerId: req.user.id },
      { tokens },
      { upsert: true, new: true }
    );

    res.redirect(process.env.FRONTEND_DASHBOARD_URL);
  } catch (error) {
    console.error('Google OAuth Callback Error:', error);
    res.status(500).json({ error: 'Google authentication failed' });
  }
};

/* -------------------- STEP 3: AUTH STATUS -------------------- */
exports.authStatus = async (req, res) => {
  try {
    const tokenDoc = await TokenModel.findOne({ ownerId: req.user.id });

    res.json({
      connected: !!tokenDoc
    });
  } catch (error) {
    res.status(500).json({ connected: false });
  }
};

/* -------------------- STEP 4: GET AUTHORIZED CLIENT -------------------- */
exports.getAuthorizedClient = async (req) => {
  const tokenDoc = await TokenModel.findOne({ ownerId: req.user.id });
  if (!tokenDoc) return null;

  oauth2Client.setCredentials(tokenDoc.tokens);

  // Refresh token if expired
  if (tokenDoc.tokens.expiry_date < Date.now()) {
    const { credentials } = await oauth2Client.refreshAccessToken();

    tokenDoc.tokens = credentials;
    await tokenDoc.save();

    oauth2Client.setCredentials(credentials);
  }

  return oauth2Client;
};