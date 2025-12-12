import express from "express";
import {
  createAppointment,
  getDoctorAppointments,
  getPatientAppointments,
  updateAppointmentStatus,
} from "../controllers/appointment.controller.js";
import { allowRoles, auth } from "../middleware/auth.js";

const router = express.Router();

// Patient creates appointment
router.post("/",auth,allowRoles("patient"), createAppointment);

// Doctor views his appointments
router.get("/doctor/:doctor_id",auth, getDoctorAppointments);

// Patient views his own appointments
router.get("/patient/:patient_id",auth,allowRoles("patient"), getPatientAppointments);

// Doctor approves/rejects appointment
router.patch("/:id/status",auth,allowRoles("doctor"), updateAppointmentStatus);

export default router;
