import  db  from "../config/db.js";

const DoctorAvailability = {
  create: (doctor_id, available_date, start_time, end_time) => {
    return db
      .promise()
      .query(
        "INSERT INTO doctor_availability (doctor_id, available_date, start_time, end_time) VALUES (?, ?, ?, ?)",
        [doctor_id, available_date, start_time, end_time]
      );
  },

  getByDoctor: (doctor_id) => {
    return db
      .promise()
      .query(
        "SELECT * FROM doctor_availability WHERE doctor_id = ? ORDER BY available_date ASC",
        [doctor_id]
      );
  },

  delete: (id) => {
    return db.promise().query("DELETE FROM doctor_availability WHERE id = ?", [
      id,
    ]);
  },

  getAll: () => {
    return db
      .promise()
      .query(
        "SELECT da.*, d.specialty, d.bio FROM doctor_availability da JOIN doctors d ON da.doctor_id = d.id ORDER BY available_date"
      );
  },
};

export default DoctorAvailability;
