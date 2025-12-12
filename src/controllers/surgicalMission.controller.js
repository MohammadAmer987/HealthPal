import SurgicalMission from "../models/SurgicalMission.js";
import MissionRegistration from "../models/MissionRegistration.js";

// Create mission (NGO)
export const createMission = async (req, res) => {
  try {
    const { ngo_id, mission_name, description, specialization, location, start_date, end_date, capacity } = req.body;

    await SurgicalMission.create(
      ngo_id,
      mission_name,
      description,
      specialization,
      location,
      start_date,
      end_date,
      capacity
    );

    res.status(201).json({ message: "Surgical mission created successfully" });
  } catch (err) {
    console.error("Create mission error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all missions
export const getMissions = async (req, res) => {
  try {
    const [rows] = await SurgicalMission.getAll();
    res.json(rows);
  } catch (err) {
    console.error("Fetch missions error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get upcoming missions
export const getUpcomingMissions = async (req, res) => {
  try {
    const [rows] = await SurgicalMission.getUpcoming();
    res.json(rows);
  } catch (err) {
    console.error("Fetch upcoming missions error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Register patient to mission
export const registerToMission = async (req, res) => {
  try {
    const { mission_id, patient_id } = req.body;

    await MissionRegistration.register(mission_id, patient_id);

    res.status(201).json({ message: "Registration submitted" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Accept or reject registration
export const updateRegistrationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await MissionRegistration.updateStatus(id, status);

    res.json({ message: "Status updated" });
  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
