import  db  from "../config/db.js";

const NGO = {
  // Create NGO
  create: (user_id, organization_name) => {
    return db.promise().query(
      "INSERT INTO ngos (user_id, organization_name, verified) VALUES (?, ?, false)",
      [user_id, organization_name]
    );
  },

  // Get all NGOs
  getAll: () => {
    return db.promise().query("SELECT * FROM ngos");
  },

  // Get NGO by ID
  getById: (id) => {
    return db.promise().query("SELECT * FROM ngos WHERE id = ?", [id]);
  },

  // Get verified NGOs only
  getVerified: () => {
    return db.promise().query("SELECT * FROM ngos WHERE verified = true");
  },

  // Verify NGO
  verify: (id) => {
    return db.promise().query("UPDATE ngos SET verified = true WHERE id = ?", [
      id,
    ]);
  },
};

export default NGO;
