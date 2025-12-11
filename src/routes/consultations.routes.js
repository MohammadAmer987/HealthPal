import express from 'express';
import {
  getAllConsultations,
  getConsultationById,
  createConsultation,
  updateConsultation,
  deleteConsultation,
  getConsultationsByDoctor,
  getConsultationsByPatient
} from '../controllers/consultation.controller.js';

const router = express.Router();

// CRUD
router.get('/', getAllConsultations);
router.get('/:id', getConsultationById);
router.post('/', createConsultation);
router.put('/:id', updateConsultation);
router.delete('/:id', deleteConsultation);

// Doctor-specific consultations
router.get('/doctor/:doctorId', getConsultationsByDoctor);

// Patient-specific consultations
router.get('/patient/:patientId', getConsultationsByPatient);

export default router;
