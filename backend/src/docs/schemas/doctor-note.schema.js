module.exports = {
  DoctorNote: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      patientId: { type: 'integer', example: 1 },
      doctorId: { type: 'integer', example: 2 },
      appointmentId: { type: 'integer', nullable: true, example: 1 },
      content: { type: 'string', example: 'Patient displays mild symptoms of stress. Advised lifestyle changes.' },
      isArchived: { type: 'boolean', example: false },
      createdAt: { type: 'string', format: 'date-time', example: '2026-07-16T12:00:00Z' },
      updatedAt: { type: 'string', format: 'date-time', example: '2026-07-16T12:00:00Z' }
    }
  },
  CreateDoctorNoteRequest: {
    type: 'object',
    required: ['patientId', 'content'],
    properties: {
      patientId: { type: 'integer', example: 1 },
      appointmentId: { type: 'integer', example: 1 },
      content: { type: 'string', example: 'Patient displays mild symptoms of stress. Advised lifestyle changes.' }
    }
  },
  UpdateDoctorNoteRequest: {
    type: 'object',
    required: ['content'],
    properties: {
      content: { type: 'string', example: 'Patient displays stress and fatigue. Recommend follows ups.' }
    }
  }
};
