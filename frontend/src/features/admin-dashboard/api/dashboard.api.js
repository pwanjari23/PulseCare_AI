/**
 * PulseCare AI - Admin Dashboard API Integration
 */

import axiosInstance from '../../../services/api/axios';

export const dashboardApi = {
  /**
   * Fetch core Admin Dashboard aggregated DTO
   */
  getAdminDashboard: async () => {
    const res = await axiosInstance.get('/dashboard/admin');
    return res;
  },

  /**
   * Fetch admin statistics metrics
   */
  getStatistics: async () => {
    try {
      const res = await axiosInstance.get('/dashboard/statistics');
      return res;
    } catch (err) {
      // Fallback: Fetch via main admin dashboard endpoint
      return await dashboardApi.getAdminDashboard();
    }
  },

  /**
   * Fetch admin trend charts data
   */
  getCharts: async (params = {}) => {
    try {
      const res = await axiosInstance.get('/dashboard/charts', { params });
      return res;
    } catch (err) {
      return null;
    }
  },

  /**
   * Fetch recent platform activity log
   */
  getRecentActivity: async () => {
    try {
      const res = await axiosInstance.get('/dashboard/recent-activity');
      return Array.isArray(res) ? res : res?.activities || res?.activity || [];
    } catch (err) {
      return [];
    }
  },

  /**
   * Fetch system health & infrastructure status
   */
  getSystemHealth: async () => {
    try {
      const res = await axiosInstance.get('/dashboard/system-health');
      return res;
    } catch (err) {
      const adminData = await dashboardApi.getAdminDashboard();
      return adminData?.systemStats || null;
    }
  },

  /**
   * Fetch top doctors analytics
   */
  getTopDoctors: async () => {
    try {
      const res = await axiosInstance.get('/dashboard/top-doctors');
      return Array.isArray(res) ? res : res?.doctors || [];
    } catch (err) {
      try {
        const doctorsRes = await axiosInstance.get('/doctors');
        return Array.isArray(doctorsRes) ? doctorsRes.slice(0, 5) : doctorsRes?.doctors?.slice(0, 5) || [];
      } catch (innerErr) {
        return [];
      }
    }
  },

  /**
   * Fetch top patients analytics
   */
  getTopPatients: async () => {
    try {
      const res = await axiosInstance.get('/dashboard/top-patients');
      return Array.isArray(res) ? res : res?.patients || [];
    } catch (err) {
      try {
        const patientsRes = await axiosInstance.get('/patients');
        return Array.isArray(patientsRes) ? patientsRes.slice(0, 5) : patientsRes?.patients?.slice(0, 5) || [];
      } catch (innerErr) {
        return [];
      }
    }
  },
};

export default dashboardApi;
