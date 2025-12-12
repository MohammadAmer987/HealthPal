import express from "express";
import {getAllUsers,getUserById,deleteUser,updatePassword} from "../../controllers/user.controller.js";
import { auth ,allowRoles} from "../../middleware/auth.js";

const router = express.Router();
router.get("/", auth, getAllUsers);               // Get all users
router.get("/:id", auth,getUserById);           // Get user by ID
router.delete("/:id", auth,allowRoles("admin"), deleteUser);         // Delete user
router.patch("/:id/password", auth, updatePassword); // Update user password
export default router;