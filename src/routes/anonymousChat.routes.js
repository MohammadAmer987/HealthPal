import express from "express";
import { startChat, sendMessage, getChatMessages } from "../controllers/anonymousChat.controller.js";
import { auth } from "../middleware/auth.js";
const router = express.Router();

router.post("/start",auth, startChat);
router.post("/:chat_id/send",auth, sendMessage);
router.get("/:chat_id/messages",auth, getChatMessages);

export default router;
