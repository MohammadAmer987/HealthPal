import express from "express";
import {
  createNGO,
  getNGOs,
  getVerifiedNGOs,
  verifyNGO,
  getNGOById,
} from "../controllers/ngo.controller.js";

const router = express.Router();

// Create new NGO
router.post("/", createNGO);

// Get all NGOs
router.get("/", getNGOs);

// Get verified NGOs
router.get("/verified", getVerifiedNGOs);

// Verify NGO (Admin ideally)
router.patch("/:id/verify", verifyNGO);

// Get NGO by ID
router.get("/:id", getNGOById);

export default ngo;
