import express from "express";
import { getHealthGuide } from "../controllers/healthGuides.controller.js";

const router = express.Router();

router.get("/:topic", getHealthGuide);

export default router;
