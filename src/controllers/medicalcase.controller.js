import MedicalCase from "../models/MedicalCase.js";


export const createCase = async (req, res) => {
    try {
        const { patient_id, title, description, goal_amount } = req.body;

        if (!patient_id || !title || !description || !goal_amount) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (Number.isNaN(goal_amount) || goal_amount <= 0) {
            return res.status(400).json({ message: "Goal amount must be a positive number" });
        }


        const result = await MedicalCase.create({
            patient_id,
            title,
            description,
            goal_amount
        });

        res.status(201).json({
            message: "Medical case created successfully",
            case_id: result.insertId
        });

    } catch (err) {

        // Duplicate Key 
        if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ message: "Case already exists" });
        }

        // Foreign key constraint error
        if (err.code === "ER_NO_REFERENCED_ROW_2") {
            return res.status(400).json({ message: "Patient does not exist" });
        }

        console.error("Create Case Error:", err);
        res.status(500).json({ message: "Internal server error", error: err.code });
    }
};


export const getAllCases = async (req, res) => {
    try {
        const cases = await MedicalCase.findAll();
        res.json(cases);

    } catch (err) {
        console.error("Get All Cases Error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const getCaseById = async (req, res) => {
    try {
        const id = req.params.id;

        const caseData = await MedicalCase.findById(id);

        if (!caseData) {
            return res.status(404).json({ message: "Case not found" });
        }

        res.json(caseData);

    } catch (err) {
        console.error("Get Case Error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};



export const updateCaseStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const id = req.params.id;

        const allowedStatuses = ["open", "funded", "closed"];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status. Allowed values: open, funded, closed"
            });
        }

        const result = await MedicalCase.updateStatus(id, status);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Case not found" });
        }

        res.json({ message: "Status updated successfully" });

    } catch (err) {
        console.error("Update Status Error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};
