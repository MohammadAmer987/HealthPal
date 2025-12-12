import express from "express";
import { startChat, sendMessage, getChatMessages } from "../controllers/anonymousChat.controller.js";

const router = express.Router();

router.post("/start", startChat);
router.post("/:chat_id/send", sendMessage);
router.get("/:chat_id/messages", getChatMessages);

export default router;
