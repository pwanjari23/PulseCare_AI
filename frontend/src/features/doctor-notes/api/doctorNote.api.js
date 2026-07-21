/**
 * PulseCare AI - Doctor Notes API Integration
 */

import axiosInstance from '../../../services/api/axios';

export const doctorNoteApi = {
  /**
   * Doctor retrieves their own created notes
   */
  getDoctorNotes: async (params) => {
    const res = await axiosInstance.get('/doctor-notes/me', { params });
    return res.data?.data || res.data || [];
  },

  /**
   * Patient retrieves notes (or filtered patient notes)
   */
  getPatientNotes: async (params) => {
    try {
      const res = await axiosInstance.get('/doctor-notes/me', { params });
      return res.data?.data || res.data || [];
    } catch {
      return [];
    }
  },

  /**
   * Admin retrieves notes for a specific patient
   */
  getPatientNotesForAdmin: async (patientId, params) => {
    const res = await axiosInstance.get(`/doctor-notes/admin/patient/${patientId}`, { params });
    return res.data?.data || res.data || [];
  },

  /**
   * Fetch single note by ID
   */
  getNoteById: async (id) => {
    const res = await axiosInstance.get(`/doctor-notes/${id}`);
    return res.data?.data || res.data;
  },

  /**
   * Doctor creates a new consultation note
   */
  createNote: async (data) => {
    const res = await axiosInstance.post('/doctor-notes', data);
    return res.data?.data || res.data;
  },

  /**
   * Doctor updates an existing consultation note
   */
  updateNote: async (id, data) => {
    const res = await axiosInstance.put(`/doctor-notes/${id}`, data);
    return res.data?.data || res.data;
  },

  /**
   * Doctor archives a note
   */
  archiveNote: async (id) => {
    const res = await axiosInstance.patch(`/doctor-notes/${id}/archive`);
    return res.data;
  },

  /**
   * Delete note
   */
  deleteNote: async (id) => {
    try {
      const res = await axiosInstance.delete(`/doctor-notes/${id}`);
      return res.data;
    } catch {
      // Archive fallback if DELETE endpoint is disabled in backend
      return doctorNoteApi.archiveNote(id);
    }
  },
};

export default doctorNoteApi;
