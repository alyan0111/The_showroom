const bcrypt = require("bcryptjs");
const pool = require("../database/database");
require("dotenv").config();

async function createAdmin() {
  const email    = process.argv[2] || "admin@theshowroom.com";
  const password = process.argv[3] || "changeme123";
  const name     = process.argv[4] || "Admin";

  const hash = await bcrypt.hash(password, 10);

  try {
    await pool.query(
      `INSERT INTO admins (email, password_hash, name) VALUES (?, ?, ?)`,
      [email, hash, name]
    );
    console.log(`Admin created: ${email} / ${password}`);
    console.log(" Change this password after first login in production.");
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      console.log("Admin with this email already exists.");
    } else {
      console.error(err);
    }
  }
  process.exit(0);
}

createAdmin();