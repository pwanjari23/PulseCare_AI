/**
 * PulseCare AI - Health Summary API Integration
 */

import axiosInstance from '../../../services/api/axios';

export const healthSummaryApi = {
  /**
   * Fetch current user's (patient's) latest AI Health Summary
   */
  getMySummary: async () => {
    try {
      const res = await axiosInstance.get('/health-summary/me');
      return res;
    } catch (err) {
      if (err.status === 404 || err.response?.status === 404) {
        const fallbackRes = await axiosInstance.get('/health-summary');
        return fallbackRes;
      }
      throw err;
    }
  },

  /**
   * Fetch specific patient AI Health Summary (Doctor / Admin)
   */
  getPatientSummary: async (patientId) => {
    try {
      const res = await axiosInstance.get(`/health-summary/patient/${patientId}`);
      return res;
    } catch (err) {
      if (err.status === 404 || err.response?.status === 404) {
        const fallbackRes = await axiosInstance.get(`/health-summary/${patientId}`);
        return fallbackRes;
      }
      throw err;
    }
  },

  /**
   * Trigger AI generation of a new health summary for a patient
   */
  generateSummary: async ({ patientId, notes = '' } = {}) => {
    try {
      const payload = patientId ? { patientId, notes } : { notes };
      const res = await axiosInstance.post('/health-summary/generate', payload);
      return res;
    } catch (err) {
      // Fallback: If generate endpoint is not present, fetch fresh summary
      if (patientId) {
        return await healthSummaryApi.getPatientSummary(patientId);
      }
      return await healthSummaryApi.getMySummary();
    }
  },

  /**
   * Fetch AI Health Summary history logs
   */
  getSummaryHistory: async (params = {}) => {
    try {
      const res = await axiosInstance.get('/health-summary/history', { params });
      return Array.isArray(res) ? res : res?.items || res?.history || [];
    } catch (err) {
      // Fallback: Generate mock/client history item from latest summary if endpoint not active
      try {
        const latest = await healthSummaryApi.getMySummary();
        return latest ? [latest] : [];
      } catch (innerErr) {
        return [];
      }
    }
  },

  /**
   * Fetch latest summary
   */
  getLatestSummary: async (patientId) => {
    if (patientId) {
      return await healthSummaryApi.getPatientSummary(patientId);
    }
    return await healthSummaryApi.getMySummary();
  },
};

export default healthSummaryApi;
