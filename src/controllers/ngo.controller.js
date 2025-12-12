import NGO from "../models/NGO.js";

// Create NGO
export const createNGO = async (req, res) => {
  try {
    const { user_id, organization_name } = req.body;

    if (!user_id || !organization_name)
      return res.status(400).json({ message: "Missing required fields" });

    await NGO.create(user_id, organization_name);

    res.status(201).json({ message: "NGO created successfully" });
  } catch (err) {
    console.error("Error creating NGO:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all NGOs
export const getNGOs = async (req, res) => {
  try {
    const [rows] = await NGO.getAll();
    res.json(rows);
  } catch (err) {
    console.error("Error fetching NGOs:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get verified NGOs
export const getVerifiedNGOs = async (req, res) => {
  try {
    const [rows] = await NGO.getVerified();
    res.json(rows);
  } catch (err) {
    console.error("Error fetching verified NGOs:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Verify NGO (Admin-only ideally)
export const verifyNGO = async (req, res) => {
  try {
    const { id } = req.params;

    await NGO.verify(id);
    res.json({ message: "NGO verified successfully" });
  } catch (err) {
    console.error("Error verifying NGO:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get NGO by ID
export const getNGOById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await NGO.getById(id);
    if (rows.length === 0)
      return res.status(404).json({ message: "NGO not found" });

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching NGO:", err);
    res.status(500).json({ message: "Server error" });
  }
};

