import express from "express";
import {
  createMedRequest,
  getPatientRequests,
  getAllMedRequests,
  updateMedRequestStatus
} from "../controllers/medRequest.controller.js";
import { auth ,allowRoles} from "../middleware/auth.js";

const router = express.Router();

// 1) Create request
router.post("/", auth, allowRoles("patient"), createMedRequest);

// 2) Get requests by patient
router.get("/patient/:patient_id",auth,allowRoles("patient"), getPatientRequests);

// 3) Get all requests (NGO/Admin)
router.get("/",auth,allowRoles("ngo","admin"), getAllMedRequests);

// 4) Update request status
router.patch("/:id/status", auth, allowRoles("ngo","admin"), updateMedRequestStatus);

export default router;
