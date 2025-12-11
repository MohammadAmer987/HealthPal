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

    res.json(messages);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching messages' });
  }
};

// 🟦 2) Create a new message
export const createMessage = async (req, res) => {
  try {
    const { consultationId } = req.params;

    const newMessage = await ConsultationMessage.create({
      consultationId,
      senderId: req.body.senderId,
      senderType: req.body.senderType,
      message: req.body.message
    });

    res.status(201).json(newMessage);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating message' });
  }
};

// 🟦 3) Get a single message by ID
export const getMessageById = async (req, res) => {
  try {
    const message = await ConsultationMessage.findByPk(req.params.messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.json(message);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching message' });
  }
};

// 🟦 4) Update a message (edit text)
export const updateMessage = async (req, res) => {
  try {
    const message = await ConsultationMessage.findByPk(req.params.messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    await message.update({
      message: req.body.message ?? message.message
    });

    res.json(message);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating message' });
  }
};

// 🟦 5) Delete a message
export const deleteMessage = async (req, res) => {
  try {
    const message = await ConsultationMessage.findByPk(req.params.messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    await message.destroy();

    res.json({ message: "Message deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting message' });
  }
};

// 🟦 6) Mark message as read/unread
export const markAsRead = async (req, res) => {
  try {
    const message = await ConsultationMessage.findByPk(req.params.messageId);

    if (!message) return res.status(404).json({ message: "Message not found" });

    await message.update({ isRead: true });

    res.json({ message: "Marked as read", data: message });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error marking message as read' });
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

    res.json(lastMessage);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching last message' });
  }
};

// 🟦 8) Get messages by sender (doctor/patient)
export const getMessagesBySender = async (req, res) => {
  try {
    const { senderId } = req.params;

    const messages = await ConsultationMessage.findAll({
      where: { senderId }
    });

    res.json(messages);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching messages' });
  }
};
