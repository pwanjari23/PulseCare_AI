const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ActivityLog extends Model {
    static associate(models) {
      ActivityLog.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });
    }
  }

  ActivityLog.init(
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true, // Nullable to handle anonymous events (e.g., failed logins)
        field: 'user_id',
        references: {
          model: 'users',
          key: 'id',
        },
      },
      action: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      module: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      entity: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      entityId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
        field: 'entity_id',
      },
      ipAddress: {
        type: DataTypes.STRING(45),
        allowNull: false,
        field: 'ip_address',
      },
      userAgent: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'user_agent',
      },
    },
    {
      sequelize,
      modelName: 'ActivityLog',
      tableName: 'activity_logs',
      underscored: true,
      updatedAt: false, // Logs are write-only; no updates occur
      paranoid: false, // Soft delete disabled
    }
  );

  return ActivityLog;
};
