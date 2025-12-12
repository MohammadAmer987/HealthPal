import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const ConsultationMessage = sequelize.define('ConsultationMessage', {
  consultationId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  senderType: { 
    type: DataTypes.ENUM('doctor', 'patient'),
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  timestamps: true
});

export default ConsultationMessage;
