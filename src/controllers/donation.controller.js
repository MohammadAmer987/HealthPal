import Donation from "../models/Donation.js";
import MedicalCase from "../models/MedicalCase.js";

// -------------------- Add Donation ------------------------
export const addDonation = async (req, res) => {
    try {
        const { case_id, donor_id, amount } = req.body;

        // -------------- Validation ----------------
        if (!case_id || !donor_id || !amount) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (Number.isNaN(amount) || amount <= 0) {
            return res.status(400).json({ message: "Amount must be a positive number" });
        }

        // -------------- Check if case exists ----------------
        const caseData = await MedicalCase.findById(case_id);

        if (!caseData) {
            return res.status(404).json({ message: "Case not found" });
        }

        // -------------- Prevent donation to closed case ----------------
        if (caseData.status === "closed") {
            return res.status(400).json({ message: "Cannot donate to a closed case" });
        }

        // -------------- Prevent exceeding goal amount ----------------
        if (caseData.current_amount + Number(amount) > caseData.goal_amount) {
            return res.status(400).json({
                message: "Donation exceeds goal amount"
            });
        }

        // -------------- Create Donation ----------------
        const result = await Donation.create({ case_id, donor_id, amount });

        // -------------- Update Case Amount ----------------
        await MedicalCase.updateCurrentAmount(case_id, amount);

        // If goal achieved → set funded
        const updatedCase = await MedicalCase.findById(case_id);

        if (updatedCase.current_amount === updatedCase.goal_amount) {
            await MedicalCase.updateStatus(case_id, "funded");
        }

        res.status(201).json({
            message: "Donation added successfully",
            donation_id: result.insertId
        });

    } catch (err) {

        // Foreign key (invalid donor or invalid case)
        if (err.code === "ER_NO_REFERENCED_ROW_2") {
            return res.status(400).json({ message: "Invalid donor or case" });
        }

        console.error("Add Donation Error:", err);
        res.status(500).json({ message: "Internal server error", error: err.code });
    }
};


// ------------------- Get Donations for a Case ------------------------
export const getDonationsByCase = async (req, res) => {
    try {
        const case_id = req.params.case_id;

        // Check case exists
        const caseData = await MedicalCase.findById(case_id);
        if (!caseData) {
            return res.status(404).json({ message: "Case not found" });
        }

        const donations = await Donation.findByCase(case_id);

        res.json(donations);

    } catch (err) {
        console.error("Get Donations Error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};
