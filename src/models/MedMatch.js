import db from "../config/db.js";

const MedMatch = {

  create: (request_id, supply_id, matched_quantity) => {
    const sql = `
      INSERT INTO med_match (request_id, supply_id, matched_quantity, matched_at)
      VALUES (?, ?, ?, NOW())
    `;
    return db.promise().query(sql, [request_id, supply_id, matched_quantity]);
  },

  getMatchesForRequest: (request_id) => {
    const sql = `
      SELECT m.*, s.medicine_name, s.supplier_id
      FROM med_match m
      JOIN medicine_supply s ON m.supply_id = s.id
      WHERE m.request_id = ?
    `;
    return db.promise().query(sql, [request_id]);
  }
};

export default MedMatch;
