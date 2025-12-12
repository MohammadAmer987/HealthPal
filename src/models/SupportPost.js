import db from "../config/db.js";

class SupportPost {
  static create(group_id, user_id, content, is_anonymous) {
    return db.promise().query(
      "INSERT INTO support_posts (group_id, user_id, content, is_anonymous) VALUES (?, ?, ?, ?)",
      [group_id, user_id, content, is_anonymous]
    );
  }

  static getByGroup(group_id) {
    return db.promise().query(
      `SELECT sp.id, sp.content, sp.is_anonymous, sp.created_at,
              IF(sp.is_anonymous = 1, 'Anonymous', u.name) AS author
       FROM support_posts sp
       LEFT JOIN users u ON sp.user_id = u.id
       WHERE group_id = ?
       ORDER BY created_at DESC`,
      [group_id]
    );
  }
}

export default SupportPost;
