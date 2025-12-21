import 'dotenv/config';
import express from "express";
import session from "express-session";
import cors from "cors";

// --------------------
// Route imports (ESM)
// --------------------
import googleAuth from "./routes/googleAuth.js";
import actionRoutes from "./routes/actionRoutes.js";
import analyticsRoutes from "./routes/analytics.js";
import documentRoutes from "./routes/documents.js";
import queryRoutes from "./routes/queries.js";

const app = express();
const PORT = 8000; // Fixed port for integration

// --------------------
// In-Memory Storage (Demo)
// --------------------
console.log("✅ Using in-memory storage for demo");

// --------------------
// Middleware
// --------------------
app.use(
  cors({
    origin: true, // Allow all origins
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Session middleware (required for Google OAuth)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // true only in HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// --------------------
// Routes (MATCH FRONTEND)
// --------------------
app.use("/auth", googleAuth);
app.use("/actions", actionRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/queries", queryRoutes);

// --------------------
// Health check
// --------------------
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Root endpoint
app.get("/", (req, res) => {
  res.send("🚀 Prompt2Support backend is running");
});

// --------------------
// Start server
// --------------------
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
