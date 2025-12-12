import db from "../config/db.js";

export const InventoryItem = {
  create: (data) => {
    const sql = `
      INSERT INTO inventory_items 
      (name, description, category, quantity, donor_type, donor_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    return db.promise().query(sql, [
      data.name,
      data.description,
      data.category,
      data.quantity,
      data.donor_type,
      data.donor_id,
    ]);
  },

  getAll: () => {
    const sql = "SELECT * FROM inventory_items ORDER BY created_at DESC";
    return db.promise().query(sql);
  },

  getByCategory: (category) => {
    const sql = "SELECT * FROM inventory_items WHERE category = ?";
    return db.promise().query(sql, [category]);
  },

  getById: (id) => {
    const sql = "SELECT * FROM inventory_items WHERE id = ?";
    return db.promise().query(sql, [id]);
  }
};
