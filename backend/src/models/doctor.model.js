const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Doctor extends Model {
    static associate(models) {
      Doctor.belongsTo(models.User, {
        foreignKey: 'id',
        as: 'user',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      Doctor.belongsTo(models.Specialization, {
        foreignKey: 'specialization_id',
        as: 'specialization',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });
      Doctor.hasMany(models.Patient, {
        foreignKey: 'primary_doctor_id',
        as: 'patients',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });
      Doctor.hasMany(models.DoctorAvailability, {
        foreignKey: 'doctor_id',
        as: 'availabilities',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      Doctor.hasMany(models.Appointment, {
        foreignKey: 'doctor_id',
        as: 'appointments',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      });
      Doctor.hasMany(models.DoctorRequest, {
        foreignKey: 'doctor_id',
        as: 'receivedRequests',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      Doctor.hasMany(models.VitalsAlert, {
        foreignKey: 'doctor_id',
        as: 'alerts',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      Doctor.hasMany(models.Prescription, {
        foreignKey: 'doctor_id',
        as: 'prescriptions',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      });
      Doctor.hasMany(models.DoctorNote, {
        foreignKey: 'doctor_id',
        as: 'notes',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      Doctor.belongsTo(models.User, {
        foreignKey: 'created_by_admin_id',
        as: 'adminCreator',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });
    }
  }

  Doctor.init(
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      firstName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'first_name',
      },
      lastName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'last_name',
      },
      licenseNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        field: 'license_number',
      },
      specializationId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        field: 'specialization_id',
        references: {
          model: 'specializations',
          key: 'id',
        },
      },
      clinicName: {
        type: DataTypes.STRING(150),
        allowNull: true,
        field: 'clinic_name',
      },
      clinicAddress: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'clinic_address',
      },
      clinicZip: {
        type: DataTypes.STRING(15),
        allowNull: true,
        field: 'clinic_zip',
      },
      experienceYears: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: true,
        field: 'experience_years',
      },
      profilePhotoUrl: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'profile_photo_url',
      },
      ratingAvg: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: false,
        defaultValue: 0.00,
        field: 'rating_avg',
      },
      reviewsCount: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        field: 'reviews_count',
      },
      consultationFee: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
        field: 'consultation_fee',
      },
      languages: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      profileCompletionPct: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        field: 'profile_completion_pct',
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_verified',
      },
      createdByAdminId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
        field: 'created_by_admin_id',
        references: {
          model: 'users',
          key: 'id',
        },
      },
      lastActiveAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'last_active_at',
      },
    },
    {
      sequelize,
      modelName: 'Doctor',
      tableName: 'doctors',
      underscored: true,
      paranoid: true,
    }
  );

  return Doctor;
};
