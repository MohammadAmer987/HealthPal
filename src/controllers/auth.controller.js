import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const register = async (req, res) => {
  try {
    const { full_name, email, password, phone, role } = req.body;

    if (!full_name || !email || !password)
      return res.status(400).json({ message: "Missing required fields" });

    // Check if email exists
    const existing = await User.findByEmail(email);
    if (existing) return res.status(409).json({ message: "Email already exists" });

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user
    await User.create({
      full_name,
      email,
      password: hashed,
      phone,
      role: role || "patient"
    });

    res.status(201).json({ message: "User registered successfully" });

  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Compare passwords
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid password" });

    // Create token
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
const revokedTokens = new Set();

export const logout = (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(400).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  revokedTokens.add(token);

  return res.status(200).json({ message: "Logged out successfully" });
};

export const isTokenRevoked = (token) => revokedTokens.has(token);

