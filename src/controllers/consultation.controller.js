import Consultation from '../models/Consultation.js';

// 🟦 1) Get all consultations
export const getAllConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(consultations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching consultations" });
  }
};

// 🟦 2) Get consultation by ID
export const getConsultationById = async (req, res) => {
  try {
    const consultation = await Consultation.findByPk(req.params.id);

    if (!consultation)
      return res.status(404).json({ message: "Consultation not found" });

    res.json(consultation);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching consultation" });
  }
};

// 🟦 3) Create new consultation
export const createConsultation = async (req, res) => {
  try {
    const consultation = await Consultation.create(req.body);
    res.status(201).json(consultation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating consultation" });
  }
};

// 🟦 4) Update consultation (subject, status…)
export const updateConsultation = async (req, res) => {
  try {
    const consultation = await Consultation.findByPk(req.params.id);

    if (!consultation)
      return res.status(404).json({ message: "Consultation not found" });

    await consultation.update(req.body);

    res.json(consultation);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating consultation" });
  }
};

// 🟦 5) Delete consultation
export const deleteConsultation = async (req, res) => {
  try {
    const consultation = await Consultation.findByPk(req.params.id);

    if (!consultation)
      return res.status(404).json({ message: "Consultation not found" });

    await consultation.destroy();
    res.json({ message: "Consultation deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting consultation" });
  }
};

// 🟦 6) Get all consultations for a doctor
export const getConsultationsByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const consultations = await Consultation.findAll({
      where: { doctorId },
      order: [['createdAt', 'DESC']]
    });

    res.json(consultations);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching consultations" });
  }
};

// 🟦 7) Get all consultations for a patient
export const getConsultationsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    const consultations = await Consultation.findAll({
      where: { patientId },
      order: [['createdAt', 'DESC']]
    });

    res.json(consultations);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching consultations" });
  }
};
