import express from "express";
import { matchMedication } from "../controllers/medMatch.controller.js";
import { auth } from "../middleware/auth.js";   

const router = express.Router();

router.post("/match", auth,matchMedication);

export default router;
