import express from "express";
import {
  addAvailability,
  getDoctorAvailability,
  deleteAvailability,
  getAllAvailability,
} from "../controllers/doctorAvailability.controller.js";
import { allowRoles,auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/",auth,allowRoles("doctor"), addAvailability);
router.get("/doctor/:doctor_id",auth, getDoctorAvailability);
router.delete("/:id",auth,allowRoles("doctor"), deleteAvailability);
router.get("/",auth, getAllAvailability);

export default router;
