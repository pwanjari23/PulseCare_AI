import axiosInstance from './axios';

export const doctorNoteApi = {
  getNotesByAppointment: (appointmentId) => {
    return axiosInstance.get(`/doctor-notes/appointment/${appointmentId}`);
  },
  
  createNote: (data) => {
    return axiosInstance.post('/doctor-notes', data);
  },

  updateNote: (id, data) => {
    return axiosInstance.put(`/doctor-notes/${id}`, data);
  }
};

export default doctorNoteApi;
