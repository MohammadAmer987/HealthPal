import db from "../config/db.js";

export const InventoryRequest = {
  create: (item_id, requester_id) => {
    const sql = `
      INSERT INTO inventory_requests (item_id, requester_id)
      VALUES (?, ?)
    `;
    return db.promise().query(sql, [item_id, requester_id]);
  },

  getRequestsForItem: (item_id) => {
    const sql = `
      SELECT r.*, u.name AS requester_name
      FROM inventory_requests r
      JOIN users u ON r.requester_id = u.id
      WHERE item_id = ?
    `;
    return db.promise().query(sql, [item_id]);
  },

  updateStatus: (id, status) => {
    const sql = `
      UPDATE inventory_requests
      SET status = ?
      WHERE id = ?
    `;
    return db.promise().query(sql, [status, id]);
  }
};
