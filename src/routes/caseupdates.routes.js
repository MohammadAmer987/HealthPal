import express from "express";
import { 
    addCaseUpdate,
    getCaseUpdates
} from "../controllers/caseupdates.controller.js";

const router = express.Router();

router.post("/:case_id", addCaseUpdate);      // Add update
router.get("/:case_id", getCaseUpdates);      // Get updates

export default router;
