import db from "../config/db.js";

class SupportGroup {
  static getAll() {
    return db.promise().query("SELECT * FROM support_groups");
  }

  static getById(id) {
    return db.promise().query("SELECT * FROM support_groups WHERE id = ?", [id]);
  }

  static create(name, description, category) {
    return db.promise().query(
      "INSERT INTO support_groups (name, description, category) VALUES (?, ?, ?)",
      [name, description, category]
    );
  }
}

export default SupportGroup;
