import express from "express";
import {
  addSupply,
  getAllSupply,
  updateSupplyQuantity,
  deleteSupply
} from "../controllers/medicineSupply.controller.js";
import { allowRoles,auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/",auth, addSupply);                // إضافة دواء
router.get("/", auth,getAllSupply);              // عرض كل الدواء
router.patch("/:id", auth, allowRoles("admin"), updateSupplyQuantity); // تحديث كمية
router.delete("/:id", auth, allowRoles("admin"),deleteSupply);        // حذف

export default router;
