import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Consultation = sequelize.define('Consultation', {
  doctorId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('open', 'closed'),
    allowNull: false,
    defaultValue: 'open'
  }
}, {
  timestamps: true
});

export default Consultation;
