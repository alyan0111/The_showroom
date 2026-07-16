const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

require("./database/database");
const requestContext = require("./middleware/requestContext");

const authRoutes          = require("./routes/auth");
const manufacturerRoutes  = require("./routes/manufacturers");
const carRoutes           = require("./routes/cars");
const featureRoutes       = require("./routes/features");
const messageRoutes       = require("./routes/messages");
const uploadRoutes        = require("./routes/upload");
const queryLogsRoutes     = require("./routes/queryLogs");        // ← NEW
const { errorHandler, notFound } = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || /^http:\/\/localhost:\d+$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
});

app.use(requestContext);   // ← NEW — tags every request before routes run

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} — ${req.method} ${req.path}`);
  next();
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/manufacturers", manufacturerRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/features", featureRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/query-logs", queryLogsRoutes);   // ← NEW

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 The Showroom API running on http://localhost:${PORT}`);
});