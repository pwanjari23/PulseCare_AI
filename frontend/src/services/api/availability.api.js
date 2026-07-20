import axiosInstance from './axios';

export const availabilityApi = {
  getAvailability: (doctorId) => {
    return axiosInstance.get(`/availability/${doctorId}`);
  },
  
  saveAvailability: (data) => {
    return axiosInstance.post('/availability', data);
  },

  deleteAvailability: (id) => {
    return axiosInstance.delete(`/availability/${id}`);
  }
};

export default availabilityApi;
