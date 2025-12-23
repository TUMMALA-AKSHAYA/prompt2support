import "dotenv/config";
import express from "express";
import session from "express-session";
import cors from "cors";

// ✅ CORRECT paths (src/routes)
import googleAuth from "./src/routes/googleAuth.js";
import actionRoutes from "./src/routes/actionRoutes.js";
import analyticsRoutes from "./src/routes/analytics.js";
import documentRoutes from "./src/routes/documents.js";
import queryRoutes from "./src/routes/queries.js";

const app = express();
const PORT = process.env.PORT || 8000;

console.log("✅ Using in-memory storage for demo");

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
  console.log(`${req.method} ${req.url}`);
  next();
});

// --------------------
// Session
// --------------------
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
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
  res.status(200).json({ status: "ok" });
});

app.get("/", (req, res) => {
  res.send("🚀 Prompt2Support backend is running");
});

// --------------------
// Start server
// --------------------
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
