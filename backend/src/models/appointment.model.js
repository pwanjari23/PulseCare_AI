const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Appointment extends Model {
    static associate(models) {
      Appointment.belongsTo(models.Doctor, {
        foreignKey: 'doctor_id',
        as: 'doctor',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      });
      Appointment.belongsTo(models.Patient, {
        foreignKey: 'patient_id',
        as: 'patient',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      });
    }
  }

  Appointment.init(
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
      appointmentAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'appointment_at',
      },
      status: {
        type: DataTypes.ENUM('Pending', 'Confirmed', 'Completed', 'Cancelled', 'Scheduled', 'NoShow'),
        allowNull: false,
        defaultValue: 'Scheduled',
      },
      reason: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      appointmentType: {
        type: DataTypes.ENUM('Online', 'Offline'),
        allowNull: false,
        defaultValue: 'Online',
        field: 'appointment_type',
      },
      meetingLink: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'meeting_link',
      },
      cancellationReason: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'cancellation_reason',
      },
      rescheduledFromId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
        field: 'rescheduled_from_id',
        references: {
          model: 'appointments',
          key: 'id',
        },
      },
      durationMinutes: {
        type: DataTypes.SMALLINT.UNSIGNED,
        allowNull: false,
        defaultValue: 30,
        field: 'duration_minutes',
      },
    },
    {
      sequelize,
      modelName: 'Appointment',
      tableName: 'appointments',
      underscored: true,
      paranoid: true, // Enables soft deletes
    }
  );

  return Appointment;
};
