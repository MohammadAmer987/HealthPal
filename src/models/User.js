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
RoleProblem({ userId, role }) {
  
  return new Promise((resolve, reject) => {
    
    if (role === "patient") {
      db.query(
        `INSERT INTO patients (user_id, medical_history, birth_date)
         VALUES (?, NULL, NULL)`,
        [userId],
        (err, result) => {
          if (err) return reject(err);
          resolve(result[0]);
        }
      );
    }

    else if (role === "doctor") {
      db.query(
        "INSERT INTO doctors (user_id) VALUES (?)",
        [userId],
        (err, result) => {
          if (err) return reject(err);
          resolve(result[0]);
        }
      );
    }

    else if (role === "ngo") {
      db.query(
        "INSERT INTO ngos (user_id) VALUES (?)",
        [userId],
        (err, result) => {
          if (err) return reject(err);
          resolve(result[0]);
        }
      );
    }

    else {
      return reject(new Error("Invalid role"));
    }

  });
}
,
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

  // Get all users
  getAllUsers() {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT id, full_name, email, phone, role FROM users",
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  },

  // Delete user by ID
  deleteUser(id) {
    return new Promise((resolve, reject) => {
      db.query(
        "DELETE FROM users WHERE id = ?",
        [id],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
  },
  updatePassword(id, hashedPassword) {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE users SET password=? WHERE id=?";

    db.query(sql, [hashedPassword, id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
},

  // Find user by ID
  getUserById(id) {
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


