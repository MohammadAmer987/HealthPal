import { generatePDF } from "../service/ExternalAPIs/HTML2PDF.js";
import invoiceTemplate from "../templates/invoiceTemplate.js";
import { getCaseById } from "../models/MedicalCase.js";
import { getPatientById } from "../models/Patient.js";
import { getDonationsByCase } from "../models/Donation.js";
import { getExpensesByCase, getTotalUsed } from "../models/CaseExpense.js";
import { getUpdatesByCase } from "../models/CaseUpdate.js";
import { getFeedbackByCase } from "../models/Feedback.js";

export const generateInvoice = async (req, res) => {
  try {
    const caseId = req.params.caseId;

    // 1) Load all data (case, patient, donations, expenses...)
  const caseInfo = await getCaseById(caseId);
    const patient = await getPatientById(caseInfo.patient_id);

    const donations = await getDonationsByCase(caseId);
    const expenses = await getExpensesByCase(caseId);
    const total_used = await getTotalUsed(caseId);

    const updates = await getUpdatesByCase(caseId);
    const feedback = await getFeedbackByCase(caseId);

    const total_donated = donations.reduce((sum, d) => sum + d.amount, 0);
    const remaining = total_donated - total_used;
    
    const html = invoiceTemplate({
      caseInfo,
      patient,
      donations,
      expenses,
      updates,
      feedback,
      total_donated,
      total_used,
      remaining,
    });

    // 2) استدعاء الـ External API من الـ service
    const pdfBuffer = await generatePDF(html);

    // 3) إرجاع PDF للمستخدم
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=invoice_case_${caseId}.pdf`,
    });

    res.send(pdfBuffer);

  } catch (err) {
    console.error("Invoice Error:", err);
    res.status(500).json({ error: "Failed to generate invoice" });
  }
};
