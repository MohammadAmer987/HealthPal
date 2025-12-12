import CaseModel from "../models/MedicalCase.js";
import PatientModel from "../models/Patient.js";
import DonationModel from "../models/Donation.js";
import CaseExpense from "../models/CaseExpense.js";
import CaseUpdate from "../models/CaseUpdate.js";
import FeedbackModel from "../models/Feedback.js";

export const getTransparency = async (req, res) => {
  try {
    const caseId = req.params.caseId;

    // Validate caseId
    if (!caseId) {
      return res.status(400).json({ message: "Case ID is required" });
    }

    // 1) Load case info first
    const caseInfo = await CaseModel.findById(caseId);

    if (!caseInfo) {
      return res.status(404).json({ message: "Case not found" });
    }

    // 2) Load all related data in parallel
    const [
      patientInfo,
      donations,
      total_donated,
      expenses,
      total_used,
      updates,
      feedback
    ] = await Promise.all([
      PatientModel.getById(caseInfo.patient_id),
      DonationModel.getDonationsByCase(caseId),
      DonationModel.getTotalDonations(caseId),
      CaseExpense.getExpensesByCase(caseId),
      CaseExpense.getTotalUsed(caseId),
      CaseUpdate.getByCase(caseId),
      FeedbackModel.getFeedbackById(caseId)
    ]);

    // Validate patient exists
    if (!patientInfo) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // 3) Safe calculations with fallbacks
    const safe_total_donated = total_donated || 0;
    const safe_total_used = total_used || 0;
    const remaining = safe_total_donated - safe_total_used;
    const progress = caseInfo.goal_amount > 0
      ? ((safe_total_donated / caseInfo.goal_amount) * 100).toFixed(1) + "%"
      : "0%";

    // 4) Return formatted response
    res.status(200).json({
      case_id: caseId,
      case_title: caseInfo?.title || "N/A",
      description: caseInfo?.description || "N/A",
      goal_amount: caseInfo?.goal_amount || 0,
      total_donated: safe_total_donated,
      total_used: safe_total_used,
      remaining,
      progress,
      patient: patientInfo || {},
      donations: donations || [],
      expenses: expenses || [],
      updates: updates || [],
      feedback: feedback || [],
      invoice_html_url: `/api/cases/${caseId}/invoice`
    });
  } catch (err) {
    console.error("Transparency Error - Full Details:", {
      message: err.message,
      stack: err.stack,
      caseId: req.params.caseId
    });
    res.status(500).json({
      message: "Failed to retrieve transparency data",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};
