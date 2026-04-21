require("dotenv").config();
const express = require("express");
const cors    = require("cors");
const path    = require("path");
const { initDB } = require("./db");

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

/* ── API Routes ── */
app.use("/api/auth",     require("./routes/auth"));
app.use("/api/projects", require("./routes/projects"));
app.use("/api/content",  require("./routes/content"));
app.get("/api/health", (_req, res) => res.json({ status: "ok", time: new Date().toISOString() }));

/* ── Static files ── */
const CLIENT_DIST   = path.join(__dirname, "..", "client", "dist");
const CLIENT_PUBLIC = path.join(__dirname, "..", "client", "public");

// Serve homepage HTML for root route
app.get("/", (_req, res) => res.sendFile(path.join(CLIENT_PUBLIC, "index-home.html")));

// Serve the React app for /projects route
app.get("/projects", (_req, res) => res.sendFile(path.join(CLIENT_DIST, "index.html")));

// Static assets
app.use(express.static(CLIENT_DIST));
app.use(express.static(CLIENT_PUBLIC));

// Fallback
app.get("*", (_req, res) => res.sendFile(path.join(CLIENT_DIST, "index.html")));

(async () => {
  await initDB();
  app.listen(PORT, () => {
    console.log(`🚀 Shuddhi Trust server running on port ${PORT}`);
    console.log(`   Homepage:        http://localhost:${PORT}/`);
    console.log(`   Projects App:    http://localhost:${PORT}/projects`);
    console.log(`   API:             http://localhost:${PORT}/api/`);
  });
})();
