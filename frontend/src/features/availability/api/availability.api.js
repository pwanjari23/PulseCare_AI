import axiosInstance from '../../../services/api/axios';

const BASE = '/availability';

const availabilityApi = {
  /**
   * GET /availability/me
   * Doctor retrieves their own schedule blocks.
   */
  getMyAvailability: () => axiosInstance.get(`${BASE}/me`),

  /**
   * GET /availability/doctor/:doctorId
   * Public lookup – patient/admin views a doctor's schedule.
   */
  getDoctorAvailability: (doctorId) => axiosInstance.get(`${BASE}/doctor/${doctorId}`),

  /**
   * POST /availability
   * Doctor creates a new schedule block.
   * @param {{ dayOfWeek: string, startTime: string, endTime: string }} data
   */
  createAvailability: (data) => axiosInstance.post(BASE, data),

  /**
   * PUT /availability/:id
   * Doctor updates an existing schedule block.
   * @param {number|string} id
   * @param {{ dayOfWeek: string, startTime: string, endTime: string }} data
   */
  updateAvailability: (id, data) => axiosInstance.put(`${BASE}/${id}`, data),

  /**
   * PATCH /availability/:id/disable
   * Doctor toggles a block to isAvailable=false.
   */
  disableAvailability: (id) => axiosInstance.patch(`${BASE}/${id}/disable`),

  /**
   * DELETE /availability/:id
   * Doctor soft-deletes a schedule block.
   */
  deleteAvailability: (id) => axiosInstance.delete(`${BASE}/${id}`),
};

export default availabilityApi;
