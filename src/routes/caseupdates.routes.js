import express from "express";
import { 
    addCaseUpdate,
    getCaseUpdates
} from "../controllers/caseupdates.controller.js";
import { allowRoles, auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/:case_id", auth, allowRoles("admin", "ngo"), addCaseUpdate);      // Add update
router.get("/:case_id", auth,allowRoles("admin", "ngo"),getCaseUpdates);      // Get updates

export default router;
