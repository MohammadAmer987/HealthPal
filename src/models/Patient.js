import  db  from "../config/db.js";

export default class Patient {

    static create(data) {
        const sql = `
            INSERT INTO patients (medical_history, birth_date, user_id)
            VALUES (?, ?, ?)
        `;
        const values = [
            data.medical_history || null,
            data.birth_date || null,
            data.user_id
        ];

        return new Promise((resolve, reject) => {
            db.query(sql, values, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    static getAll() {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM patients`,
                (err, rows) => err ? reject(err) : resolve(rows)
            );
        });
    }

    static getById(id) {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM patients WHERE id = ?`,
                [id],
                (err, rows) => err ? reject(err) : resolve(rows[0])
            );
        });
    }

    static update(id, data) {
        const sql = `
            UPDATE patients
            SET medical_history = ?, birth_date = ?
            WHERE id = ?
        `;

        const values = [
            data.medical_history,
            data.birth_date,
            id
        ];

        return new Promise((resolve, reject) => {
            db.query(sql, values, (err, result) =>
                err ? reject(err) : resolve(result)
            );
        });
    }
}
