/**
 * PulseCare AI - Prescription API Client
 */

import axiosInstance from '../../../services/api/axios';

export const prescriptionApi = {
  /**
   * Doctor retrieves prescriptions issued by them
   */
  getDoctorPrescriptions: async (params) => {
    const res = await axiosInstance.get('/prescriptions/me', { params });
    return res.data?.data || res.data || [];
  },

  /**
   * Patient retrieves their own prescriptions
   */
  getPatientPrescriptions: async (params) => {
    const res = await axiosInstance.get('/prescriptions/patient', { params });
    return res.data?.data || res.data || [];
  },

  /**
   * Fetch specific patient's prescriptions (Doctor/Admin)
   */
  getPatientPrescriptionsByAdminDoctor: async (patientId, params) => {
    const res = await axiosInstance.get(`/prescriptions/patient/${patientId}`, { params });
    return res.data?.data || res.data || [];
  },

  /**
   * Fetch single prescription by ID
   */
  getPrescriptionById: async (id) => {
    const res = await axiosInstance.get(`/prescriptions/${id}`);
    return res.data?.data || res.data;
  },

  /**
   * Doctor creates a new prescription
   */
  createPrescription: async (data) => {
    const res = await axiosInstance.post('/prescriptions', data);
    return res.data?.data || res.data;
  },

  /**
   * Doctor updates an existing prescription
   */
  updatePrescription: async (id, data) => {
    const res = await axiosInstance.put(`/prescriptions/${id}`, data);
    return res.data?.data || res.data;
  },

  /**
   * Delete prescription (Doctor / Admin)
   */
  deletePrescription: async (id) => {
    const res = await axiosInstance.delete(`/prescriptions/${id}`);
    return res.data;
  },
};

export default prescriptionApi;
