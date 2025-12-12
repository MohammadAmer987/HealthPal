import express from "express";
import { getTraumaResource } from "../controllers/trauma.controller.js";

const router = express.Router();

router.get("/resource/:topic", getTraumaResource);

export default router;
