module.exports = {
  Vital: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      patientId: { type: 'integer', example: 1 },
      systolic: { type: 'integer', example: 120 },
      diastolic: { type: 'integer', example: 80 },
      heartRate: { type: 'integer', example: 72 },
      temperature: { type: 'number', format: 'float', example: 98.6 },
      bloodSugar: { type: 'integer', example: 95 },
      oxygenSaturation: { type: 'integer', example: 98 },
      weight: { type: 'number', format: 'float', example: 70.2 },
      recordedAt: { type: 'string', format: 'date-time', example: '2026-07-16T12:00:00Z' },
      notes: { type: 'string', example: 'Feeling fine.' },
      isAlertActive: { type: 'boolean', example: false },
      alertType: { type: 'string', nullable: true, example: null },
      createdAt: { type: 'string', format: 'date-time', example: '2026-07-16T12:00:00Z' },
      updatedAt: { type: 'string', format: 'date-time', example: '2026-07-16T12:00:00Z' }
    }
  },
  RecordVitalRequest: {
    type: 'object',
    required: ['recordedAt'],
    properties: {
      systolic: { type: 'integer', example: 120 },
      diastolic: { type: 'integer', example: 80 },
      heartRate: { type: 'integer', example: 72 },
      temperature: { type: 'number', format: 'float', example: 98.6 },
      bloodSugar: { type: 'integer', example: 95 },
      oxygenSaturation: { type: 'integer', example: 98 },
      weight: { type: 'number', format: 'float', example: 70.2 },
      recordedAt: { type: 'string', format: 'date-time', example: '2026-07-16T12:00:00Z' },
      notes: { type: 'string', example: 'Post lunch.' }
    }
  }
};
