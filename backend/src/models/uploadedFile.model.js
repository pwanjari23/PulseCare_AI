const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UploadedFile extends Model {
    static associate(models) {
      UploadedFile.belongsTo(models.User, {
        foreignKey: 'uploaded_by',
        as: 'uploader',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  UploadedFile.init(
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      uuid: {
        type: DataTypes.STRING(36),
        allowNull: false,
        unique: true,
      },
      originalName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'original_name',
      },
      storedName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'stored_name',
      },
      mimeType: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'mime_type',
      },
      extension: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      sizeBytes: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        field: 'size_bytes',
      },
      category: {
        type: DataTypes.ENUM(
          'PROFILE_IMAGE',
          'DOCTOR_DOCUMENT',
          'PRESCRIPTION',
          'MEDICAL_REPORT',
          'LAB_REPORT'
        ),
        allowNull: false,
      },
      storageProvider: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'local',
        field: 'storage_provider',
      },
      storagePath: {
        type: DataTypes.STRING(500),
        allowNull: false,
        field: 'storage_path',
      },
      uploadedBy: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        field: 'uploaded_by',
        references: {
          model: 'users',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'UploadedFile',
      tableName: 'uploaded_files',
      underscored: true,
      paranoid: false,
    }
  );

  return UploadedFile;
};
