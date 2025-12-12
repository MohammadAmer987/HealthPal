export const generateInvoice = async (req, res) => {
  try {
    const caseId = req.params.caseId;

    // 1) load all data
    const caseInfo = await CaseModel.getCaseById(caseId);
    const patient = await PatientModel.getPatientById(caseInfo.patient_id);

    const donations = await DonationModel.getDonationsByCase(caseId);
    const expenses = await CaseExpense.getExpensesByCase(caseId);
    const total_used = await CaseExpense.getTotalUsed(caseId);

    const updates = await CaseUpdate.getUpdatesByCase(caseId);
    const feedback = await FeedbackModel.getFeedbackByCase(caseId);

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
      remaining
    });

    // 2) generate pdf
    const pdfBuffer = await generatePDF(html);

    // 3) return pdf
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
