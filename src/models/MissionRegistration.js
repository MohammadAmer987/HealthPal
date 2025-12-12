import db from "../config/db.js";

const MissionRegistration = {
  register: (mission_id, patient_id) => {
    return db.promise().query(
      "INSERT INTO mission_registrations (mission_id, patient_id) VALUES (?, ?)",
      [mission_id, patient_id]
    );
  },

  getByMission: (mission_id) => {
    return db.promise().query(
      `SELECT mr.*, p.full_name, p.birth_date
       FROM mission_registrations mr
       JOIN patients p ON mr.patient_id = p.id
       WHERE mission_id = ?`,
      [mission_id]
    );
  },

  updateStatus: (id, status) => {
    return db.promise().query(
      "UPDATE mission_registrations SET status = ? WHERE id = ?",
      [status, id]
    );
  }
};

export default MissionRegistration;
