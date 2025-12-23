import "dotenv/config";
import express from "express";
import session from "express-session";
import cors from "cors";

// --------------------
// Route imports (LOCAL)
// --------------------
import googleAuth from "./routes/googleAuth.js";
import actionRoutes from "./routes/actionRoutes.js";
import analyticsRoutes from "./routes/analytics.js";
import documentRoutes from "./routes/documents.js";
import queryRoutes from "./routes/queries.js";

const app = express();
const PORT = process.env.PORT || 8000;

console.log("✅ Prompt2Support (src server) running");

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

// Request logger
app.use((req, res, next) => {
  console.log(`[SRC] ${req.method} ${req.url}`);
  next();
});

// --------------------
// Session (for OAuth / future auth)
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
// Health check
// --------------------
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    server: "src",
    timestamp: new Date().toISOString(),
  });
});

// Root
app.get("/", (req, res) => {
  res.send("🚀 Prompt2Support backend (src) is running");
});

// --------------------
// Start server
// --------------------
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 [SRC] Backend listening on port ${PORT}`);
});
