module.exports = {
  Patient: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      firstName: { type: 'string', example: 'John' },
      lastName: { type: 'string', example: 'Doe' },
      dateOfBirth: { type: 'string', format: 'date', example: '1990-01-01' },
      gender: { type: 'string', enum: ['Male', 'Female', 'Other'], example: 'Male' },
      bloodType: { type: 'string', example: 'O+' },
      heightCm: { type: 'number', format: 'float', example: 175.5 },
      weightKg: { type: 'number', format: 'float', example: 70.2 },
      zipCode: { type: 'string', example: '12345' },
      emergencyContactName: { type: 'string', example: 'Sarah Doe' },
      emergencyContactPhone: { type: 'string', example: '1122334455' },
      emergencyContactRelation: { type: 'string', example: 'Spouse' },
      medicalConditions: { type: 'array', items: { type: 'string' }, example: ['Hypertension'] },
      allergies: { type: 'array', items: { type: 'string' }, example: ['Penicillin'] },
      smokingStatus: { type: 'string', enum: ['Non-smoker', 'Smoker', 'Former smoker'], example: 'Non-smoker' },
      alcoholConsumption: { type: 'string', enum: ['None', 'Social', 'Moderate', 'Heavy'], example: 'Social' },
      profileCompletionPct: { type: 'integer', example: 85 },
      createdAt: { type: 'string', format: 'date-time', example: '2026-07-15T18:00:00Z' },
      updatedAt: { type: 'string', format: 'date-time', example: '2026-07-16T12:00:00Z' }
    }
  },
  UpdatePatientProfileRequest: {
    type: 'object',
    properties: {
      firstName: { type: 'string', example: 'John' },
      lastName: { type: 'string', example: 'Doe' },
      phone: { type: 'string', example: '1234567890' },
      bloodType: { type: 'string', example: 'O+' },
      heightCm: { type: 'number', format: 'float', example: 176.0 },
      weightKg: { type: 'number', format: 'float', example: 71.0 },
      zipCode: { type: 'string', example: '12345' },
      emergencyContactName: { type: 'string', example: 'Sarah Doe' },
      emergencyContactPhone: { type: 'string', example: '1122334455' },
      emergencyContactRelation: { type: 'string', example: 'Spouse' },
      medicalConditions: { type: 'array', items: { type: 'string' }, example: ['Hypertension'] },
      allergies: { type: 'array', items: { type: 'string' }, example: ['Penicillin'] },
      smokingStatus: { type: 'string', enum: ['Non-smoker', 'Smoker', 'Former smoker'], example: 'Non-smoker' },
      alcoholConsumption: { type: 'string', enum: ['None', 'Social', 'Moderate', 'Heavy'], example: 'Social' }
    }
  }
};
