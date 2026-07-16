// In-memory ring buffer of recent queries — no DB persistence needed for this
const MAX_LOGS = 200;
let queryLogs = [];
let logIdCounter = 0;

function addQueryLog({ sql, params, duration, error, method, endpoint }) {
  const entry = {
    id: ++logIdCounter,
    sql: sql.replace(/\s+/g, " ").trim(),
    params: params || [],
    duration,
    error: error || null,
    method,
    endpoint,
    timestamp: new Date().toISOString(),
  };

  queryLogs.unshift(entry); // newest first
  if (queryLogs.length > MAX_LOGS) {
    queryLogs = queryLogs.slice(0, MAX_LOGS);
  }

  return entry;
}

function getQueryLogs() {
  return queryLogs;
}

function clearQueryLogs() {
  queryLogs = [];
}

module.exports = { addQueryLog, getQueryLogs, clearQueryLogs };