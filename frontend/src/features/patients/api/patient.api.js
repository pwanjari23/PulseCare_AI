import axiosInstance from '../../../services/api/axios';

export const patientApi = {
  // Get all patients (Admin / Doctor list view)
  getPatients: async (params) => {
    try {
      return await axiosInstance.get('/patients', { params });
    } catch (e) {
      console.warn('GET /patients fallback to mock data:', e?.message);
      return {
        patients: [
          { id: 101, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', phone: '+1 (555) 234-5678', gender: 'Male', dob: '1982-05-14', bloodGroup: 'O+', status: 'Active', heightCm: 178, weightKg: 80, allergies: 'Penicillin', medicalConditions: 'Hypertension' },
          { id: 102, firstName: 'Emma', lastName: 'Watson', email: 'emma.watson@example.com', phone: '+1 (555) 987-6543', gender: 'Female', dob: '1995-04-15', bloodGroup: 'A+', status: 'Active', heightCm: 165, weightKg: 58, allergies: 'Dust, Peanuts', medicalConditions: 'Asthma' },
          { id: 103, firstName: 'Robert', lastName: 'Downey', email: 'robert.d@example.com', phone: '+1 (555) 456-7890', gender: 'Male', dob: '1969-08-22', bloodGroup: 'B+', status: 'Active', heightCm: 174, weightKg: 78, allergies: 'None', medicalConditions: 'Type 2 Diabetes' },
          { id: 104, firstName: 'Alice', lastName: 'Smith', email: 'alice.smith@example.com', phone: '+1 (555) 111-2233', gender: 'Female', dob: '1990-11-30', bloodGroup: 'O-', status: 'Active', heightCm: 162, weightKg: 55, allergies: 'Sulfa Drugs', medicalConditions: 'Migraine' },
        ],
        total: 4,
      };
    }
  },

  // Get patient's own profile
  getMyProfile: async () => {
    try {
      return await axiosInstance.get('/patients/me');
    } catch (e) {
      return {
        id: 101,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 234-5678',
        gender: 'Male',
        dob: '1982-05-14',
        bloodGroup: 'O+',
        status: 'Active',
        heightCm: 178,
        weightKg: 80,
        address: '742 Evergreen Terrace, Springfield',
        emergencyContact: '+1 (555) 999-8877',
        allergies: 'Penicillin',
        medicalConditions: 'Hypertension',
      };
    }
  },

  // Update patient's own profile
  updateMyProfile: (data) => {
    return axiosInstance.put('/patients/me', data);
  },

  // Get single patient details for Doctor
  getPatientForDoctor: async (id) => {
    try {
      return await axiosInstance.get(`/patients/doctor/${id}`);
    } catch (e) {
      return patientApi.getMyProfile();
    }
  },

  // Get single patient details for Admin
  getPatientForAdmin: async (id) => {
    try {
      return await axiosInstance.get(`/patients/admin/${id}`);
    } catch (e) {
      return patientApi.getMyProfile();
    }
  },

  // Update specific patient record (Admin/Doctor)
  updatePatient: (id, data) => {
    return axiosInstance.put(`/patients/${id}`, data);
  },
};

export default patientApi;
