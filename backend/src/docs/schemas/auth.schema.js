module.exports = {
  LoginRequest: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
        example: 'patient@example.com',
      },
      password: {
        type: 'string',
        minLength: 8,
        example: 'Password123!',
      },
    },
  },
  RefreshTokenRequest: {
    type: 'object',
    required: ['refreshToken'],
    properties: {
      refreshToken: {
        type: 'string',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IlBhdGllbnQifQ...',
      },
    },
  },
  RegisterPatientRequest: {
    type: 'object',
    required: ['email', 'password', 'firstName', 'lastName', 'gender', 'dateOfBirth'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
        example: 'patient@example.com',
      },
      password: {
        type: 'string',
        minLength: 8,
        example: 'Password123!',
      },
      firstName: {
        type: 'string',
        example: 'John',
      },
      lastName: {
        type: 'string',
        example: 'Doe',
      },
      gender: {
        type: 'string',
        enum: ['Male', 'Female', 'Other'],
        example: 'Male',
      },
      dateOfBirth: {
        type: 'string',
        format: 'date',
        example: '1990-01-01',
      },
      phone: {
        type: 'string',
        example: '1234567890',
      },
    },
  },
  RegisterDoctorRequest: {
    type: 'object',
    required: [
      'email',
      'password',
      'firstName',
      'lastName',
      'gender',
      'dateOfBirth',
      'specializationId',
      'licenseNumber',
      'experienceYears',
      'consultationFee',
    ],
    properties: {
      email: {
        type: 'string',
        format: 'email',
        example: 'doctor@example.com',
      },
      password: {
        type: 'string',
        minLength: 8,
        example: 'Password123!',
      },
      firstName: {
        type: 'string',
        example: 'Jane',
      },
      lastName: {
        type: 'string',
        example: 'Smith',
      },
      gender: {
        type: 'string',
        enum: ['Male', 'Female', 'Other'],
        example: 'Female',
      },
      dateOfBirth: {
        type: 'string',
        format: 'date',
        example: '1985-05-15',
      },
      phone: {
        type: 'string',
        example: '0987654321',
      },
      specializationId: {
        type: 'integer',
        example: 1,
      },
      licenseNumber: {
        type: 'string',
        example: 'LIC123456',
      },
      experienceYears: {
        type: 'integer',
        example: 10,
      },
      consultationFee: {
        type: 'number',
        format: 'float',
        example: 150.0,
      },
      bio: {
        type: 'string',
        example: 'Experienced cardiologist specializing in heart failure.',
      },
      languages: {
        type: 'array',
        items: {
          type: 'string',
        },
        example: ['English', 'Spanish'],
      },
    },
  },
  ForgotPasswordRequest: {
    type: 'object',
    required: ['email'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
        example: 'user@example.com',
      },
    },
  },
  ResetPasswordRequest: {
    type: 'object',
    required: ['token', 'newPassword', 'confirmPassword'],
    properties: {
      token: {
        type: 'string',
        example: 'c8e3cc00f0ad69fa89e81b6cd9ad30e9d6dca3bbd985a114421112d7c0ee6a22',
      },
      newPassword: {
        type: 'string',
        minLength: 8,
        example: 'NewPassword123!',
      },
      confirmPassword: {
        type: 'string',
        minLength: 8,
        example: 'NewPassword123!',
      },
    },
  },
};
