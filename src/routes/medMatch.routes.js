import express from "express";
import { matchMedication } from "../controllers/medMatch.controller.js";

const router = express.Router();

router.post("/match", matchMedication);

export default router;
