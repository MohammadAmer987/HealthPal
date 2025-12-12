import db from "../config/db.js";

const CaseExpense = {
  createExpense: (data) => {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO case_expenses (case_id, amount_used, description)
        VALUES (?, ?, ?)
      `;
      db.query(sql, [data.case_id, data.amount_used, data.description], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  getExpensesByCase: (caseId) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT id, amount_used, description, expense_date
        FROM case_expenses
        WHERE case_id = ?
        ORDER BY expense_date DESC
      `;
      db.query(sql, [caseId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  getTotalUsed: (caseId) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT SUM(amount_used) AS total_used
        FROM case_expenses
        WHERE case_id = ?
      `;
      db.query(sql, [caseId], (err, results) => {
        if (err) return reject(err);
        resolve(results[0].total_used || 0);
      });
    });
  }
};

export default CaseExpense;
