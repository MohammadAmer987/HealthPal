import CaseExpense from "../models/CaseExpense.js";

// Add expense
export const addExpense = async (req, res) => {
  try {
    const { case_id, amount_used, description } = req.body;

    if (!case_id || !amount_used) {
      return res.status(400).json({ message: "case_id and amount_used are required" });
    }

    await CaseExpense.createExpense({ case_id, amount_used, description });

    res.status(201).json({ message: "Expense added successfully" });
  } catch (err) {
    console.error("Add expense error:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

// Get expenses + total used amount
export const getCaseExpenses = async (req, res) => {
  try {
    const caseId = req.params.caseId;

    const expenses = await CaseExpense.getExpensesByCase(caseId);
    const total_used = await CaseExpense.getTotalUsed(caseId);

    res.json({
      case_id: caseId,
      total_used,
      expenses
    });
  } catch (err) {
    console.error("Get expenses error:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};
