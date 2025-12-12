import  db  from "../config/db.js";

 const addFeedback = (case_id, feedback, rating) => {
    return db.execute(
        "INSERT INTO patient_feedback (case_id, feedback, rating) VALUES (?, ?, ?)",
        [case_id, feedback, rating]
    );
};export default addFeedback;