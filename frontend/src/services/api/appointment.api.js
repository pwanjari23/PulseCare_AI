import axiosInstance from './axios';
import { API_ENDPOINTS } from '../../constants/api';

const normalizeAppointment = (app) => {
  if (!app) return null;
  const rawDate = app.scheduledAt || app.appointmentAt || app.date || new Date().toISOString();
  const dateObj = new Date(rawDate);
  const validDate = isNaN(dateObj.getTime()) ? new Date() : dateObj;

  const dateStr = validDate.toISOString().split('T')[0];
  const timeStr = validDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const doctorObj = app.doctor || {};
  const patientObj = app.patient || {};

  const doctorName = app.doctorName || (doctorObj.firstName ? `Dr. ${doctorObj.firstName} ${doctorObj.lastName || ''}` : 'Dr. Specialist');
  const patientName = app.patientName || (patientObj.firstName ? `${patientObj.firstName} ${patientObj.lastName || ''}` : 'Patient');

  return {
    ...app,
    id: app.id,
    date: app.date || dateStr,
    slotTime: app.slotTime || timeStr,
    scheduledAt: rawDate,
    doctorId: app.doctorId || doctorObj.id,
    patientId: app.patientId || patientObj.id,
    doctorName,
    patientName,
    specialization: app.specialization || doctorObj.specialization || 'General Practice',
    status: app.status || 'Scheduled',
  };
};

const normalizeResponse = (res) => {
  if (!res) return [];
  if (Array.isArray(res)) return res.map(normalizeAppointment);
  if (Array.isArray(res.appointments)) {
    return {
      ...res,
      appointments: res.appointments.map(normalizeAppointment),
    };
  }
  return normalizeAppointment(res);
};

export const appointmentApi = {
  // Patient retrieves their own bookings
  getMyAppointments: async (params) => {
    const res = await axiosInstance.get('/appointments/me', { params });
    return normalizeResponse(res);
  },

  // Doctor retrieves their own calendar list
  getDoctorAppointments: async (params) => {
    const res = await axiosInstance.get('/appointments/doctor', { params });
    return normalizeResponse(res);
  },

  // Admin / General list
  getAppointments: async (params) => {
    const res = await axiosInstance.get(API_ENDPOINTS.APPOINTMENTS.BASE, { params });
    return normalizeResponse(res);
  },

  // Get single appointment details
  getAppointmentById: async (id) => {
    const res = await axiosInstance.get(`${API_ENDPOINTS.APPOINTMENTS.BASE}/${id}`);
    return normalizeAppointment(res);
  },

  // Book a new appointment
  bookAppointment: (data) => {
    let scheduledAt = data.scheduledAt;
    if (!scheduledAt && (data.date || data.scheduledDate)) {
      const dateStr = data.date || data.scheduledDate;
      const slotTimeStr = data.slotTime || data.timeSlot || '10:00 AM';
      const match = slotTimeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
      let hours = 10;
      let minutes = 0;
      if (match) {
        hours = parseInt(match[1], 10);
        minutes = parseInt(match[2], 10);
        const ampm = match[3];
        if (ampm) {
          if (ampm.toUpperCase() === 'PM' && hours < 12) hours += 12;
          if (ampm.toUpperCase() === 'AM' && hours === 12) hours = 0;
        }
      }
      const hh = String(hours).padStart(2, '0');
      const mm = String(minutes).padStart(2, '0');
      const dateObj = new Date(`${dateStr}T${hh}:${mm}:00`);
      scheduledAt = isNaN(dateObj.getTime()) ? new Date(Date.now() + 86400000).toISOString() : dateObj.toISOString();
    }

    const payload = {
      doctorId: Number(data.doctorId),
      scheduledAt: scheduledAt || new Date(Date.now() + 86400000).toISOString(),
      reason: data.reason || data.symptoms || 'General Medical Consultation',
      durationMinutes: Number(data.durationMinutes || 30),
    };

    return axiosInstance.post(API_ENDPOINTS.APPOINTMENTS.BASE, payload);
  },

  // Cancel an appointment
  cancelAppointment: (id, reason) => {
    return axiosInstance.patch(`${API_ENDPOINTS.APPOINTMENTS.BASE}/${id}/cancel`, { reason });
  },

  // Doctor completes an appointment
  completeAppointment: (id, notes) => {
    return axiosInstance.patch(`${API_ENDPOINTS.APPOINTMENTS.BASE}/${id}/complete`, { notes });
  },

  // Fetch doctor availability slots
  getAvailableSlots: (doctorId, date) => {
    return axiosInstance.get(`/availability/doctor/${doctorId}`, { params: { date } });
  },

  // Helper to fetch doctor directory for booking wizard
  getDoctorsList: () => {
    return axiosInstance.get('/doctors');
  },
};

export default appointmentApi;
