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


