module.exports = {
  PrescriptionItem: {
    type: 'object',
    required: ['name', 'dosage', 'frequency', 'durationDays'],
    properties: {
      name: { type: 'string', example: 'Amoxicillin' },
      dosage: { type: 'string', example: '500mg' },
      frequency: { type: 'string', example: 'Three times daily' },
      durationDays: { type: 'integer', example: 7 },
      instructions: { type: 'string', example: 'Take after meals' }
    }
  },
  Prescription: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      patientId: { type: 'integer', example: 1 },
      doctorId: { type: 'integer', example: 2 },
      appointmentId: { type: 'integer', nullable: true, example: 1 },
      diagnosis: { type: 'string', example: 'Bacterial Infection' },
      notes: { type: 'string', example: 'Drink plenty of water.' },
      issuedAt: { type: 'string', format: 'date', example: '2026-07-16' },
      items: { type: 'array', items: { $ref: '#/components/schemas/PrescriptionItem' } },
      createdAt: { type: 'string', format: 'date-time', example: '2026-07-16T12:00:00Z' },
      updatedAt: { type: 'string', format: 'date-time', example: '2026-07-16T12:00:00Z' }
    }
  },
  CreatePrescriptionRequest: {
    type: 'object',
    required: ['patientId', 'diagnosis', 'items'],
    properties: {
      patientId: { type: 'integer', example: 1 },
      appointmentId: { type: 'integer', example: 1 },
      diagnosis: { type: 'string', example: 'Bacterial Infection' },
      notes: { type: 'string', example: 'Drink plenty of water.' },
      items: { type: 'array', items: { $ref: '#/components/schemas/PrescriptionItem' } }
    }
  },
  UpdatePrescriptionRequest: {
    type: 'object',
    required: ['items'],
    properties: {
      diagnosis: { type: 'string', example: 'Acute Bacterial Infection' },
      notes: { type: 'string', example: 'Rest for 3 days.' },
      items: { type: 'array', items: { $ref: '#/components/schemas/PrescriptionItem' } }
    }
  }
};
