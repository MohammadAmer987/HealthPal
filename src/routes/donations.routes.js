import express from "express";
import { 
    addDonation, 
    getDonationsByCase 
} from "../controllers/donation.controller.js";

const router = express.Router();

router.post("/", addDonation);                        // Add donation
router.get("/:case_id", getDonationsByCase);          // Get donations of case

export default router;
