import Appointment from "../models/Appointment.js";

// Create appointment
export const createAppointment = async (req, res) => {
  try {
    const { availability_id, patient_id } = req.body;

    if (!availability_id || !patient_id)
      return res.status(400).json({ message: "Missing fields" });

    // لا يمكن حجز نفس الوقت مرتين
    const [taken] = await Appointment.checkIfTaken(availability_id);
    if (taken.length > 0)
      return res.status(400).json({ message: "This slot is already booked" });

    await Appointment.create(availability_id, patient_id);

    res.status(201).json({ message: "Appointment created successfully" });
  } catch (err) {
    console.error("Error creating appointment:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Doctor views his appointments
export const getDoctorAppointments = async (req, res) => {
  try {
    const { doctor_id } = req.params;

    const [rows] = await Appointment.getByDoctor(doctor_id);

    res.json(rows);
  } catch (err) {
    console.error("Error fetching doctor appointments:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Patient views his appointments
export const getPatientAppointments = async (req, res) => {
  try {
    const { patient_id } = req.params;

    const [rows] = await Appointment.getByPatient(patient_id);

    res.json(rows);
  } catch (err) {
    console.error("Error fetching patient appointments:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Doctor approves or rejects an appointment
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    await Appointment.updateStatus(id, status);

    res.json({ message: "Status updated successfully" });
  } catch (err) {
    console.error("Error updating appointment:", err);
    res.status(500).json({ message: "Server error" });
  }
};
