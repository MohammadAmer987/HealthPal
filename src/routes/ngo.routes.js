import express from "express";
import {
  createNGO,
  getNGOs,
  getVerifiedNGOs,
  verifyNGO,
  getNGOById,
} from "../controllers/ngo.controller.js";
import { auth ,allowRoles} from "../middleware/auth.js";  
const router = express.Router();

// Create new NGO
router.post("/",auth,allowRoles("admin","ngo"), createNGO);

// Get all NGOs
router.get("/",auth,allowRoles("admin","ngo"), getNGOs);

// Get verified NGOs
router.get("/verified",auth, getVerifiedNGOs);

// Verify NGO (Admin ideally)
router.patch("/:id/verify",auth,allowRoles("admin"), verifyNGO);

// Get NGO by ID
router.get("/:id", auth, getNGOById);

export default router;
