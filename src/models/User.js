import db from "../config/db.js";

const User = {
  // Find by email
  findByEmail(email) {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM users WHERE email = ? LIMIT 1",
        [email],
        (err, results) => {
          if (err) return reject(err);
          resolve(results[0]);
        }
      );
    });
  },

  // Create new user
  create({ full_name, email, password, phone, role }) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO users (full_name, email, password, phone, role)
        VALUES (?, ?, ?, ?, ?)
      `;
      db.query(sql, [full_name, email, password, phone, role], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  // Find user by ID
  findById(id) {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT id, full_name, email, phone, role FROM users WHERE id = ?",
        [id],
        (err, results) => {
          if (err) return reject(err);
          resolve(results[0]);
        }
      );
    });
  }
};

export default User;
