import db from "../config/db.js";

const SurgicalMission = {
  create: (ngo_id, mission_name, description, specialization, location, start_date, end_date) => {
    return db.promise().query(
      `INSERT INTO surgical_missions 
       (ngo_id, mission_name, description, specialization, location, start_date, end_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [ngo_id, mission_name, description, specialization, location, start_date, end_date]
    );
  },

  getAll: () => {
    return db.promise().query("SELECT * FROM surgical_missions ORDER BY start_date ASC");
  },

  getUpcoming: () => {
    return db.promise().query(
      "SELECT * FROM surgical_missions WHERE start_date >= CURDATE() ORDER BY start_date ASC"
    );
  },

  getById: (id) => {
    return db.promise().query("SELECT * FROM surgical_missions WHERE id = ?", [id]);
  }
};

export default SurgicalMission;
