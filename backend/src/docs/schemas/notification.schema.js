module.exports = {
  Notification: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      userId: { type: 'integer', example: 1 },
      title: { type: 'string', example: 'New Appointment Booked' },
      message: { type: 'string', example: 'Your appointment is booked for 2026-08-20.' },
      type: { type: 'string', example: 'INFO' },
      isRead: { type: 'boolean', example: false },
      payload: { type: 'object', example: { appointmentId: 1 } },
      createdAt: { type: 'string', format: 'date-time', example: '2026-07-16T12:00:00Z' },
      updatedAt: { type: 'string', format: 'date-time', example: '2026-07-16T12:00:00Z' }
    }
  }
};
