import  db  from "../config/db.js";

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
            SELECT d.id, d.case_id, d.donor_id, d.amount, d.donated_at, 
                   COALESCE(u.full_name, 'Anonymous') AS donor_name
            FROM donations d
            LEFT JOIN users u ON d.donor_id = u.id
            WHERE d.case_id = ?
            ORDER BY d.donated_at DESC
        `;

        return new Promise((resolve, reject) => {
            db.query(sql, [case_id], (err, rows) => {
                if (err) reject(err);
                else resolve(rows || []);
            });
        });
    }

    static getDonationsByCase(case_id) {
        return this.findByCase(case_id);
    }

    static getTotalDonations(case_id) {
        const sql = `
            SELECT COALESCE(SUM(amount), 0) AS total
            FROM donations
            WHERE case_id = ?
        `;

        return new Promise((resolve, reject) => {
            db.query(sql, [case_id], (err, rows) => {
                if (err) reject(err);
                else resolve(rows[0]?.total || 0);
            });
        });
    }
}
