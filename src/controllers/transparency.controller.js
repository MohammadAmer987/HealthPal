import CaseModel from "../models/MedicalCase.js";
import PatientModel from "../models/Patient.js";
import DonationModel from "../models/Donation.js";
import CaseExpense from "../models/CaseExpense.js";
import CaseUpdate from "../models/CaseUpdate.js";
import FeedbackModel from "../models/Feedback.js";

export const getTransparency = async (req, res) => {
  try {
    const caseId = req.params.caseId;

    // 1) Case info
    const caseInfo = await CaseModel.getCaseById(caseId);

    // 2) Patient info
    const patientInfo = await PatientModel.getPatientById(caseInfo.patient_id);

    // 3) Donations
    const donations = await DonationModel.getDonationsByCase(caseId);
    const total_donated = await DonationModel.getTotalDonations(caseId);

    // 4) Expenses
    const expenses = await CaseExpense.getExpensesByCase(caseId);
    const total_used = await CaseExpense.getTotalUsed(caseId);

    // 5) Updates
    const updates = await CaseUpdate.getUpdatesByCase(caseId);

    // 6) Feedback
    const feedback = await FeedbackModel.getFeedbackByCase(caseId);

    // 7) Calculations
    const remaining = total_donated - total_used;
    const progress =
      ((total_donated / caseInfo.goal_amount) * 100).toFixed(1) + "%";

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
      invoice_html_url: `/api/cases/${caseId}/invoice`,
    });
  } catch (err) {
    console.error("Transparency Error:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};
