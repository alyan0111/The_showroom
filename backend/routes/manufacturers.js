const express = require("express");
const router = express.Router();
const pool = require("../database/database");
const { requireAuth } = require("../middleware/auth");

// GET all
router.get("/", async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM manufacturers ORDER BY name ASC`
    );
    res.json(rows);
  } catch (err) { next(err); }
});

// GET single
router.get("/:id", async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM manufacturers WHERE manufacturer_id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Manufacturer not found." });
    res.json(rows[0]);
  } catch (err) { next(err); }
});

// POST
router.post("/",requireAuth, async (req, res, next) => {
  try {
    const { name, country, founded_year } = req.body;
    if (!name || !country || !founded_year) {
      return res.status(400).json({ error: "name, country, and founded_year are required." });
    }

    const [result] = await pool.query(
      `INSERT INTO manufacturers (name, country, founded_year) VALUES (?, ?, ?)`,
      [name, country, founded_year]
    );

    const [created] = await pool.query(
      `SELECT * FROM manufacturers WHERE manufacturer_id = ?`,
      [result.insertId]
    );
    res.status(201).json(created[0]);
  } catch (err) { next(err); }
});

// PUT
router.put("/:id",requireAuth, async (req, res, next) => {
  try {
    const [existingRows] = await pool.query(
      `SELECT * FROM manufacturers WHERE manufacturer_id = ?`,
      [req.params.id]
    );
    if (existingRows.length === 0) return res.status(404).json({ error: "Manufacturer not found." });

    const existing = existingRows[0];
    const { name, country, founded_year } = req.body;

    await pool.query(
      `UPDATE manufacturers SET name = ?, country = ?, founded_year = ? WHERE manufacturer_id = ?`,
      [name ?? existing.name, country ?? existing.country, founded_year ?? existing.founded_year, req.params.id]
    );

    const [updated] = await pool.query(
      `SELECT * FROM manufacturers WHERE manufacturer_id = ?`,
      [req.params.id]
    );
    res.json(updated[0]);
  } catch (err) { next(err); }
});

// DELETE — cascades via FK ON DELETE CASCADE
router.delete("/:id",requireAuth, async (req, res, next) => {
  try {
    const [result] = await pool.query(
      `DELETE FROM manufacturers WHERE manufacturer_id = ?`,
      [req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: "Manufacturer not found." });
    res.status(204).send();
  } catch (err) { next(err); }
});

module.exports = router;