import CaseUpdate from "../models/CaseUpdate.js";
import MedicalCase from "../models/Case.js";

// --------------- Add Update ----------------
export const addCaseUpdate = async (req, res) => {
    try {
        const { update_text } = req.body;
        const case_id = req.params.case_id;

        if (!update_text) {
            return res.status(400).json({ message: "Update text is required" });
        }

        // تحقق أن الحالة موجودة
        const caseData = await MedicalCase.findById(case_id);
        if (!caseData) {
            return res.status(404).json({ message: "Case not found" });
        }

        const result = await CaseUpdate.create({
            case_id,
            update_text
        });

        res.status(201).json({
            message: "Update added successfully",
            update_id: result.insertId
        });

    } catch (err) {
        console.error("Add Update Error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};


// --------------- Get All Updates For a Case ----------------
export const getCaseUpdates = async (req, res) => {
    try {
        const case_id = req.params.case_id;

        const caseData = await MedicalCase.findById(case_id);
        if (!caseData) {
            return res.status(404).json({ message: "Case not found" });
        }

        const updates = await CaseUpdate.getByCase(case_id);

        res.json(updates);

    } catch (err) {
        console.error("Get Updates Error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};
