const mysql = require("mysql2/promise");
require("dotenv").config();
const { addQueryLog } = require("../middleware/queryLogger");

const rawPool = mysql.createPool({
  host:               process.env.DB_HOST,
  user:               process.env.DB_USER,
  password:           process.env.DB_PASSWORD,
  database:           process.env.DB_NAME,
  port:               process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
});

rawPool.getConnection()
  .then((conn) => {
    console.log("✅ Connected to MySQL database:", process.env.DB_NAME);
    conn.release();
  })
  .catch((err) => {
    console.error("❌ MySQL connection failed:", err.message);
    process.exit(1);
  });

// ── Wrap .query() to capture SQL, params, duration, and errors for every call ──
const originalQuery = rawPool.query.bind(rawPool);

const pool = new Proxy(rawPool, {
  get(target, prop) {
    if (prop === "query") {
      return async (sql, params) => {
        const start = Date.now();
        try {
          const result = await originalQuery(sql, params);
          addQueryLog({
            sql: typeof sql === "string" ? sql : sql.sql,
            params,
            duration: Date.now() - start,
            method: currentRequestContext.method,
            endpoint: currentRequestContext.endpoint,
          });
          return result;
        } catch (err) {
          addQueryLog({
            sql: typeof sql === "string" ? sql : sql.sql,
            params,
            duration: Date.now() - start,
            error: err.message,
            method: currentRequestContext.method,
            endpoint: currentRequestContext.endpoint,
          });
          throw err;
        }
      };
    }
    return target[prop];
  },
});

// ── Simple request-context tracker so logged queries know which route fired them ──
const currentRequestContext = { method: null, endpoint: null };

function setRequestContext(method, endpoint) {
  currentRequestContext.method = method;
  currentRequestContext.endpoint = endpoint;
}

module.exports = pool;
module.exports.setRequestContext = setRequestContext;