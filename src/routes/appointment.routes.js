import express from "express";
import {
  createAppointment,
  getDoctorAppointments,
  getPatientAppointments,
  updateAppointmentStatus,
} from "../controllers/appointment.controller.js";

const router = express.Router();

// Patient creates appointment
router.post("/", createAppointment);

// Doctor views his appointments
router.get("/doctor/:doctor_id", getDoctorAppointments);

// Patient views his own appointments
router.get("/patient/:patient_id", getPatientAppointments);

// Doctor approves/rejects appointment
router.patch("/:id/status", updateAppointmentStatus);

export default router;
