import express from "express";
import { addExpense, getCaseExpenses } from "../controllers/caseExpense.controller.js";

const router = express.Router({ mergeParams: true });

// Add expense under a case
router.post("/", (req, res) => {
  req.body.case_id = req.params.caseId; // important
  addExpense(req, res);
});

// Get all expenses under a case
router.get("/", (req, res) => {
  getCaseExpenses(req, res);
});

export default router;
