const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const pool = require("../database/database");
const { requireAuth } = require("../middleware/auth");


// ── Helper: safely delete a file from the uploads folder ───────────────────────
async function deleteUploadedFile(imageUrl) {
  if (!imageUrl) return;

  const filename = path.basename(imageUrl);
  const filePath = path.join(
    __dirname,
    "..",
    "uploads",
    "cars",
    filename
  );

  try {
    await fs.promises.unlink(filePath);
    console.log(`Deleted image file: ${filePath}`);
  } catch (err) {
    if (err.code !== "ENOENT") {
      throw err;
    }

    // The DB may reference a file that is already missing.
    console.warn(`Image file already missing: ${filePath}`);
  }
}

// ── Helper: full car with joins ─────────────────────────────────────────────
async function getFullCar(carId) {
  const [carRows] = await pool.query(`
    SELECT c.*, m.name AS manufacturer_name, m.country AS manufacturer_country
    FROM cars c
    JOIN manufacturers m ON c.manufacturer_id = m.manufacturer_id
    WHERE c.car_id = ?
  `, [carId]);

  if (carRows.length === 0) return null;
  const car = carRows[0];

  const [specRows] = await pool.query(`SELECT * FROM specifications WHERE car_id = ?`, [carId]);

  const [features] = await pool.query(`
    SELECT f.feature_id, f.name, f.category
    FROM features f
    JOIN car_features cf ON f.feature_id = cf.feature_id
    WHERE cf.car_id = ?
  `, [carId]);

  // ── NEW: fetch carousel images ─────────────────────────────────────────────
  const [images] = await pool.query(
    `SELECT * FROM car_images WHERE car_id = ? ORDER BY sort_order ASC`, [carId]
  );

  return { ...car, specification: specRows[0] || null, features, images };
}

// GET all — with filters
router.get("/", async (req, res, next) => {
  try {
    const { manufacturer, engine_type, body_type, transmission, min_year, max_year, max_price, search } = req.query;

    let query = `
      SELECT c.*, m.name AS manufacturer_name
      FROM cars c
      JOIN manufacturers m ON c.manufacturer_id = m.manufacturer_id
      WHERE 1=1
    `;
    const params = [];

    if (manufacturer && manufacturer !== "All") { query += ` AND m.name = ?`; params.push(manufacturer); }
    if (engine_type && engine_type !== "All")   { query += ` AND c.engine_type = ?`; params.push(engine_type); }
    if (body_type && body_type !== "All")       { query += ` AND c.body_type = ?`; params.push(body_type); }
    if (transmission && transmission !== "All") { query += ` AND c.transmission = ?`; params.push(transmission); }
    if (min_year)  { query += ` AND c.year >= ?`; params.push(min_year); }
    if (max_year)  { query += ` AND c.year <= ?`; params.push(max_year); }
    if (max_price) { query += ` AND c.price <= ?`; params.push(max_price); }
    if (search)    { query += ` AND c.model LIKE ?`; params.push(`%${search}%`); }

    query += ` ORDER BY c.created_at DESC`;

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) { next(err); }
});

// GET single — full detail
router.get("/:id", async (req, res, next) => {
  try {
    const car = await getFullCar(req.params.id);
    if (!car) return res.status(404).json({ error: "Car not found." });
    res.json(car);
  } catch (err) { next(err); }
});

// POST — create car + spec + features (transaction)
router.post("/",requireAuth, async (req, res, next) => {
  const conn = await pool.getConnection();
  try {
    const {
      manufacturer_id, model, year, price, body_type,
      engine_type, transmission, image_url, specification, feature_ids,
    } = req.body;

    if (!manufacturer_id || !model || !year || !price || !body_type || !engine_type || !transmission) {
      conn.release();
      return res.status(400).json({ error: "Missing required car fields." });
    }

    await conn.beginTransaction();

    const [result] = await conn.query(`
      INSERT INTO cars (manufacturer_id, model, year, price, body_type, engine_type, transmission, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [manufacturer_id, model, year, price, body_type, engine_type, transmission, image_url || null]);

    const carId = result.insertId;

    if (specification) {
      await conn.query(`
        INSERT INTO specifications (car_id, engine, horsepower, torque, drivetrain, fuel_economy, acceleration, top_speed, seating, weight)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        carId, specification.engine, specification.horsepower, specification.torque,
        specification.drivetrain, specification.fuel_economy, specification.acceleration,
        specification.top_speed, specification.seating, specification.weight,
      ]);
    }

    if (Array.isArray(feature_ids)) {
      for (const fid of feature_ids) {
        await conn.query(
          `INSERT INTO car_features (car_id, feature_id) VALUES (?, ?)`,
          [carId, fid]
        );
      }
    }

    await conn.commit();
    conn.release();

    res.status(201).json(await getFullCar(carId));
  } catch (err) {
    await conn.rollback();
    conn.release();
    next(err);
  }
});

