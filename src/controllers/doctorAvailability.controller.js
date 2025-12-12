import DoctorAvailability from "../models/DoctorAvailability.js";

// Add availability slot
export const addAvailability = async (req, res) => {
  try {
    const { doctor_id, available_date, start_time, end_time } = req.body;

    if (!doctor_id || !available_date || !start_time || !end_time)
      return res.status(400).json({ message: "Missing required fields" });

    await DoctorAvailability.create(
      doctor_id,
      available_date,
      start_time,
      end_time
    );

    res.status(201).json({ message: "Availability added" });
  } catch (err) {
    console.error("Error adding availability:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get availability for one doctor
export const getDoctorAvailability = async (req, res) => {
  try {
    const { doctor_id } = req.params;

    const [rows] = await DoctorAvailability.getByDoctor(doctor_id);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching availability:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete availability slot
export const deleteAvailability = async (req, res) => {
  try {
    const { id } = req.params;

    await DoctorAvailability.delete(id);

    res.json({ message: "Availability removed" });
  } catch (err) {
    console.error("Error deleting availability:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all availability (for NGOs to schedule missions)
export const getAllAvailability = async (req, res) => {
  try {
    const [rows] = await DoctorAvailability.getAll();
    res.json(rows);
  } catch (err) {
    console.error("Error getting all availability:", err);
    res.status(500).json({ message: "Server error" });
  }
};
