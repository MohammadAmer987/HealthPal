import express from "express";
import {
  createMission,
  getMissions,
  getUpcomingMissions,
  registerToMission,
  updateRegistrationStatus
} from "../controllers/surgicalMission.controller.js";
import { allowRoles, auth } from "../middleware/auth.js";
import { all } from "axios";

const router = express.Router();

// NGO creates mission
router.post("/",auth,allowRoles("ngo"), createMission);

// Get all missions
router.get("/",auth ,getMissions);

// Get upcoming missions
router.get("/upcoming",auth, getUpcomingMissions);

// Patient registers to mission
router.post("/register",auth,allowRoles("patient"), registerToMission);

// NGO approves or rejects patient
router.patch("/registration/:id",auth,allowRoles("ngo"), updateRegistrationStatus);

export default router;
