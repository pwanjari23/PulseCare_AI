const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Patient extends Model {
    static associate(models) {
      Patient.belongsTo(models.User, {
        foreignKey: 'id',
        as: 'user',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      Patient.belongsTo(models.Doctor, {
        foreignKey: 'primary_doctor_id',
        as: 'primaryDoctor',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });
      Patient.hasMany(models.Appointment, {
        foreignKey: 'patient_id',
        as: 'appointments',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      });
      Patient.hasMany(models.VitalsLog, {
        foreignKey: 'patient_id',
        as: 'vitalsLogs',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      Patient.hasMany(models.VitalsAlert, {
        foreignKey: 'patient_id',
        as: 'alerts',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      Patient.hasMany(models.Prescription, {
        foreignKey: 'patient_id',
        as: 'prescriptions',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      });
      Patient.hasMany(models.DoctorNote, {
        foreignKey: 'patient_id',
        as: 'notes',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      Patient.hasOne(models.PatientHealthSummary, {
        foreignKey: 'patient_id',
        as: 'healthSummary',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      Patient.hasMany(models.DoctorRequest, {
        foreignKey: 'patient_id',
        as: 'sentRequests',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  Patient.init(
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
      dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'date_of_birth',
      },
      gender: {
        type: DataTypes.ENUM('Male', 'Female', 'Other'),
        allowNull: false,
      },
      bloodType: {
        type: DataTypes.ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
        allowNull: true,
        field: 'blood_type',
      },
      zipCode: {
        type: DataTypes.STRING(15),
        allowNull: true,
        field: 'zip_code',
      },
      primaryDoctorId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
        field: 'primary_doctor_id',
        references: {
          model: 'doctors',
          key: 'id',
        },
      },
      profilePhotoUrl: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'profile_photo_url',
      },
      heightCm: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        field: 'height_cm',
      },
      emergencyContactName: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'emergency_contact_name',
      },
      emergencyContactPhone: {
        type: DataTypes.STRING(20),
        allowNull: true,
        field: 'emergency_contact_phone',
      },
      emergencyContactRelation: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'emergency_contact_relation',
      },
      medicalConditions: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'medical_conditions',
      },
      allergies: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      smokingStatus: {
        type: DataTypes.ENUM('Non-smoker', 'Former smoker', 'Active smoker'),
        allowNull: true,
        field: 'smoking_status',
      },
      alcoholConsumption: {
        type: DataTypes.ENUM('None', 'Occasional', 'Regular', 'Heavy'),
        allowNull: true,
        field: 'alcohol_consumption',
      },
      lastVitalSubmittedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'last_vital_submitted_at',
      },
      weightKg: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        field: 'weight_kg',
      },
      profileCompletionPct: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        field: 'profile_completion_pct',
      },
    },
    {
      sequelize,
      modelName: 'Patient',
      tableName: 'patients',
      underscored: true,
      paranoid: true,
    }
  );

  return Patient;
};
