import express from "express";
import { 
    addDonation, 
    getDonationsByCase 
} from "../controllers/donation.controller.js";
import {  auth } from "../middleware/auth.js";

const router = express.Router();
router.post("/",auth, addDonation);                        // Add donation
router.get("/:case_id",auth, getDonationsByCase);          // Get donations of case

export default router;
