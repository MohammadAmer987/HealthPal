import express from "express";
import { createGroup, getAllGroups,createPost, getGroupPosts } from "../controllers/group.controller.js";

const router = express.Router();

router.get("/", getAllGroups);
router.post("/", createGroup);

// Posts
router.get("/:group_id/posts", getGroupPosts);
router.post("/:group_id/posts", createPost);

export default router;
