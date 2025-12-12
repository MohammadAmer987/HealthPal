import db from "../config/db.js";

const MedRequest = {
  create: (patient_id, medicine_name, quantity, urgency_level) => {
    const sql = `
      INSERT INTO med_requests (patient_id, medicine_name, quantity, urgency_level, status)
      VALUES (?, ?, ?, ?, 'open')
    `;
    return db.promise().query(sql, [
      patient_id,
      medicine_name,
      quantity,
      urgency_level,
    ]);
  },

  getByPatient: (patient_id) => {
    const sql = `SELECT * FROM med_requests WHERE patient_id = ? ORDER BY created_at DESC`;
    return db.promise().query(sql, [patient_id]);
  },

  getAll: () => {
    const sql = `SELECT * FROM med_requests ORDER BY urgency_level DESC, created_at DESC`;
    return db.promise().query(sql);
  },
updateStatus: (id, status) => {
  const sql = `UPDATE med_requests SET status = ? WHERE id = ?`;
  return db.promise().query(sql, [status, id]);
},

getById: (id) => {
  const sql = `SELECT * FROM med_requests WHERE id = ?`;
  return db.promise().query(sql, [id]);
},
  
};


export default MedRequest;
