const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class VitalsLog extends Model {
    static associate(models) {
      VitalsLog.belongsTo(models.Patient, {
        foreignKey: 'patient_id',
        as: 'patient',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      VitalsLog.hasOne(models.VitalsAlert, {
        foreignKey: 'vitals_log_id',
        as: 'alert',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  VitalsLog.init(
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
      heartRate: {
        type: DataTypes.SMALLINT.UNSIGNED,
        allowNull: false,
        field: 'heart_rate',
      },
      systolicBp: {
        type: DataTypes.SMALLINT.UNSIGNED,
        allowNull: false,
        field: 'systolic_bp',
      },
      diastolicBp: {
        type: DataTypes.SMALLINT.UNSIGNED,
        allowNull: false,
        field: 'diastolic_bp',
      },
      oxygenLevel: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        field: 'oxygen_level',
        validate: {
          min: 0,
          max: 100,
        },
      },
      temperature: {
        type: DataTypes.DECIMAL(4, 1),
        allowNull: false,
      },
      weight: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      loggedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'logged_at',
      },
      triageStatus: {
        type: DataTypes.ENUM('Normal', 'Warning', 'Critical'),
        allowNull: false,
        defaultValue: 'Normal',
        field: 'triage_status',
      },
      respiratoryRate: {
        type: DataTypes.SMALLINT.UNSIGNED,
        allowNull: true,
        field: 'respiratory_rate',
      },
      bloodGlucoseMgdl: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        field: 'blood_glucose_mgdl',
      },
      bloodGlucoseType: {
        type: DataTypes.ENUM('Fasting', 'Random', 'Post-Meal'),
        allowNull: true,
        field: 'blood_glucose_type',
      },
      painLevel: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: true,
        field: 'pain_level',
        validate: {
          min: 1,
          max: 10,
        },
      },
      sleepHours: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: true,
        field: 'sleep_hours',
      },
      symptoms: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      mood: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      source: {
        type: DataTypes.ENUM('Manual', 'Bluetooth', 'Wearable', 'Imported'),
        allowNull: false,
        defaultValue: 'Manual',
      },
    },
    {
      sequelize,
      modelName: 'VitalsLog',
      tableName: 'vitals_logs',
      underscored: true,
      paranoid: false, // Soft delete disabled
    }
  );

  return VitalsLog;
};
