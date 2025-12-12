import express from "express";
import {
  addSupply,
  getAllSupply,
  updateSupplyQuantity,
  deleteSupply
} from "../controllers/medicineSupply.controller.js";

const router = express.Router();

router.post("/", addSupply);                // إضافة دواء
router.get("/", getAllSupply);              // عرض كل الدواء
router.patch("/:id", updateSupplyQuantity); // تحديث كمية
router.delete("/:id", deleteSupply);        // حذف

export default router;
