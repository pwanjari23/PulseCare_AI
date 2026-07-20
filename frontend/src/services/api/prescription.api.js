import axiosInstance from './axios';

export const prescriptionApi = {
  getPrescriptions: (params) => {
    return axiosInstance.get('/prescriptions', { params });
  },
  
  getPrescriptionById: (id) => {
    return axiosInstance.get(`/prescriptions/${id}`);
  },

  createPrescription: (data) => {
    return axiosInstance.post('/prescriptions', data);
  }
};

export default prescriptionApi;
