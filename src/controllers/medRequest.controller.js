import MedRequest from "../models/MedRequest.js";

// إنشاء طلب دواء جديد
export const createMedRequest = async (req, res) => {
  try {
    const { patient_id, medicine_name, quantity, urgency_level } = req.body;

    if (!patient_id || !medicine_name || !quantity) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    await MedRequest.create(patient_id, medicine_name, quantity, urgency_level || "low");

    res.status(201).json({ message: "Medical request created successfully" });
  } catch (err) {
    console.error("Create Request Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// كل طلبات مريض معيّن
export const getPatientRequests = async (req, res) => {
  try {
    const { patient_id } = req.params;

    const [rows] = await MedRequest.getByPatient(patient_id);

    res.json(rows);
  } catch (err) {
    console.error("Get Requests Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// كل الطلبات (للـ NGO / Admin)
export const getAllMedRequests = async (req, res) => {
  try {
    const [rows] = await MedRequest.getAll();
    res.json(rows);
  } catch (err) {
    console.error("Get All Requests Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// تحديث حالة الطلب
export const updateMedRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["open", "matched", "delivered", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    await MedRequest.updateStatus(id, status);

    res.json({ message: "Status updated successfully" });
  } catch (err) {
    console.error("Update Status Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
