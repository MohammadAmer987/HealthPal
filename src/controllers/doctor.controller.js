import Doctor from '../models/Doctor.js';

// GET all doctors
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll();
    res.json(doctors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching doctors" });
  }
};

// GET a doctor by ID
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.json(doctor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching doctor" });
  }
};

// POST create doctor
export const createDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body);
    res.status(201).json(doctor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating doctor" });
  }
};

// PUT update doctor
export const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    await doctor.update(req.body);
    res.json(doctor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating doctor" });
  }
};

// DELETE doctor
export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    await doctor.destroy();
    res.json({ message: "Doctor deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting doctor" });
  }
};
