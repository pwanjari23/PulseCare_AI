const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Prescription extends Model {
    static associate(models) {
      Prescription.belongsTo(models.Doctor, {
        foreignKey: 'doctor_id',
        as: 'doctor',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      });
      Prescription.belongsTo(models.Patient, {
        foreignKey: 'patient_id',
        as: 'patient',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      });
      Prescription.hasMany(models.PrescriptionItem, {
        foreignKey: 'prescription_id',
        as: 'items',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  Prescription.init(
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
      clinicalNotes: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'clinical_notes',
      },
      prescribedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'prescribed_at',
      },
      diagnosis: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      followUpDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: 'follow_up_date',
      },
      status: {
        type: DataTypes.ENUM('Active', 'Expired', 'Discontinued'),
        allowNull: false,
        defaultValue: 'Active',
      },
    },
    {
      sequelize,
      modelName: 'Prescription',
      tableName: 'prescriptions',
      underscored: true,
      paranoid: false, // Soft delete disabled
    }
  );

  return Prescription;
};
