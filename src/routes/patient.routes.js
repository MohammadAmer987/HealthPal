import express from "express";
import {
    createPatient,
    getPatients,
    getPatientById,
    updatePatient
} from "../controllers/patient.controller.js";
import { allowRoles,auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/",auth,allowRoles("admin"), createPatient);
router.get("/",auth,allowRoles("admin"), getPatients);
router.get("/:id",auth,allowRoles("admin"), getPatientById);
router.put("/:id",auth,allowRoles("admin"),  updatePatient);

export default router;
