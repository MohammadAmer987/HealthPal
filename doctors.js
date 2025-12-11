import express from "express";
import pool from "../config/db.js";
import { auth, requireRole } from "../middleware/security.js";

const router = express.Router();

// GET all doctors
router.get("/", auth, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT d.*, u.full_name, u.email, u.phone
      FROM doctors d
      JOIN users u ON d.user_id = u.id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET doctor by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `
      SELECT d.*, u.full_name, u.email, u.phone
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      WHERE d.id = ?
      `,
      [id]
    );

    if (rows.length === 0) return res.status(404).json({ message: "Not found" });

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// CREATE new doctor (Admin)
router.post("/", auth, requireRole(["admin"]), async (req, res) => {
  try {
    const { user_id, specialty, bio, license_number, available } = req.body;

    if (!user_id || !specialty || !license_number) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const [result] = await pool.query(
      `
      INSERT INTO doctors (user_id, specialty, bio, license_number, available)
      VALUES (?, ?, ?, ?, ?)
      `,
      [user_id, specialty, bio || null, license_number, available ?? true]
    );

    res.status(201).json({ id: result.insertId, message: "Doctor created" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE doctor (Admin)
router.put("/:id", auth, requireRole(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { specialty, bio, license_number, available } = req.body;

    const [result] = await pool.query(
      `
      UPDATE doctors
      SET specialty = ?, bio = ?, license_number = ?, available = ?
      WHERE id = ?
      `,
      [specialty, bio || null, license_number, available ?? true, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({ message: "Updated" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE doctor (Admin)
router.delete("/:id", auth, requireRole(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      `DELETE FROM doctors WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
