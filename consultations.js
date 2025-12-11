import express from "express";
import pool from "../config/db.js";
import { auth, requireRole } from "../middleware/security.js";

const router = express.Router();

// CREATE new consultation (patient)
router.post("/", auth, requireRole(["patient"]), async (req, res) => {
  try {
    const userId = req.user.id;
    const { doctor_id, type, scheduled_at } = req.body;

    if (!doctor_id || !type || !scheduled_at) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const [patients] = await pool.query(
      "SELECT id FROM patients WHERE user_id = ?",
      [userId]
    );
    if (patients.length === 0) {
      return res.status(400).json({ message: "Patient not found" });
    }

    const patient_id = patients[0].id;

    const [result] = await pool.query(
      `
      INSERT INTO consultations (type, status, scheduled_at, started_at, patient_id, doctor_id)
      VALUES (?, 'pending', ?, NULL, ?, ?)
      `,
      [type, scheduled_at, patient_id, doctor_id]
    );

    const [rows] = await pool.query(
      "SELECT * FROM consultations WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET my consultations (patient / doctor / admin)
router.get("/mine", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let sql = "";
    let params = [];

    if (role === "patient") {
      const [patients] = await pool.query(
        "SELECT id FROM patients WHERE user_id = ?",
        [userId]
      );
      if (patients.length === 0) return res.json([]);
      const patient_id = patients[0].id;

      sql = `
        SELECT c.*, du.full_name AS doctor_name
        FROM consultations c
        JOIN doctors d ON c.doctor_id = d.id
        JOIN users du ON d.user_id = du.id
        WHERE c.patient_id = ?
        ORDER BY c.scheduled_at DESC
      `;
      params = [patient_id];
    } else if (role === "doctor") {
      const [doctors] = await pool.query(
        "SELECT id FROM doctors WHERE user_id = ?",
        [userId]
      );
      if (doctors.length === 0) return res.json([]);
      const doctor_id = doctors[0].id;

      sql = `
        SELECT c.*, pu.full_name AS patient_name
        FROM consultations c
        JOIN patients p ON c.patient_id = p.id
        JOIN users pu ON p.user_id = pu.id
        WHERE c.doctor_id = ?
        ORDER BY c.scheduled_at DESC
      `;
      params = [doctor_id];
    } else if (role === "admin") {
      sql = `
        SELECT 
          c.*,
          du.full_name AS doctor_name,
          pu.full_name AS patient_name
        FROM consultations c
        JOIN doctors d ON c.doctor_id = d.id
        JOIN users du ON d.user_id = du.id
        JOIN patients p ON c.patient_id = p.id
        JOIN users pu ON p.user_id = pu.id
        ORDER BY c.scheduled_at DESC
      `;
      params = [];
    } else {
      return res.status(403).json({ message: "Forbidden" });
    }

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET single consultation (only participants or admin)
router.get("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const role = req.user.role;

    const [[consultation]] = await pool.query(
      "SELECT * FROM consultations WHERE id = ?",
      [id]
    );
    if (!consultation) {
      return res.status(404).json({ message: "Not found" });
    }

    if (role !== "admin") {
      if (role === "doctor") {
        const [[doctor]] = await pool.query(
          "SELECT id FROM doctors WHERE user_id = ?",
          [userId]
        );
        if (!doctor || doctor.id !== consultation.doctor_id) {
          return res.status(403).json({ message: "Forbidden" });
        }
      } else if (role === "patient") {
        const [[patient]] = await pool.query(
          "SELECT id FROM patients WHERE user_id = ?",
          [userId]
        );
        if (!patient || patient.id !== consultation.patient_id) {
          return res.status(403).json({ message: "Forbidden" });
        }
      } else {
        return res.status(403).json({ message: "Forbidden" });
      }
    }

    res.json(consultation);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE consultation status (doctor / admin)
router.patch("/:id/status", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, started_at } = req.body;
    const allowed = ["pending", "confirmed", "completed", "cancelled"];

    if (!status || !allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const role = req.user.role;

    const [[consultation]] = await pool.query(
      "SELECT * FROM consultations WHERE id = ?",
      [id]
    );
    if (!consultation) {
      return res.status(404).json({ message: "Not found" });
    }

    if (role === "doctor") {
      const [[doctor]] = await pool.query(
        "SELECT id FROM doctors WHERE user_id = ?",
        [req.user.id]
      );
      if (!doctor || doctor.id !== consultation.doctor_id) {
        return res.status(403).json({ message: "Forbidden" });
      }
    } else if (role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    await pool.query(
      `
      UPDATE consultations
      SET status = ?, started_at = COALESCE(?, started_at)
      WHERE id = ?
      `,
      [status, started_at || null, id]
    );

    const [[updated]] = await pool.query(
      "SELECT * FROM consultations WHERE id = ?",
      [id]
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE consultation (patient, doctor involved, or admin)
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const role = req.user.role;

    const [[consultation]] = await pool.query(
      "SELECT * FROM consultations WHERE id = ?",
      [id]
    );
    if (!consultation) {
      return res.status(404).json({ message: "Not found" });
    }

    if (role !== "admin") {
      let allowed = false;

      if (role === "doctor") {
        const [[doctor]] = await pool.query(
          "SELECT id FROM doctors WHERE user_id = ?",
          [userId]
        );
        if (doctor && doctor.id === consultation.doctor_id) {
          allowed = true;
        }
      }

      if (role === "patient") {
        const [[patient]] = await pool.query(
          "SELECT id FROM patients WHERE user_id = ?",
          [userId]
        );
        if (patient && patient.id === consultation.patient_id) {
          allowed = true;
        }
      }

      if (!allowed) {
        return res.status(403).json({ message: "Forbidden" });
      }
    }

    await pool.query("DELETE FROM consultations WHERE id = ?", [id]);

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
