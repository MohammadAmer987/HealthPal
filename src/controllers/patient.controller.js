import Patient from "../models/Patient.js";

export const createPatient = async (req, res) => {
    try {
        const { medical_history, birth_date, user_id } = req.body;

        if (!user_id) {
            return res.status(400).json({ message: "user_id is required" });
        }

        const result = await Patient.create({
            medical_history,
            birth_date,
            user_id
        });

        res.status(201).json({
            message: "Patient profile created",
            patient_id: result.insertId
        });

    } catch (err) {
        console.error("Create patient error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getPatients = async (req, res) => {
    try {
        const patients = await Patient.getAll();
        res.json(patients);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getPatientById = async (req, res) => {
    try {
        const patient = await Patient.getById(req.params.id);

        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        res.json(patient);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updatePatient = async (req, res) => {
    try {
        const { medical_history, birth_date } = req.body;

        const existing = await Patient.getById(req.params.id);
        if (!existing) {
            return res.status(404).json({ message: "Patient not found" });
        }

        await Patient.update(req.params.id, {
            medical_history: medical_history || existing.medical_history,
            birth_date: birth_date || existing.birth_date
        });

        res.json({ message: "Patient updated successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};
