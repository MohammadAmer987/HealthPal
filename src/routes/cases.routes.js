import express from "express";
import { 
    createCase, 
    getAllCases, 
    getCaseById, 
    updateCaseStatus 
} from "../controllers/medicalcase.controller.js";

const router = express.Router();

router.post("/", createCase);          // Create case
router.get("/", getAllCases);          // List all cases
router.get("/:id", getCaseById);       // Get one case
router.patch("/:id/status", updateCaseStatus);   // Update status

export default router;