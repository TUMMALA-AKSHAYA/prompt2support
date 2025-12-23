import "dotenv/config";
import express from "express";
import session from "express-session";
import cors from "cors";

// --------------------
// Route imports (FIXED PATHS)
// --------------------
import googleAuth from "./src/routes/googleAuth.js";
import actionRoutes from "./src/routes/actionRoutes.js";
import analyticsRoutes from "./src/routes/analytics.js";
import documentRoutes from "./src/routes/documents.js";
import queryRoutes from "./src/routes/queries.js";

const app = express();
const PORT = process.env.PORT || 8000;

console.log("✅ Prompt2Support backend (Render entry)");

// --------------------
// Middleware
// --------------------
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.url}`);
  next();
});

// --------------------
// Session
// --------------------
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret",
    resave: false,
    saveUninitialized: false,
  })
);

// --------------------
// Routes
// --------------------
app.use("/auth", googleAuth);
app.use("/actions", actionRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/queries", queryRoutes);

// --------------------
// Health
// --------------------
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    env: "render",
    time: new Date().toISOString(),
  });
});

app.get("/", (req, res) => {
  res.send("🚀 Prompt2Support backend is running (Render)");
});

// --------------------
// Start server
// --------------------
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend listening on port ${PORT}`);
});
