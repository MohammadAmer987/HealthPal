import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const register = async (req, res) => {
  try {
    const { full_name, email, password, phone, role } = req.body;

    if (!full_name || !email || !password)
      return res.status(400).json({ message: "Missing required fields" });

    // Check existing email
    const existing = await User.findByEmail(email);
    if (existing) return res.status(409).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
console.log("ROLE RECEIVED:", role);
    // STEP 1 — Create user
    const result = await User.create({
      full_name,
      email,
      password: hashed,
      phone,
      role
    });
console.log("ROLE RECEIVED:", role);
    const userId = result.insertId;
    
    // STEP 2 — Create profile based on role
    await User.RoleProblem({userId, role});
    res.status(201).json({ message: "User registered successfully" });

  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server error" });
    console.error("REGISTER ERROR:", err.message);
  console.error(err);
  console.log("ROLE RECEIVED:", role);

  return res.status(500).json({ message: err.message });

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

