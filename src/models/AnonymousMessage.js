import db from "../config/db.js";

class AnonymousMessage {
  static create(chat_id, sender, message) {
    return db.promise().query(
      "INSERT INTO anonymous_messages (chat_id, sender, message) VALUES (?, ?, ?)",
      [chat_id, sender, message]
    );
  }

  static getMessages(chat_id) {
    return db.promise().query(
      "SELECT sender, message, created_at FROM anonymous_messages WHERE chat_id = ? ORDER BY created_at ASC",
      [chat_id]
    );
  }
}

export default AnonymousMessage;
