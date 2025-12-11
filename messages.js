import express from "express";
import pool from "../config/db.js";
import { auth } from "../middleware/security.js";

const router = express.Router();

// SEND a message in a consultation
router.post("/", auth, async (req, res) => {
  try {
    const { consultation_id, message } = req.body;

    if (!consultation_id || !message) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const sender_id = req.user.id;

    const [result] = await pool.query(
      `
      INSERT INTO consultation_messages (consultation_id, message, sent_at, sender_id, is_read)
      VALUES (?, ?, NOW(), ?, 0)
      `,
      [consultation_id, message, sender_id]
    );

    res.status(201).json({ id: result.insertId, message: "Message sent" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET all messages for a consultation (only participants or admin)
router.get("/:consultation_id", auth, async (req, res) => {
  try {
    const { consultation_id } = req.params;
    const userId = req.user.id;
    const role = req.user.role;

    const [[consultation]] = await pool.query(
      "SELECT * FROM consultations WHERE id = ?",
      [consultation_id]
    );
    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
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

    const [rows] = await pool.query(
      `
      SELECT *
      FROM consultation_messages
      WHERE consultation_id = ?
      ORDER BY sent_at ASC
      `,
      [consultation_id]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE a message (only sender or admin)
router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Missing message" });
    }

    const [[row]] = await pool.query(
      "SELECT * FROM consultation_messages WHERE id = ?",
      [id]
    );
    if (!row) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (req.user.role !== "admin" && row.sender_id !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await pool.query(
      `
      UPDATE consultation_messages
      SET message = ?
      WHERE id = ?
      `,
      [message, id]
    );

    res.json({ message: "Updated" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE a message (only sender or admin)
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    const [[row]] = await pool.query(
      "SELECT * FROM consultation_messages WHERE id = ?",
      [id]
    );
    if (!row) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (req.user.role !== "admin" && row.sender_id !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await pool.query(
      "DELETE FROM consultation_messages WHERE id = ?",
      [id]
    );

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// MARK message as read (only consultation participants or admin)
router.patch("/:id/read", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const role = req.user.role;

    const [[row]] = await pool.query(
      "SELECT * FROM consultation_messages WHERE id = ?",
      [id]
    );
    if (!row) {
      return res.status(404).json({ message: "Message not found" });
    }

    const [[consultation]] = await pool.query(
      "SELECT * FROM consultations WHERE id = ?",
      [row.consultation_id]
    );
    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
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

    await pool.query(
      `
      UPDATE consultation_messages
      SET is_read = 1
      WHERE id = ?
      `,
      [id]
    );

    res.json({ message: "Marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
