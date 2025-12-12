import express from "express";
import {
  addInventoryItem,
  getInventoryItems,
  getInventoryByCategory,
  requestInventoryItem,
  updateRequestStatus
} from "../controllers/inventory.controller.js";
import { allowRoles ,auth} from "../middleware/auth.js";

const router = express.Router();

router.post("/",auth,allowRoles("admin","ngo"), addInventoryItem);
router.get("/",auth, getInventoryItems);
router.get("/category/:category",auth, getInventoryByCategory);
router.post("/:id/request",auth,allowRoles("patient"), requestInventoryItem);
router.patch("/requests/:request_id", auth, allowRoles("admin","ngo"), updateRequestStatus);

export default router;
