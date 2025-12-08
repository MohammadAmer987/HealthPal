import { db } from "../config/db.js";

export default class MedicalCase {
    
    static create(data) {
        const sql = `
            INSERT INTO cases 
            (patient_id, title, description, goal_amount, current_amount, status,created_at) 
            VALUES (?, ?, ?, ?, 0, 'open',NOW())
        `;

        const values = [
            data.patient_id,
            data.title,
            data.description,
            data.goal_amount
        ];

        return new Promise((resolve, reject) => {
            db.query(sql, values, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    
    static findAll() {
        const sql = `SELECT * FROM cases`;

        return new Promise((resolve, reject) => {
            db.query(sql, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }


    static findById(id) {
        const sql = `SELECT * FROM cases WHERE id = ?`;

        return new Promise((resolve, reject) => {
            db.query(sql, [id], (err, rows) => {
                if (err) reject(err);
                else resolve(rows[0]);
            });
        });
    }


    static updateStatus(id, status) {
        const sql = `UPDATE cases SET status = ? WHERE id = ?`;

        return new Promise((resolve, reject) => {
            db.query(sql, [status, id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }


    static updateCurrentAmount(id, amount) {
        const sql = `
            UPDATE cases 
            SET current_amount = current_amount + ? 
            WHERE id = ?
        `;

        return new Promise((resolve, reject) => {
            db.query(sql, [amount, id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }
}
