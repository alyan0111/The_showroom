const express = require("express");
const router = express.Router();
const { getQueryLogs, clearQueryLogs } = require("../middleware/queryLogger");

// GET /api/query-logs — return recent queries (public, read-only, dev tool)
router.get("/", (req, res) => {
  res.json(getQueryLogs());
});

// DELETE /api/query-logs — clear the log
router.delete("/", (req, res) => {
  clearQueryLogs();
  res.status(204).send();
});

module.exports = router;