const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.Doctor, {
        foreignKey: 'id',
        as: 'doctor',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      User.hasOne(models.Patient, {
        foreignKey: 'id',
        as: 'patient',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      User.hasMany(models.RefreshToken, {
        foreignKey: 'user_id',
        as: 'refreshTokens',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      User.hasMany(models.ActivityLog, {
        foreignKey: 'user_id',
        as: 'activityLogs',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });
      User.hasMany(models.Notification, {
        foreignKey: 'recipient_id',
        as: 'notifications',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING(191),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      passwordHash: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'password_hash',
      },
      role: {
        type: DataTypes.ENUM('Admin', 'Doctor', 'Patient'),
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('Active', 'Inactive', 'Suspended'),
        allowNull: false,
        defaultValue: 'Active',
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      underscored: true,
      paranoid: true, // Enables soft deletes
    }
  );

  return User;
};
