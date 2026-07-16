module.exports = {
  Appointment: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      patientId: { type: 'integer', example: 1 },
      doctorId: { type: 'integer', example: 2 },
      scheduledAt: { type: 'string', format: 'date-time', example: '2026-08-20T10:00:00Z' },
      durationMinutes: { type: 'integer', example: 30 },
      reason: { type: 'string', example: 'Routine Checkup' },
      status: { type: 'string', enum: ['Booked', 'Confirmed', 'Cancelled', 'Completed'], example: 'Booked' },
      cancellationReason: { type: 'string', nullable: true, example: null },
      createdAt: { type: 'string', format: 'date-time', example: '2026-07-15T18:00:00Z' },
      updatedAt: { type: 'string', format: 'date-time', example: '2026-07-16T12:00:00Z' }
    }
  },
  BookAppointmentRequest: {
    type: 'object',
    required: ['doctorId', 'scheduledAt', 'durationMinutes', 'reason'],
    properties: {
      doctorId: { type: 'integer', example: 2 },
      scheduledAt: { type: 'string', format: 'date-time', example: '2026-08-20T10:00:00Z' },
      durationMinutes: { type: 'integer', example: 30 },
      reason: { type: 'string', example: 'Routine Checkup' }
    }
  },
  CompleteAppointmentRequest: {
    type: 'object',
    properties: {
      notes: { type: 'string', example: 'Patient is healthy. Advised regular exercise.' }
    }
  }
};
