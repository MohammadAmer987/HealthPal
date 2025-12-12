import express from "express";
import { getHealthGuide } from "../controllers/healthGuides.controller.js";
import { auth } from "../middleware/auth.js";
const router = express.Router();

router.get("/:topic",auth, getHealthGuide);

export default router;
