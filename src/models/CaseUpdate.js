import db from "../config/db.js";

export default class CaseUpdate {

    static create(data) {
        const sql = `
            INSERT INTO case_updates (case_id, update_text)
            VALUES (?, ?)
        `;

        const values = [data.case_id, data.update_text];

        return new Promise((resolve, reject) => {
            db.query(sql, values, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    static getByCase(case_id) {
        const sql = `
            SELECT id, update_text, update_date
            FROM case_updates
            WHERE case_id = ?
            ORDER BY update_date DESC
        `;

        return new Promise((resolve, reject) => {
            db.query(sql, [case_id], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }
}
