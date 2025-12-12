import express from "express";
import {
  addAvailability,
  getDoctorAvailability,
  deleteAvailability,
  getAllAvailability,
} from "../controllers/doctorAvailability.controller.js";

const router = express.Router();

router.post("/", addAvailability);
router.get("/doctor/:doctor_id", getDoctorAvailability);
router.delete("/:id", deleteAvailability);
router.get("/", getAllAvailability);

export default router;
