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
    const payload = {
      heartRate: Number(data.heartRate),
      spo2: Number(data.oxygenLevel),
      temperature: Number(data.temperature),
      systolicBp: Number(data.systolicBp),
      diastolicBp: Number(data.diastolicBp),
      ...(data.bloodGlucoseMgdl ? { glucose: Number(data.bloodGlucoseMgdl) } : {}),
      ...(data.weight ? { weightKg: Number(data.weight) } : {}),
      ...(data.height ? { heightCm: Number(data.height) } : {}),
      ...(data.patientId ? { patientId: Number(data.patientId) } : {}),
      ...(data.notes ? { notes: data.notes } : {}),
      ...(data.painLevel !== undefined && data.painLevel !== null ? { painLevel: Number(data.painLevel) } : {}),
      ...(data.recordedAt ? { recordedAt: new Date(data.recordedAt).toISOString() } : {}),
    };
    const res = await axiosInstance.post('/vitals', payload);
    return res.data?.data || res.data;
  },

  /**
   * Update an existing vital record
   */
  updateVital: async (id, data) => {
    const payload = {
      heartRate: Number(data.heartRate),
      spo2: Number(data.oxygenLevel),
      temperature: Number(data.temperature),
      systolicBp: Number(data.systolicBp),
      diastolicBp: Number(data.diastolicBp),
      ...(data.bloodGlucoseMgdl ? { glucose: Number(data.bloodGlucoseMgdl) } : {}),
      ...(data.weight ? { weightKg: Number(data.weight) } : {}),
      ...(data.height ? { heightCm: Number(data.height) } : {}),
      ...(data.patientId ? { patientId: Number(data.patientId) } : {}),
      ...(data.notes ? { notes: data.notes } : {}),
      ...(data.painLevel !== undefined && data.painLevel !== null ? { painLevel: Number(data.painLevel) } : {}),
      ...(data.recordedAt ? { recordedAt: new Date(data.recordedAt).toISOString() } : {}),
    };
    const res = await axiosInstance.put(`/vitals/${id}`, payload);
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
