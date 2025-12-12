import express from "express";
import { getAirPollution } from "../controllers/air.controller.js";

const router = express.Router();

router.get("/air/:city", getAirPollution);

export default router;
