import Donation from "../models/Donation.js";
import MedicalCase from "../models/MedicalCase.js";

// -------------------- Add Donation ------------------------
export const addDonation = async (req, res) => {
    try {
        const { case_id, donor_id } = req.body;
        let { amount } = req.body;

        // -------------- Validation ----------------
        if (case_id == null || donor_id == null || amount == null) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Normalize and validate numeric amount
        const amt = Number(amount);
        if (Number.isNaN(amt) || amt <= 0) {
            return res.status(400).json({ message: "Amount must be a positive number" });
        }
        // overwrite amount with numeric value for downstream calls
        amount = amt;

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
        // Use integer cents to avoid floating point precision issues
        const current = Number(caseData.current_amount) || 0;
        const goal = Number(caseData.goal_amount) || 0;
        const currentCents = Math.round(current * 100);
        const amtCents = Math.round(amount * 100);
        const goalCents = Math.round(goal * 100);

        if (currentCents + amtCents > goalCents) {
            return res.status(400).json({ message: "Donation exceeds goal amount" });
        }

        // -------------- Create Donation ----------------
        const result = await Donation.create({ case_id, donor_id, amount });

        // -------------- Update Case Amount ----------------
        // Note: this is not atomic; consider moving to a DB transaction or
        // an atomic UPDATE that checks current_amount + ? <= goal_amount
        await MedicalCase.updateCurrentAmount(case_id, amount);

        // If goal achieved → set funded (use numeric comparison)
        const updatedCase = await MedicalCase.findById(case_id);
        const updatedCurrent = Number(updatedCase.current_amount) || 0;
        const updatedGoal = Number(updatedCase.goal_amount) || 0;

        if (updatedCurrent >= updatedGoal) {
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
