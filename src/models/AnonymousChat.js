import db from "../config/db.js";

class AnonymousChat {
  static create(user_id = null) {
    return db.promise().query(
      "INSERT INTO anonymous_chats (user_id) VALUES (?)",
      [user_id]
    );
  }

  static getById(id) {
    return db.promise().query(
      "SELECT * FROM anonymous_chats WHERE id = ?",
      [id]
    );
  }
}

export default AnonymousChat;
