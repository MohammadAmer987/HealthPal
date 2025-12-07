import { db } from "../config/db.js";

export default class Donation {

    static create(data) {
        const sql = `
            INSERT INTO donations 
            (case_id, donor_id, amount, donated_at) 
            VALUES (?, ?, ?, NOW())
        `;

        const values = [
            data.case_id,
            data.donor_id,
            data.amount
        ];

        return new Promise((resolve, reject) => {
            db.query(sql, values, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    static findByCase(case_id) {
        const sql = `
            SELECT d.*, u.fullname AS donor_name
            FROM donations d
            JOIN users u ON d.donor_id = u.id
            WHERE d.case_id = ?
            ORDER BY donated_at DESC
        `;

        return new Promise((resolve, reject) => {
            db.query(sql, [case_id], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }
}
