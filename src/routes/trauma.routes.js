import express from "express";
import { getTraumaResource } from "../controllers/trauma.controller.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/resource/:topic",auth, getTraumaResource);

export default router;
