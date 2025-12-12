import  db  from "../config/db.js";

const Appointment = {
  create: (availability_id, patient_id) => {
    return db.promise().query(
      "INSERT INTO appointments (availability_id, patient_id) VALUES (?, ?)",
      [availability_id, patient_id]
    );
  },

  getByDoctor: (doctor_id) => {
    return db.promise().query(
      `SELECT a.*, da.available_date, da.start_time, da.end_time, p.full_name AS patient_name
       FROM appointments a
       JOIN doctor_availability da ON a.availability_id = da.id
       JOIN patients p ON a.patient_id = p.id
       WHERE da.doctor_id = ?
       ORDER BY da.available_date ASC`,
      [doctor_id]
    );
  },

  getByPatient: (patient_id) => {
    return db.promise().query(
      `SELECT a.*, da.available_date, da.start_time, da.end_time, d.specialty, d.bio
       FROM appointments a
       JOIN doctor_availability da ON a.availability_id = da.id
       JOIN doctors d ON da.doctor_id = d.id
       WHERE a.patient_id = ?
       ORDER BY a.created_at DESC`,
      [patient_id]
    );
  },

  updateStatus: (id, status) => {
    return db.promise().query(
      "UPDATE appointments SET status = ? WHERE id = ?",
      [status, id]
    );
  },

  checkIfTaken: (availability_id) => {
    return db.promise().query(
      "SELECT * FROM appointments WHERE availability_id = ?",
      [availability_id]
    );
  }
};

export default Appointment;
