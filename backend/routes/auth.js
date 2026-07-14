const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../database/database");
const { requireAuth } = require("../middleware/auth");

// POST /api/auth/login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const [rows] = await pool.query(`SELECT * FROM admins WHERE email = ?`, [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const admin = rows[0];
    const match = await bcrypt.compare(password, admin.password_hash);
    if (!match) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = jwt.sign(
      { adminId: admin.admin_id, email: admin.email, name: admin.name },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      token,
      admin: { id: admin.admin_id, email: admin.email, name: admin.name },
    });
  } catch (err) { next(err); }
});

// GET /api/auth/me — verify token & get current admin info
router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT admin_id, email, name FROM admins WHERE admin_id = ?`,
      [req.admin.adminId]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Admin not found." });
    res.json(rows[0]);
  } catch (err) { next(err); }
});

// PUT /api/auth/change-password — logged-in admin changes their own password
router.put("/change-password", requireAuth, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current and new password are required." });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ error: "New password must be at least 8 characters." });
    }

    const [rows] = await pool.query(`SELECT * FROM admins WHERE admin_id = ?`, [req.admin.adminId]);
    if (rows.length === 0) return res.status(404).json({ error: "Admin not found." });

    const admin = rows[0];
    const match = await bcrypt.compare(currentPassword, admin.password_hash);
    if (!match) return res.status(401).json({ error: "Current password is incorrect." });

    const newHash = await bcrypt.hash(newPassword, 10);
    await pool.query(`UPDATE admins SET password_hash = ? WHERE admin_id = ?`, [newHash, req.admin.adminId]);

    res.json({ message: "Password updated successfully." });
  } catch (err) { next(err); }
});

// GET /api/auth/admins — list all admins (management view)
router.get("/admins", requireAuth, async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT admin_id, email, name, created_at FROM admins ORDER BY created_at ASC`
    );
    res.json(rows);
  } catch (err) { next(err); }
});

// POST /api/auth/admins — create a new admin (requires being logged in already)
router.post("/admins", requireAuth, async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: "Email, password, and name are required." });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters." });
    }

    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      `INSERT INTO admins (email, password_hash, name) VALUES (?, ?, ?)`,
      [email, hash, name]
    );

    res.status(201).json({ admin_id: result.insertId, email, name });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "An admin with this email already exists." });
    }
    next(err);
  }
});

// DELETE /api/auth/admins/:id — remove an admin (can't delete yourself)
router.delete("/admins/:id", requireAuth, async (req, res, next) => {
  try {
    if (Number(req.params.id) === req.admin.adminId) {
      return res.status(400).json({ error: "You cannot delete your own account." });
    }

    const [result] = await pool.query(`DELETE FROM admins WHERE admin_id = ?`, [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Admin not found." });
    res.status(204).send();
  } catch (err) { next(err); }
});

module.exports = router;