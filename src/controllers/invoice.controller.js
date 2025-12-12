import MedicalCase from "../models/MedicalCase.js";
import Patient from "../models/Patient.js";
import Donation from "../models/Donation.js";
import CaseExpense from "../models/CaseExpense.js";
import CaseUpdate from "../models/CaseUpdate.js";
import Feedback from "../models/Feedback.js";
import invoiceTemplate from "../templates/invoiceTemplate.js";
import { generatePDF } from "../service/ExternalAPIs/HTML2PDF.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateInvoice = async (req, res) => {
  try {
    const caseId = req.params.caseId;

    // Validate caseId

    if (!caseId) {
      return res.status(400).json({ message: "Case ID is required" });
    }

    // 1) Load all data in parallel
    const caseInfo = await MedicalCase.findById(caseId);
    
    if (!caseInfo) {
      return res.status(404).json({ message: "Case not found" });
    }

    // Fetch all related data
    const [patient, donations, expenses, total_used, updates, feedback] = await Promise.all([
      Patient.getById(caseInfo.patient_id),
      Donation.findByCase(caseId),
      CaseExpense.getExpensesByCase(caseId),
      CaseExpense.getTotalUsed(caseId),
      CaseUpdate.getByCase(caseId),
      Feedback.getFeedbackById(caseId)
    ]);

    // Validate patient exists
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Calculate totals
    const total_donated = donations && donations.length > 0 
      ? donations.reduce((sum, d) => sum + (d.amount || 0), 0) 
      : 0;
    const remaining = total_donated - (total_used || 0);

    // 2) Generate HTML from template
    const html = invoiceTemplate({
      caseInfo,
      patient,
      donations: donations || [],
      expenses: expenses || [],
      updates: updates || [],
      feedback: feedback || [],
      total_donated,
      total_used: total_used || 0,
      remaining
    });

    // 3) Generate PDF
    const pdfBuffer = await generatePDF(html);

    // Ensure it's a proper Buffer
    const pdfData = Buffer.isBuffer(pdfBuffer) ? pdfBuffer : Buffer.from(pdfBuffer);

    // 4) Save PDF to temp folder
    const tempDir = path.join(__dirname, '../../temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const timestamp = Date.now();
    const filename = `invoice_case_${caseId}_${timestamp}.pdf`;
    const filepath = path.join(tempDir, filename);
    
    fs.writeFileSync(filepath, pdfData);
    
    res.status(200).json({
      message: "Invoice generated successfully",
      filename,
      filepath,
      size: pdfData.length
    });

  } catch (err) {
    console.error("Invoice Error - Full Details:", {
      message: err.message,
      stack: err.stack,
      caseId: req.params.caseId
    });
    res.status(500).json({ 
      message: "Failed to generate invoice",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};
