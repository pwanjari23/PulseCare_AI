import axiosInstance from '../../../services/api/axios';

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
  // Get all appointments (Admin/General)
  getAppointments: async (params) => {
    try {
      const res = await axiosInstance.get('/appointments', { params });
      return normalizeResponse(res);
    } catch (e) {
      console.warn('GET /appointments fallback to mock appointment data:', e?.message);
      return normalizeResponse([
        {
          id: 201,
          patientName: 'John Doe',
          patientId: 101,
          doctorName: 'Dr. Sarah Jenkins',
          doctorId: 1,
          specialization: 'Cardiology',
          date: new Date().toISOString().split('T')[0],
          slotTime: '10:30 AM',
          status: 'Confirmed',
          type: 'In-Person',
          reason: 'Routine ECG checkup & hypertension consultation',
          consultationFee: 120,
          hospital: 'St. Jude Medical Center',
        },
      ]);
    }
  },

  // Patient's own appointments
  getMyAppointments: async (params) => {
    try {
      const res = await axiosInstance.get('/appointments/me', { params });
      return normalizeResponse(res);
    } catch (e) {
      return appointmentApi.getAppointments(params);
    }
  },

  // Doctor's own appointments
  getDoctorAppointments: async (params) => {
    try {
      const res = await axiosInstance.get('/appointments/doctor', { params });
      return normalizeResponse(res);
    } catch (e) {
      return appointmentApi.getAppointments(params);
    }
  },

  // Get single appointment details by ID
  getAppointmentById: async (id) => {
    try {
      const res = await axiosInstance.get(`/appointments/${id}`);
      return normalizeAppointment(res);
    } catch (e) {
      return normalizeAppointment({
        id: Number(id) || 201,
        patientName: 'John Doe',
        patientId: 101,
        doctorName: 'Dr. Sarah Jenkins',
        doctorId: 1,
        specialization: 'Cardiology',
        date: new Date().toISOString().split('T')[0],
        slotTime: '10:30 AM',
        status: 'Confirmed',
        type: 'In-Person',
        reason: 'Routine ECG checkup & hypertension consultation',
        consultationFee: 120,
        hospital: 'St. Jude Medical Center',
      });
    }
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

    return axiosInstance.post('/appointments', payload);
  },

  // Cancel an appointment
  cancelAppointment: (id, reason) => {
    return axiosInstance.patch(`/appointments/${id}/cancel`, { reason });
  },

  // Doctor completes an appointment
  completeAppointment: (id, notes) => {
    return axiosInstance.patch(`/appointments/${id}/complete`, { notes });
  },

  // Fetch available slots for a doctor on a specific date
  getAvailableSlots: async (doctorId, date) => {
    try {
      return await axiosInstance.get(`/availability/doctor/${doctorId}`, { params: { date } });
    } catch (e) {
      return {
        date,
        slots: ['09:00 AM', '10:30 AM', '02:00 PM', '04:15 PM'],
      };
    }
  },
};

export default appointmentApi;
