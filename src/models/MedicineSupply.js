import db from "../config/db.js";

const MedicineSupply = {
  create: (supplier_id, medicine_name, quantity, expiry_date) => {
    const sql = `
      INSERT INTO medicine_supply (supplier_id, medicine_name, quantity_available, expiry_date)
      VALUES (?, ?, ?, ?)
    `;
    return db.promise().query(sql, [
      supplier_id,
      medicine_name,
      quantity,
      expiry_date
    ]);
  },

  getAll: () => {
    const sql = `SELECT * FROM medicine_supply ORDER BY created_at DESC`;
    return db.promise().query(sql);
  },

  getById: (id) => {
    const sql = `SELECT * FROM medicine_supply WHERE id = ?`;
    return db.promise().query(sql, [id]);
  },

  updateQuantity: (id, quantity) => {
    const sql = `
      UPDATE medicine_supply
      SET quantity_available = ?
      WHERE id = ?
    `;
    return db.promise().query(sql, [quantity, id]);
  },
  reduceQuantity: (id, amount) => {
  const sql = `
    UPDATE medicine_supply
    SET quantity_available = quantity_available - ?
    WHERE id = ? AND quantity_available >= ?
  `;
  return db.promise().query(sql, [amount, id, amount]);
},

  delete: (id) => {
    const sql = `DELETE FROM medicine_supply WHERE id = ?`;
    return db.promise().query(sql, [id]);
  }
};

export default MedicineSupply;
