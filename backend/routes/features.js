const express = require("express");
const router = express.Router();
const pool = require("../database/database");

router.get("/", async (req, res, next) => {
  try {
    const { category } = req.query;
    let query = `SELECT * FROM features`;
    const params = [];

    if (category) { query += ` WHERE category = ?`; params.push(category); }
    query += ` ORDER BY category, name`;

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) { next(err); }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, category } = req.body;
    if (!name || !category) return res.status(400).json({ error: "name and category are required." });

    const [result] = await pool.query(
      `INSERT INTO features (name, category) VALUES (?, ?)`,
      [name, category]
    );

    const [created] = await pool.query(`SELECT * FROM features WHERE feature_id = ?`, [result.insertId]);
    res.status(201).json(created[0]);
  } catch (err) { next(err); }
});

router.put("/:id", async (req, res, next) => {
  try {
    const [existingRows] = await pool.query(`SELECT * FROM features WHERE feature_id = ?`, [req.params.id]);
    if (existingRows.length === 0) return res.status(404).json({ error: "Feature not found." });

    const existing = existingRows[0];
    const { name, category } = req.body;

    await pool.query(
      `UPDATE features SET name = ?, category = ? WHERE feature_id = ?`,
      [name ?? existing.name, category ?? existing.category, req.params.id]
    );

    const [updated] = await pool.query(`SELECT * FROM features WHERE feature_id = ?`, [req.params.id]);
    res.json(updated[0]);
  } catch (err) { next(err); }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const [result] = await pool.query(`DELETE FROM features WHERE feature_id = ?`, [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Feature not found." });
    res.status(204).send();
  } catch (err) { next(err); }
});

module.exports = router;