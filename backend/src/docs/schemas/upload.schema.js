module.exports = {
  UploadedFile: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      uuid: { type: 'string', format: 'uuid', example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d' },
      filename: { type: 'string', example: 'profile_image_1784218424424.jpg' },
      originalname: { type: 'string', example: 'me.jpg' },
      mimetype: { type: 'string', example: 'image/jpeg' },
      size: { type: 'integer', example: 102400 },
      filepath: { type: 'string', example: '/uploads/profile-images/profile_image_1784218424424.jpg' },
      category: { type: 'string', enum: ['PROFILE_IMAGE', 'DOCTOR_DOCUMENT', 'PRESCRIPTION', 'MEDICAL_REPORT', 'LAB_REPORT'], example: 'PROFILE_IMAGE' },
      userId: { type: 'integer', example: 1 },
      createdAt: { type: 'string', format: 'date-time', example: '2026-07-16T12:00:00Z' },
      updatedAt: { type: 'string', format: 'date-time', example: '2026-07-16T12:00:00Z' }
    }
  }
};
