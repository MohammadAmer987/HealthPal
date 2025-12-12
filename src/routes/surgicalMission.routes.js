import express from "express";
import {
  createMission,
  getMissions,
  getUpcomingMissions,
  registerToMission,
  updateRegistrationStatus
} from "../controllers/surgicalMission.controller.js";

const router = express.Router();

// NGO creates mission
router.post("/", createMission);

// Get all missions
router.get("/", getMissions);

// Get upcoming missions
router.get("/upcoming", getUpcomingMissions);

// Patient registers to mission
router.post("/register", registerToMission);

// NGO approves or rejects patient
router.patch("/registration/:id", updateRegistrationStatus);

export default router;
