import express from 'express';
import {
  getMessagesForConsultation,
  createMessage,
  getMessageById,
  updateMessage,
  deleteMessage,
  markAsRead,
  getLastMessage,
  getMessagesBySender
} from '../controllers/messages.controller.js';

const router = express.Router();

// Main chat operations
router.get('/:consultationId/messages', getMessagesForConsultation);
router.post('/:consultationId/messages', createMessage);

// Message-level operations
router.get('/message/:messageId', getMessageById);
router.put('/message/:messageId', updateMessage);
router.delete('/message/:messageId', deleteMessage);

// Additional useful features
router.put('/message/:messageId/read', markAsRead);
router.get('/:consultationId/messages/last', getLastMessage);
router.get('/sender/:senderId', getMessagesBySender);

export default router;
