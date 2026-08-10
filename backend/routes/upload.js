const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const pool = require("../database/database");
const { requireAuth } = require("../middleware/auth");
const fs = require("fs");
const path = require("path");

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

// POST — upload a single main image, returns its URL (not yet attached to a car)
router.post("/main",requireAuth, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded." });
  const url = `/uploads/cars/${req.file.filename}`;
  res.json({ url });
});

// POST — upload multiple carousel images, returns array of URLs
router.post("/carousel",requireAuth, upload.array("images", 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded." });
  }
  const urls = req.files.map((f) => `/uploads/cars/${f.filename}`);
  res.json({ urls });
});

// POST — attach carousel image URLs to an existing car
router.post("/cars/:carId/images",requireAuth, async (req, res, next) => {
  try {
    const { urls } = req.body; // array of image URLs
    if (!Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ error: "urls array is required." });
    }

    for (let i = 0; i < urls.length; i++) {
      await pool.query(
        `INSERT INTO car_images (car_id, image_url, sort_order) VALUES (?, ?, ?)`,
        [req.params.carId, urls[i], i]
      );
    }

    const [images] = await pool.query(
      `SELECT * FROM car_images WHERE car_id = ? ORDER BY sort_order ASC`,
      [req.params.carId]
    );
    res.status(201).json(images);
  } catch (err) { next(err); }
});

// GET — all carousel images for a car
router.get("/cars/:carId/images", async (req, res, next) => {
  try {
    const [images] = await pool.query(
      `SELECT * FROM car_images WHERE car_id = ? ORDER BY sort_order ASC`,
      [req.params.carId]
    );
    res.json(images);
  } catch (err) { next(err); }
});

// DELETE — remove a single carousel image (both DB row and physical file)
router.delete("/cars/:carId/images/:imageId", requireAuth, async (req, res, next) => {
  try {
    // Fetch the image_url BEFORE deleting the row
    const [rows] = await pool.query(
      `SELECT image_url FROM car_images WHERE image_id = ? AND car_id = ?`,
      [req.params.imageId, req.params.carId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Image not found." });
    }

    // Delete the file from disk
    deleteUploadedFile(rows[0].image_url);

    // Delete the DB row
    await pool.query(
      `DELETE FROM car_images WHERE image_id = ? AND car_id = ?`,
      [req.params.imageId, req.params.carId]
    );

    res.status(204).send();
  } catch (err) { next(err); }
});

module.exports = router;