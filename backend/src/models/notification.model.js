const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      Notification.belongsTo(models.User, {
        foreignKey: 'recipient_id',
        as: 'recipient',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  Notification.init(
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      recipientId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        field: 'recipient_id',
        references: {
          model: 'users',
          key: 'id',
        },
      },
      title: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      notificationType: {
        type: DataTypes.ENUM('Appointment', 'VitalAlert', 'DoctorApproval', 'Prescription', 'Reminder', 'System'),
        allowNull: false,
        field: 'notification_type',
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_read',
      },
      relatedEntity: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'related_entity',
      },
      relatedEntityId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
        field: 'related_entity_id',
      },
      payload: {
        type: DataTypes.JSON,
        allowNull: true
      },
    },
    {
      sequelize,
      modelName: 'Notification',
      tableName: 'notifications',
      underscored: true,
      paranoid: false, // Soft delete disabled
    }
  );

  return Notification;
};
