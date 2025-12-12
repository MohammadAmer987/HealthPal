import db from "../config/db.js";

export const getLocationByName = (name) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM locations WHERE name = ?";
    db.query(sql, [name], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]);
    });
  });
};
