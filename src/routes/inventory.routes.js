import express from "express";
import {
  addInventoryItem,
  getInventoryItems,
  getInventoryByCategory,
  requestInventoryItem,
  updateRequestStatus
} from "../controllers/inventory.controller.js";

const router = express.Router();

router.post("/", addInventoryItem);
router.get("/", getInventoryItems);
router.get("/category/:category", getInventoryByCategory);
router.post("/:id/request", requestInventoryItem);
router.patch("/requests/:request_id", updateRequestStatus);

export default router;
