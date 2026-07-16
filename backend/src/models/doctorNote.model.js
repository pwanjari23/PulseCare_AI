const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DoctorNote extends Model {
    static associate(models) {
      DoctorNote.belongsTo(models.Doctor, {
        foreignKey: 'doctor_id',
        as: 'doctor',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      DoctorNote.belongsTo(models.Patient, {
        foreignKey: 'patient_id',
        as: 'patient',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      DoctorNote.belongsTo(models.Appointment, {
        foreignKey: 'appointment_id',
        as: 'appointment',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });
    }
  }

  DoctorNote.init(
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      patientId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        field: 'patient_id',
        references: {
          model: 'patients',
          key: 'id',
        },
      },
      doctorId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        field: 'doctor_id',
        references: {
          model: 'doctors',
          key: 'id',
        },
      },
      appointmentId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
        field: 'appointment_id',
        references: {
          model: 'appointments',
          key: 'id',
        },
      },
      title: {
        type: DataTypes.STRING(200),
        allowNull: false,
        defaultValue: 'Clinical Note',
      },
      noteContent: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'note_content',
      },
      isArchived: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_archived',
      },
    },
    {
      sequelize,
      modelName: 'DoctorNote',
      tableName: 'doctor_notes',
      underscored: true,
      paranoid: false,
    }
  );

  return DoctorNote;
};
