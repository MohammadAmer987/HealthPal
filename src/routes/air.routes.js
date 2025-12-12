import express from "express";
import { getAirPollution } from "../controllers/air.controller.js";
import { auth } from "../middleware/auth.js";
const router = express.Router();

// Use numeric id in the route (preferred). For backward compatibility,
// the controller also accepts a `city` param if needed on older clients.
router.get("/:id", auth,getAirPollution);

export default router;
