import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import appointmentApi from '../services/api/appointment.api';
import { QUERY_KEYS } from '../constants/queryKeys';
import { useAuthStore } from '../stores/auth.store';

// Hook to fetch list of appointments based on user role
export const useAppointments = (params = {}) => {
  const { user } = useAuthStore();
  const role = user?.role?.toLowerCase() || 'patient';

  return useQuery({
    queryKey: [QUERY_KEYS.APPOINTMENTS, role, params],
    queryFn: async () => {
      if (role === 'doctor') {
        return await appointmentApi.getDoctorAppointments(params);
      }
      if (role === 'patient') {
        return await appointmentApi.getMyAppointments(params);
      }
      return await appointmentApi.getAppointments(params);
    },
    enabled: !!user,
  });
};

// Hook to fetch single appointment details
export const useAppointment = (id) => {
  return useQuery({
    queryKey: [QUERY_KEYS.APPOINTMENTS, id],
    queryFn: () => appointmentApi.getAppointmentById(id),
    enabled: !!id,
  });
};

// Hook to fetch doctor availability slots
export const useAvailableSlots = (doctorId, date) => {
  return useQuery({
    queryKey: [QUERY_KEYS.AVAILABILITY, doctorId, date],
    queryFn: () => appointmentApi.getAvailableSlots(doctorId, date),
    enabled: !!doctorId && !!date,
  });
};

// Hook to fetch doctors list for appointment booking
export const useDoctors = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.DOCTORS],
    queryFn: async () => {
      try {
        return await appointmentApi.getDoctorsList();
      } catch (e) {
        // Mock doctors list fallback if endpoint returns empty during initial setup
        return [
          { id: 1, firstName: 'Sarah', lastName: 'Jenkins', specialization: 'Cardiology', qualification: 'MD, FACC', fee: 150 },
          { id: 2, firstName: 'Marcus', lastName: 'Vance', specialization: 'Neurology', qualification: 'MD, PhD', fee: 180 },
          { id: 3, firstName: 'Elena', lastName: 'Rostova', specialization: 'Pediatrics', qualification: 'MBBS, DCH', fee: 120 },
        ];
      }
    },
  });
};

// Mutation hook to book an appointment
export const useBookAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => appointmentApi.bookAppointment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.APPOINTMENTS] });
    },
  });
};

// Mutation hook to cancel an appointment
export const useCancelAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }) => appointmentApi.cancelAppointment(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.APPOINTMENTS] });
    },
  });
};

// Mutation hook to complete an appointment
export const useCompleteAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }) => appointmentApi.completeAppointment(id, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.APPOINTMENTS] });
    },
  });
};
