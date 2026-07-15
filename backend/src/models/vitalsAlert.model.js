const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class VitalsAlert extends Model {
    static associate(models) {
      VitalsAlert.belongsTo(models.Patient, {
        foreignKey: 'patient_id',
        as: 'patient',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      VitalsAlert.belongsTo(models.VitalsLog, {
        foreignKey: 'vitals_log_id',
        as: 'vitalsLog',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      VitalsAlert.belongsTo(models.Doctor, {
        foreignKey: 'doctor_id',
        as: 'doctor',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  VitalsAlert.init(
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
      vitalsLogId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        unique: true,
        field: 'vitals_log_id',
        references: {
          model: 'vitals_logs',
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
      alertType: {
        type: DataTypes.ENUM('Warning', 'Critical'),
        allowNull: false,
        field: 'alert_type',
      },
      status: {
        type: DataTypes.ENUM('Open', 'Acknowledged', 'Resolved'),
        allowNull: false,
        defaultValue: 'Open',
      },
      resolvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'resolved_at',
      },
      resolutionNotes: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'resolution_notes',
      },
    },
    {
      sequelize,
      modelName: 'VitalsAlert',
      tableName: 'vitals_alerts',
      underscored: true,
      paranoid: false, // Soft delete disabled
    }
  );

  return VitalsAlert;
};
