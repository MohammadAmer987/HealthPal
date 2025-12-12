import AnonymousChat from "../models/AnonymousChat.js";
import AnonymousMessage from "../models/AnonymousMessage.js";

export const startChat = async (req, res) => {
  try {
    const { user_id } = req.body;

    const [result] = await AnonymousChat.create(user_id || null);

    res.status(201).json({
      chat_id: result.insertId,
      message: "Chat session started"
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { chat_id } = req.params;
    const { sender, message } = req.body;

    await AnonymousMessage.create(chat_id, sender, message);

    res.json({ message: "Message sent" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getChatMessages = async (req, res) => {
  try {
    const { chat_id } = req.params;

    const [messages] = await AnonymousMessage.getMessages(chat_id);

    res.json(messages);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
