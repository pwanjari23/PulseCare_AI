const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Specialization extends Model {
    static associate(models) {
      Specialization.hasMany(models.Doctor, {
        foreignKey: 'specialization_id',
        as: 'doctors',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });
    }
  }

  Specialization.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Specialization',
      tableName: 'specializations',
      underscored: true,
      paranoid: false, // Soft delete disabled
    }
  );

  return Specialization;
};
