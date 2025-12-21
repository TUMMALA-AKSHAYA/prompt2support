import express from "express";
import { google } from "googleapis";

const router = express.Router();

// --------------------
// OAuth Client Setup
// --------------------
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// --------------------
// Start Google OAuth
// --------------------
router.get("/google", (req, res) => {
  const scopes = [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/calendar"
  ];

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes
  });

  res.redirect(authUrl);
});

// --------------------
// OAuth Callback
// --------------------
router.get("/google/callback", async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ error: "Authorization code missing" });
    }

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // 🔑 Store tokens in session
    req.session.googleTokens = tokens;

    console.log("✅ Google OAuth success");

    // Redirect to frontend or dashboard
    res.redirect("/");
  } catch (error) {
    console.error("❌ Google OAuth Error:", error);
    res.status(500).json({ error: "Google authentication failed" });
  }
});

// --------------------
// Logout
// --------------------
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

export default router;
