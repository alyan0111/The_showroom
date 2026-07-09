const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

require("./database/database");

const manufacturerRoutes = require("./routes/manufacturers");
const carRoutes           = require("./routes/cars");
const featureRoutes       = require("./routes/features");
const messageRoutes       = require("./routes/messages");
const uploadRoutes        = require("./routes/upload");           // ← NEW
const { errorHandler, notFound } = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
});

// ── Serve uploaded images statically ──────────────────────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "uploads")));   // ← NEW

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} — ${req.method} ${req.path}`);
  next();
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/manufacturers", manufacturerRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/features", featureRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/upload", uploadRoutes);                                    // ← NEW

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 The Showroom API running on http://localhost:${PORT}`);
});