// PUT — update car
router.put("/:id", requireAuth, async (req, res, next) => {
  try {
    const [existingRows] = await pool.query(`SELECT * FROM cars WHERE car_id = ?`, [req.params.id]);
    if (existingRows.length === 0) return res.status(404).json({ error: "Car not found." });

    const existing = existingRows[0];
    const {
      manufacturer_id, model, year, price, body_type,
      engine_type, transmission, image_url,
    } = req.body;

    // If a new image_url is being set AND it's different from the old one,
    // delete the old file since it's about to become orphaned
    if (image_url && image_url !== existing.image_url) {
      deleteUploadedFile(existing.image_url);
    }

    await pool.query(`
      UPDATE cars SET
        manufacturer_id = ?, model = ?, year = ?, price = ?,
        body_type = ?, engine_type = ?, transmission = ?, image_url = ?
      WHERE car_id = ?
    `, [
      manufacturer_id ?? existing.manufacturer_id,
      model ?? existing.model,
      year ?? existing.year,
      price ?? existing.price,
      body_type ?? existing.body_type,
      engine_type ?? existing.engine_type,
      transmission ?? existing.transmission,
      image_url ?? existing.image_url,
      req.params.id,
    ]);

    res.json(await getFullCar(req.params.id));
  } catch (err) { next(err); }
});

// DELETE — cascades to specifications and car_features via FK, 
// but files must be cleaned up manually BEFORE the DB rows disappear
router.delete("/:id", requireAuth, async (req, res, next) => {
  const conn = await pool.getConnection();

  try {
    const carId = req.params.id;

    const [carRows] = await conn.query(
      `SELECT image_url
       FROM cars
       WHERE car_id = ?`,
      [carId]
    );

    if (carRows.length === 0) {
      conn.release();
      return res.status(404).json({
        error: "Car not found.",
      });
    }

    const [imageRows] = await conn.query(
      `SELECT image_url
       FROM car_images
       WHERE car_id = ?`,
      [carId]
    );

    /*
      The seeder may store the main image in both:
      1. cars.image_url
      2. car_images.image_url

      Set removes duplicate URLs, preventing the same file from being
      deleted twice.
    */
    const imageUrls = [
      ...new Set([
        carRows[0].image_url,
        ...imageRows.map((image) => image.image_url),
      ].filter(Boolean)),
    ];

    await conn.beginTransaction();

    /*
      specifications, car_features, and car_images should be removed
      automatically through ON DELETE CASCADE.
    */
    const [result] = await conn.query(
      `DELETE FROM cars WHERE car_id = ?`,
      [carId]
    );

    if (result.affectedRows === 0) {
      await conn.rollback();
      conn.release();

      return res.status(404).json({
        error: "Car not found.",
      });
    }

    await conn.commit();
    conn.release();

    /*
      Delete files after the database transaction succeeds.

      If one physical file cannot be deleted, the car is still removed
      from the database and the failure is logged without returning a
      misleading 500 response to the frontend.
    */
    const fileDeletionResults = await Promise.allSettled(
      imageUrls.map((url) => deleteUploadedFile(url))
    );

    fileDeletionResults.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(
          `Failed to delete image ${imageUrls[index]}:`,
          result.reason.message
        );
      }
    });

    return res.status(200).json({
      message: "Car deleted successfully.",
      deleted_car_id: Number(carId),
      image_files_processed: imageUrls.length,
    });
  } catch (err) {
    try {
      await conn.rollback();
    } catch {
      // Transaction may not have started.
    }

    conn.release();
    next(err);
  }
});


// POST — attach feature
router.post("/:id/features/:featureId", requireAuth, async (req, res, next) => {
  try {
    await pool.query(
      `INSERT IGNORE INTO car_features (car_id, feature_id) VALUES (?, ?)`,
      [req.params.id, req.params.featureId]
    );
    res.json(await getFullCar(req.params.id));
  } catch (err) { next(err); }
});

// DELETE — remove feature
router.delete("/:id/features/:featureId",requireAuth, async (req, res, next) => {
  try {
    await pool.query(
      `DELETE FROM car_features WHERE car_id = ? AND feature_id = ?`,
      [req.params.id, req.params.featureId]
    );
    res.json(await getFullCar(req.params.id));
  } catch (err) { next(err); }
});

// PUT — update specification for a car
router.put("/:id/specification",requireAuth, async (req, res, next) => {
  try {
    const { engine, horsepower, torque, drivetrain, fuel_economy, acceleration, top_speed, seating, weight } = req.body;

    const [existing] = await pool.query(`SELECT * FROM specifications WHERE car_id = ?`, [req.params.id]);

    if (existing.length === 0) {
      // No spec row yet — create one
      await pool.query(`
        INSERT INTO specifications (car_id, engine, horsepower, torque, drivetrain, fuel_economy, acceleration, top_speed, seating, weight)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [req.params.id, engine, horsepower, torque, drivetrain, fuel_economy, acceleration, top_speed, seating, weight]);
    } else {
      await pool.query(`
        UPDATE specifications SET
          engine = ?, horsepower = ?, torque = ?, drivetrain = ?, fuel_economy = ?,
          acceleration = ?, top_speed = ?, seating = ?, weight = ?
        WHERE car_id = ?
      `, [engine, horsepower, torque, drivetrain, fuel_economy, acceleration, top_speed, seating, weight, req.params.id]);
    }

    res.json(await getFullCar(req.params.id));
  } catch (err) { next(err); }
});

module.exports = router;