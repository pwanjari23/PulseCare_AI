module.exports = {
  Doctor: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      userId: { type: 'integer', example: 1 },
      firstName: { type: 'string', example: 'Jane' },
      lastName: { type: 'string', example: 'Smith' },
      specializationId: { type: 'integer', example: 1 },
      licenseNumber: { type: 'string', example: 'LIC123456' },
      experienceYears: { type: 'integer', example: 10 },
      consultationFee: { type: 'number', format: 'float', example: 150.0 },
      bio: { type: 'string', example: 'Experienced cardiologist.' },
      rating: { type: 'number', format: 'float', example: 4.8 },
      languages: { type: 'array', items: { type: 'string' }, example: ['English', 'Spanish'] },
      status: { type: 'string', enum: ['Pending', 'Approved', 'Rejected'], example: 'Approved' },
      isAvailable: { type: 'boolean', example: true },
      createdAt: { type: 'string', format: 'date-time', example: '2026-07-15T18:00:00Z' },
      updatedAt: { type: 'string', format: 'date-time', example: '2026-07-16T12:00:00Z' }
    }
  },
  UpdateDoctorProfileRequest: {
    type: 'object',
    properties: {
      firstName: { type: 'string', example: 'Jane' },
      lastName: { type: 'string', example: 'Smith' },
      phone: { type: 'string', example: '0987654321' },
      licenseNumber: { type: 'string', example: 'LIC123456' },
      experienceYears: { type: 'integer', example: 11 },
      consultationFee: { type: 'number', format: 'float', example: 160.0 },
      bio: { type: 'string', example: 'Senior cardiologist.' },
      languages: { type: 'array', items: { type: 'string' }, example: ['English', 'Spanish', 'French'] }
    }
  }
};
