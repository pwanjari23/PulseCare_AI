/**
 * PulseCare AI - Vital Records API Integration
 */

import axiosInstance from '../../../services/api/axios';

export const vitalApi = {
  /**
   * Fetch logged vitals for the currently logged-in patient
   */
  getMyVitals: async (params) => {
    const res = await axiosInstance.get('/vitals/me', { params });
    return res.data?.data || res.data || [];
  },

  /**
   * Fetch the most recently logged vital reading for current user
   */
  getLatestVital: async () => {
    const res = await axiosInstance.get('/vitals/latest');
    return res.data?.data || res.data || null;
  },

  /**
   * Fetch vitals for a specific patient ID (Doctor / Admin)
   */
  getPatientVitals: async (patientId, params) => {
    const res = await axiosInstance.get(`/vitals/patient/${patientId}`, { params });
    return res.data?.data || res.data || [];
  },

  /**
   * Fetch single vital record by ID
   */
  getVitalById: async (id) => {
    const res = await axiosInstance.get(`/vitals/${id}`);
    return res.data?.data || res.data;
  },

  /**
   * Record a new vital sign entry
   */
  recordVital: async (data) => {
    const res = await axiosInstance.post('/vitals', data);
    return res.data?.data || res.data;
  },

  /**
   * Update an existing vital record
   */
  updateVital: async (id, data) => {
    const res = await axiosInstance.put(`/vitals/${id}`, data);
    return res.data?.data || res.data;
  },

  /**
   * Delete a vital record by ID
   */
  deleteVital: async (id) => {
    const res = await axiosInstance.delete(`/vitals/${id}`);
    return res.data;
  },
};

export default vitalApi;
