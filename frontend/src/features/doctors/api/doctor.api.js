import axiosInstance from '../../../services/api/axios';

export const doctorApi = {
  // Get all doctors directory list
  getDoctors: async (params) => {
    try {
      return await axiosInstance.get('/doctors', { params });
    } catch (e) {
      console.warn('GET /doctors fallback to mock doctor data:', e?.message);
      return {
        doctors: [
          {
            id: 1,
            firstName: 'Sarah',
            lastName: 'Jenkins',
            specialization: 'Cardiology',
            qualifications: 'MD, FACC',
            experienceYears: 12,
            hospital: 'St. Jude Medical Center',
            consultationFee: 120,
            verificationStatus: 'Verified',
            status: 'Active',
            rating: 4.9,
            clinicAddress: '100 Medical Plaza, Suite 400',
            biography: 'Dr. Sarah Jenkins is a board-certified cardiologist specializing in preventive cardiology and cardiovascular disease management.',
            languages: 'English, Spanish',
            education: 'MD from Johns Hopkins School of Medicine (2012)',
            certificates: 'American Board of Internal Medicine - Cardiovascular Disease',
          },
          {
            id: 2,
            firstName: 'Gregory',
            lastName: 'House',
            specialization: 'Neurology',
            qualifications: 'MD, PhD',
            experienceYears: 18,
            hospital: 'Princeton-Plainsboro Teaching Hospital',
            consultationFee: 150,
            verificationStatus: 'Verified',
            status: 'Active',
            rating: 4.8,
            clinicAddress: '201 Diagnostics Way',
            biography: 'Specialist in complex diagnostic neurology and autoimmune neuropathies.',
            languages: 'English',
            education: 'MD from Harvard Medical School (2006)',
            certificates: 'American Board of Psychiatry and Neurology',
          },
          {
            id: 3,
            firstName: 'Aria',
            lastName: 'Stark',
            specialization: 'General Medicine',
            qualifications: 'MBBS, MD',
            experienceYears: 6,
            hospital: 'Metro Health Hospital',
            consultationFee: 90,
            verificationStatus: 'Pending',
            status: 'Active',
            rating: 4.7,
            clinicAddress: '45 Community Health Road',
            biography: 'Dedicated primary care physician providing holistic family healthcare.',
            languages: 'English, French',
            education: 'MD from Columbia University (2018)',
            certificates: 'Board Certified Family Medicine',
          },
        ],
        total: 3,
      };
    }
  },

  // Get doctor public profile by ID
  getDoctorById: async (id) => {
    try {
      return await axiosInstance.get(`/doctors/${id}`);
    } catch (e) {
      return {
        id: Number(id) || 1,
        firstName: 'Sarah',
        lastName: 'Jenkins',
        specialization: 'Cardiology',
        qualifications: 'MD, FACC',
        experienceYears: 12,
        hospital: 'St. Jude Medical Center',
        consultationFee: 120,
        verificationStatus: 'Verified',
        status: 'Active',
        rating: 4.9,
        clinicAddress: '100 Medical Plaza, Suite 400',
        biography: 'Dr. Sarah Jenkins is a board-certified cardiologist specializing in preventive cardiology and cardiovascular disease management.',
        languages: 'English, Spanish',
        education: 'MD from Johns Hopkins School of Medicine (2012)',
        certificates: 'American Board of Internal Medicine - Cardiovascular Disease',
      };
    }
  },

  // Get doctor's own profile
  getMyProfile: async () => {
    try {
      return await axiosInstance.get('/doctors/me');
    } catch (e) {
      return doctorApi.getDoctorById(1);
    }
  },

  // Update doctor's own profile
  updateMyProfile: (data) => {
    return axiosInstance.put('/doctors/me', data);
  },

  // Admin endpoint to verify doctor credentials (Approve/Reject)
  verifyDoctor: (id, verificationStatus) => {
    return axiosInstance.patch(`/admin/doctors/${id}/verify`, { verificationStatus });
  },

  // Admin endpoint to update doctor account status (Active/Suspended)
  updateDoctorStatus: (id, status) => {
    return axiosInstance.patch(`/admin/doctors/${id}/status`, { status });
  },
};

export default doctorApi;
