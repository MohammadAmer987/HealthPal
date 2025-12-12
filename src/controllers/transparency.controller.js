import { getCaseById } from "../models/MedicalCase.js";
import { getPatientById } from "../models/Patient.js";
import { getDonationsByCase, getTotalDonations } from "../models/Donation.js";
import { getExpensesByCase, getTotalUsed } from "../models/CaseExpense.js";
import { getUpdatesByCase } from "../models/CaseUpdate.js";
import { getFeedbackByCase } from "../models/Feedback.js";

export const getTransparency = async (req, res) => {
  try {
    const caseId = req.params.caseId;

    // 1) Get case info
    const caseInfo = await getCaseById(caseId);

    // 2) Get patient info
    const patientInfo = await getPatientById(caseInfo.patient_id);

    // 3) Donations
    const donations = await getDonationsByCase(caseId);
    const total_donated = await getTotalDonations(caseId);

    // 4) Expenses
    const expenses = await getExpensesByCase(caseId);
    const total_used = await getTotalUsed(caseId);

    // 5) Updates
    const updates = await getUpdatesByCase(caseId);

    // 6) Feedback
    const feedback = await getFeedbackByCase(caseId);

    // 7) Calculations
    const remaining = total_donated - total_used;
    const progress = ((total_donated / caseInfo.goal_amount) * 100).toFixed(1) + "%";

    res.json({
      case_id: caseId,
      case_title: caseInfo.title,
      description: caseInfo.description,
      goal_amount: caseInfo.goal_amount,
      total_donated,
      total_used,
      remaining,
      progress,

      patient: patientInfo,
      donations,
      expenses,
      updates,
      feedback,

      invoice_html_url: `/api/cases/${caseId}/invoice`
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
};
