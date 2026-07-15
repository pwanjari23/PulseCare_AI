const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PrescriptionItem extends Model {
    static associate(models) {
      PrescriptionItem.belongsTo(models.Prescription, {
        foreignKey: 'prescription_id',
        as: 'prescription',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  PrescriptionItem.init(
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      prescriptionId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        field: 'prescription_id',
        references: {
          model: 'prescriptions',
          key: 'id',
        },
      },
      medicationName: {
        type: DataTypes.STRING(150),
        allowNull: false,
        field: 'medication_name',
      },
      dosage: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      frequency: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      durationDays: {
        type: DataTypes.SMALLINT.UNSIGNED,
        allowNull: false,
        field: 'duration_days',
      },
      instructions: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'PrescriptionItem',
      tableName: 'prescription_items',
      underscored: true,
      paranoid: false, // Soft delete disabled
    }
  );

  return PrescriptionItem;
};
