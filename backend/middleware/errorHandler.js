function errorHandler(err, req, res, next) {
  console.error(err.stack);

  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ error: "File too large. Max size is 5MB." });
  }
  if (err.message && err.message.includes("Only JPEG")) {
    return res.status(400).json({ error: err.message });
  }
  if (err.code === "ER_DUP_ENTRY") {
    return res.status(409).json({ error: "A record with this value already exists." });
  }
  if (err.code === "ER_NO_REFERENCED_ROW_2" || err.code === "ER_NO_REFERENCED_ROW") {
    return res.status(400).json({ error: "Invalid reference — related record not found." });
  }

  res.status(err.status || 500).json({ error: err.message || "Internal server error." });
}

function notFound(req, res) {
  res.status(404).json({ error: "Resource not found." });
}

module.exports = { errorHandler, notFound };