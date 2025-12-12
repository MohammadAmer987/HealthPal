import MedicineSupply from "../models/MedicineSupply.js";

// إضافة دواء جديد للمخزون
export const addSupply = async (req, res) => {
  try {
    const { supplier_id, medicine_name, quantity, expiry_date } = req.body;

    if (!supplier_id || !medicine_name || !quantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    await MedicineSupply.create(
      supplier_id,
      medicine_name,
      quantity,
      expiry_date || null
    );

    res.status(201).json({ message: "Medicine supply added successfully" });
  } catch (err) {
    console.error("Add supply error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// عرض كل المخزون
export const getAllSupply = async (req, res) => {
  try {
    const [rows] = await MedicineSupply.getAll();
    res.json(rows);
  } catch (err) {
    console.error("Get all supply error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// تحديث كمية المخزون
export const updateSupplyQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity_available } = req.body;

    if (quantity_available == null)
      return res.status(400).json({ message: "Quantity is required" });

    await MedicineSupply.updateQuantity(id, quantity_available);

    res.json({ message: "Quantity updated" });
  } catch (err) {
    console.error("Update quantity error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// حذف دواء من المخزون
export const deleteSupply = async (req, res) => {
  try {
    const { id } = req.params;

    await MedicineSupply.delete(id);

    res.json({ message: "Medicine entry deleted" });
  } catch (err) {
    console.error("Delete supply error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
