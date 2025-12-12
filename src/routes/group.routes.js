import express from "express";
import { createGroup, getAllGroups,createPost, getGroupPosts } from "../controllers/group.controller.js";
import { auth } from "../middleware/auth.js";
const router = express.Router();

router.get("/", getAllGroups);
router.post("/", createGroup);

// Posts
router.get("/:group_id/posts",auth, getGroupPosts);
router.post("/:group_id/posts",auth, createPost);

export default router;
