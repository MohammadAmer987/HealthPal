import User from "../models/User.js";
import bcrypt from "bcryptjs";

// ===========================
// Get all users
// ===========================
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json(users);
  } catch (err) {
    console.error("Get All Users Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ===========================
// Get user by ID
// ===========================
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params; // ← أهم شيء هنا

    const user = await User.getUserById(id);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Get User Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ===========================
// Delete user
// ===========================
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await User.deleteUser(id);

    res.json({ message: "User deleted" });
  } catch (err) {
    console.error("Delete User Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ===========================
// Update password
// ===========================
export const updatePassword = async (req, res) => {
  try {
    const { new_password } = req.body;
    const userId = req.user.id; // from token

    const hashed = await bcrypt.hash(new_password, 10);

    await User.updatePassword(userId, hashed);

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Update Password Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
