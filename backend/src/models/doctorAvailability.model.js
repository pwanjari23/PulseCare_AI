const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DoctorAvailability extends Model {
    static associate(models) {
      DoctorAvailability.belongsTo(models.Doctor, {
        foreignKey: 'doctor_id',
        as: 'doctor',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  DoctorAvailability.init(
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
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
      dayOfWeek: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: false,
        field: 'day_of_week',
        validate: {
          min: 0,
          max: 6,
        },
      },
      startTime: {
        type: DataTypes.TIME,
        allowNull: false,
        field: 'start_time',
      },
      endTime: {
        type: DataTypes.TIME,
        allowNull: false,
        field: 'end_time',
      },
      isAvailable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_available',
      },
    },
    {
      sequelize,
      modelName: 'DoctorAvailability',
      tableName: 'doctor_availabilities',
      underscored: true,
      paranoid: true,
    }
  );

  return DoctorAvailability;
};
