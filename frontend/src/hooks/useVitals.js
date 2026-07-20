import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import vitalApi from '../services/api/vital.api';
import { QUERY_KEYS } from '../constants/queryKeys';
import { useAuthStore } from '../stores/auth.store';

// Hook to fetch patient's own vitals history
export const useVitals = (params = {}) => {
  const { user } = useAuthStore();
  const role = user?.role?.toLowerCase() || 'patient';

  return useQuery({
    queryKey: [QUERY_KEYS.VITALS, role, params],
    queryFn: async () => {
      if (role === 'patient') {
        return await vitalApi.getMyVitals(params);
      }
      return await vitalApi.getVitals(params);
    },
    enabled: !!user,
  });
};

// Hook to fetch most recent vital reading
export const useLatestVital = () => {
  const { user } = useAuthStore();
  return useQuery({
    queryKey: [QUERY_KEYS.VITALS, 'latest'],
    queryFn: () => vitalApi.getLatestVital(),
    enabled: !!user,
  });
};

// Hook for Doctor or Admin to view vitals of a specific patient
export const usePatientVitals = (patientId, params = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.VITALS, 'patient', patientId, params],
    queryFn: () => vitalApi.getPatientVitals(patientId, params),
    enabled: !!patientId,
  });
};

// Mutation hook to record a new vital reading
export const useRecordVital = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => vitalApi.recordVital(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VITALS] });
    },
  });
};

// Mutation hook to update a vital record
export const useUpdateVital = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => vitalApi.updateVital(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VITALS] });
    },
  });
};

// Mutation hook to delete a vital record
export const useDeleteVital = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => vitalApi.deleteVital(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VITALS] });
    },
  });
};
