const express = require("express");
const router = express.Router();
const pool = require("../database/database");

router.get("/", async (req, res, next) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM messages ORDER BY created_at DESC`);
    res.json(rows);
  } catch (err) { next(err); }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return res.status(400).json({ error: "All fields are required." });
    }
    if (message.trim().length < 20) {
      return res.status(400).json({ error: "Message must be at least 20 characters." });
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ error: "Invalid email address." });
    }

    const [result] = await pool.query(
      `INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)`,
      [name.trim(), email.trim(), subject.trim(), message.trim()]
    );

    const [created] = await pool.query(`SELECT * FROM messages WHERE message_id = ?`, [result.insertId]);
    res.status(201).json(created[0]);
  } catch (err) { next(err); }
});

router.patch("/:id/read", async (req, res, next) => {
  try {
    const [result] = await pool.query(
      `UPDATE messages SET is_read = TRUE WHERE message_id = ?`,
      [req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: "Message not found." });

    const [updated] = await pool.query(`SELECT * FROM messages WHERE message_id = ?`, [req.params.id]);
    res.json(updated[0]);
  } catch (err) { next(err); }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const [result] = await pool.query(`DELETE FROM messages WHERE message_id = ?`, [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Message not found." });
    res.status(204).send();
  } catch (err) { next(err); }
});

module.exports = router;