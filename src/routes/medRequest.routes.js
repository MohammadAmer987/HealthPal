import express from "express";
import {
  createMedRequest,
  getPatientRequests,
  getAllMedRequests,
  updateMedRequestStatus
} from "../controllers/medRequest.controller.js";

const router = express.Router();

// 1) Create request
router.post("/", createMedRequest);

// 2) Get requests by patient
router.get("/patient/:patient_id", getPatientRequests);

// 3) Get all requests (NGO/Admin)
router.get("/", getAllMedRequests);

// 4) Update request status
router.patch("/:id/status", updateMedRequestStatus);

export default router;
