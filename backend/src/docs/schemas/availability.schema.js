module.exports = {
  Availability: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      doctorId: { type: 'integer', example: 2 },
      dayOfWeek: { type: 'string', enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], example: 'Monday' },
      startTime: { type: 'string', pattern: '^([01]\\d|2[0-3]):?([0-5]\\d)$', example: '09:00' },
      endTime: { type: 'string', pattern: '^([01]\\d|2[0-3]):?([0-5]\\d)$', example: '17:00' },
      isAvailable: { type: 'boolean', example: true },
      createdAt: { type: 'string', format: 'date-time', example: '2026-07-15T18:00:00Z' },
      updatedAt: { type: 'string', format: 'date-time', example: '2026-07-16T12:00:00Z' }
    }
  },
  CreateAvailabilityRequest: {
    type: 'object',
    required: ['dayOfWeek', 'startTime', 'endTime'],
    properties: {
      dayOfWeek: { type: 'string', enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], example: 'Monday' },
      startTime: { type: 'string', pattern: '^([01]\\d|2[0-3]):?([0-5]\\d)$', example: '09:00' },
      endTime: { type: 'string', pattern: '^([01]\\d|2[0-3]):?([0-5]\\d)$', example: '17:00' }
    }
  }
};
