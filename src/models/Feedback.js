import db from "../config/db.js";

const Feedback = {
  // Add new feedback
  addFeedback(case_id, feedback, rating) {
    return new Promise((resolve, reject) => {
      const sql = "INSERT INTO patient_feedback (case_id, feedback, rating) VALUES (?, ?, ?)";
      db.query(sql, [case_id, feedback, rating], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  // Get feedback by case ID
  getFeedbackById(case_id) {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM patient_feedback WHERE case_id = ?";
      db.query(sql, [case_id], (err, results) => {
        if (err) return reject(err);
        resolve(results || []);
      });
    });
  }
};

export default Feedback;