import "dotenv/config";
import express from "express";
import session from "express-session";
import cors from "cors";

// Routes (must exist)
import googleAuth from "./src/routes/googleAuth.js";
import actionRoutes from "./src/routes/actionRoutes.js";
import analyticsRoutes from "./src/routes/analytics.js";
import documentRoutes from "./src/routes/documents.js";
import queryRoutes from "./src/routes/queries.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret",
    resave: false,
    saveUninitialized: false,
  })
);

// Routes
app.use("/auth", googleAuth);
app.use("/actions", actionRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/queries", queryRoutes);

// Health
app.get("/health", (_, res) => res.json({ status: "ok" }));
app.get("/", (_, res) => res.send("Prompt2Support backend running"));

app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on ${PORT}`)
);
