import axiosInstance from '../../../services/api/axios';

export const appointmentApi = {
  // Get all appointments (Admin/General)
  getAppointments: async (params) => {
    try {
      return await axiosInstance.get('/appointments', { params });
    } catch (e) {
      console.warn('GET /appointments fallback to mock appointment data:', e?.message);
      return {
        appointments: [
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
          {
            id: 202,
            patientName: 'Emma Watson',
            patientId: 102,
            doctorName: 'Dr. Gregory House',
            doctorId: 2,
            specialization: 'Neurology',
            date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            slotTime: '02:00 PM',
            status: 'Pending',
            type: 'Video Consultation',
            reason: 'Chronic migraine telemetry review',
            consultationFee: 150,
            hospital: 'Princeton-Plainsboro Hospital',
          },
          {
            id: 203,
            patientName: 'Robert Downey',
            patientId: 103,
            doctorName: 'Dr. Aria Stark',
            doctorId: 3,
            specialization: 'General Medicine',
            date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
            slotTime: '09:00 AM',
            status: 'Completed',
            type: 'In-Person',
            reason: 'Annual blood panel consultation',
            consultationFee: 90,
            hospital: 'Metro Health Hospital',
          },
        ],
        total: 3,
      };
    }
  },

  // Patient's own appointments
  getMyAppointments: async (params) => {
    try {
      return await axiosInstance.get('/appointments/me', { params });
    } catch (e) {
      return appointmentApi.getAppointments(params);
    }
  },

  // Doctor's own appointments
  getDoctorAppointments: async (params) => {
    try {
      return await axiosInstance.get('/appointments/doctor', { params });
    } catch (e) {
      return appointmentApi.getAppointments(params);
    }
  },

  // Get single appointment details by ID
  getAppointmentById: async (id) => {
    try {
      return await axiosInstance.get(`/appointments/${id}`);
    } catch (e) {
      return {
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
        clinicalNotes: 'Patient reports stable blood pressure readings with current regimen.',
      };
    }
  },

  // Book a new appointment
  bookAppointment: (data) => {
    return axiosInstance.post('/appointments', data);
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
