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

const router = express.Router();

router.post("/", createCase);          // Create case
router.get("/", getAllCases);          // List all cases
router.get("/:id", getCaseById);       // Get one case
router.patch("/:id/status", updateCaseStatus);   // Update status
router.post("/:case_id/feedback", createFeedback); //FeedBack
router.use("/:caseId/expenses", caseExpenseRoutes); //casesExpenses
export default router;