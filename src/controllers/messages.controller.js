import ConsultationMessage from '../models/ConsultationMessage.js';
import { Op } from 'sequelize';

// 🟦 1) Get all messages for a consultation
export const getMessagesForConsultation = async (req, res) => {
  try {
    const { consultationId } = req.params;

    const messages = await ConsultationMessage.findAll({
      where: { consultationId },
      order: [['createdAt', 'ASC']]
    });

    return res.json(messages);

  } catch (err) {
    console.log("MESSAGES ERROR:", err.message);
    return res.status(500).json({
      message: "Error fetching messages",
      error: err.message
    });
  }
};

// 🟦 2) Create a new message
export const createMessage = async (req, res) => {
  try {
    const { consultationId } = req.params;
    const { senderId, senderType, message } = req.body;

    const newMessage = await ConsultationMessage.create({
      consultationId,
      senderId,
      senderType,
      message
    });

    return res.status(201).json(newMessage);

  } catch (err) {
    console.log("CREATE MESSAGE ERROR:", err.message);
    return res.status(500).json({
      message: "Error creating message",
      error: err.message
    });
  }
};

// 🟦 3) Get a single message by ID
export const getMessageById = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await ConsultationMessage.findByPk(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    return res.json(message);

  } catch (err) {
    console.log("GET MESSAGE ERROR:", err.message);
    return res.status(500).json({
      message: "Error fetching message",
      error: err.message
    });
  }
};

// 🟦 4) Update a message
export const updateMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { message } = req.body;

    const msg = await ConsultationMessage.findByPk(messageId);

    if (!msg) {
      return res.status(404).json({ message: "Message not found" });
    }

    await msg.update({ message });

    return res.json(msg);

  } catch (err) {
    console.log("UPDATE MESSAGE ERROR:", err.message);
    return res.status(500).json({
      message: "Error updating message",
      error: err.message
    });
  }
};

// 🟦 5) Delete a message
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await ConsultationMessage.findByPk(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    await message.destroy();

    return res.json({ message: "Message deleted successfully" });

  } catch (err) {
    console.log("DELETE MESSAGE ERROR:", err.message);
    return res.status(500).json({
      message: "Error deleting message",
      error: err.message
    });
  }
};

// 🟦 6) Mark message as read
export const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await ConsultationMessage.findByPk(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    await message.update({ isRead: true });

    return res.json({
      message: "Marked as read",
      data: message
    });

  } catch (err) {
    console.log("MARK AS READ ERROR:", err.message);
    return res.status(500).json({
      message: "Error marking message as read",
      error: err.message
    });
  }
};

// 🟦 7) Get last message in a consultation
export const getLastMessage = async (req, res) => {
  try {
    const { consultationId } = req.params;

    const lastMessage = await ConsultationMessage.findOne({
      where: { consultationId },
      order: [['createdAt', 'DESC']]
    });

    return res.json(lastMessage);

  } catch (err) {
    console.log("LAST MESSAGE ERROR:", err.message);
    return res.status(500).json({
      message: "Error fetching last message",
      error: err.message
    });
  }
};

// 🟦 8) Get messages by sender
export const getMessagesBySender = async (req, res) => {
  try {
    const { senderId } = req.params;

    const messages = await ConsultationMessage.findAll({
      where: { senderId }
    });

    return res.json(messages);

  } catch (err) {
    console.log("MESSAGES BY SENDER ERROR:", err.message);
    return res.status(500).json({
      message: "Error fetching messages",
      error: err.message
    });
  }
};
