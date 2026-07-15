const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PatientHealthSummary extends Model {
    static associate(models) {
      PatientHealthSummary.belongsTo(models.Patient, {
        foreignKey: 'patient_id',
        as: 'patient',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  PatientHealthSummary.init(
    {
      patientId: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        field: 'patient_id',
        references: {
          model: 'patients',
          key: 'id',
        },
      },
      healthScore: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: 100,
        field: 'health_score',
        validate: {
          min: 0,
          max: 100,
        },
      },
      riskLevel: {
        type: DataTypes.ENUM('Low', 'Medium', 'High', 'Critical'),
        allowNull: false,
        defaultValue: 'Low',
        field: 'risk_level',
      },
    },
    {
      sequelize,
      modelName: 'PatientHealthSummary',
      tableName: 'patient_health_summaries',
      underscored: true,
      paranoid: false, // Soft delete disabled
    }
  );

  return PatientHealthSummary;
};
