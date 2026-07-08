function errorHandler(err, req, res, next) {
  console.error(err.stack);

  if (err.code === "ER_DUP_ENTRY") {
    return res.status(409).json({ error: "A record with this value already exists." });
  }
  if (err.code === "ER_NO_REFERENCED_ROW_2" || err.code === "ER_NO_REFERENCED_ROW") {
    return res.status(400).json({ error: "Invalid reference — related record not found." });
  }
  if (err.code === "WARN_DATA_TRUNCATED" || err.code === "ER_TRUNCATED_WRONG_VALUE_FOR_FIELD") {
    return res.status(400).json({ error: "Invalid value for a constrained field." });
  }

  res.status(err.status || 500).json({ error: err.message || "Internal server error." });
}

function notFound(req, res) {
  res.status(404).json({ error: "Resource not found." });
}

module.exports = { errorHandler, notFound };