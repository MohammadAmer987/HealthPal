import express from "express";
import { 
    createCase, 
    getAllCases, 
    getCaseById, 
    updateCaseStatus 
} from "../controllers/medicalcase.controller.js";
import { 
     createFeedback
} from "../controllers/feedback.controller.js";
import caseExpenseRoutes from "./caseExpense.routes.js";
import {getTransparency} from "../controllers/transparency.controller.js";
import { generateInvoice } from "../controllers/invoice.controller.js";
import { allowRoles, auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth,allowRoles("admin","ngo"),createCase);          // Create case
router.get("/",auth,allowRoles("admin","ngo"), getAllCases);          // List all cases
router.get("/:id", auth,allowRoles("admin","ngo"),getCaseById);       // Get one case
router.patch("/:id/status",auth,allowRoles("admin","ngo"), updateCaseStatus);   // Update status
router.post("/:case_id/feedback",auth,allowRoles("patient"), createFeedback); //FeedBack
router.use("/:caseId/expenses",auth,allowRoles("admin","ngo"), caseExpenseRoutes); //casesExpenses
router.get("/:caseId/transparency",auth,allowRoles("admin","ngo"), getTransparency);    //transparencyDashborad
router.get("/:caseId/invoice",auth,allowRoles("admin","ngo"), generateInvoice);

export default router;