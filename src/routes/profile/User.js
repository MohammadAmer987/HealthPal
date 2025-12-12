import express from "express";
import user from "../../models/User.js";
import { auth ,allowRoles} from "../../middleware/auth.js";

const router = express.Router();
router.get("/", auth, user.getAllUsers);               // Get all users
router.get("/:id", auth, user.getUserById);           // Get user by ID
router.delete("/:id", auth,allowRoles("admin"), user.deleteUser);         // Delete user
router.patch("/:id/password", auth, user.updatePassword); // Update user password
export default router;