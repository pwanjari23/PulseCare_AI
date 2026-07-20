import { useMutation, useQueryClient } from '@tanstack/react-query';
import patientApi from '../api/patient.api';
import { QUERY_KEYS } from '../../../constants/queryKeys';
import { toast } from 'react-hot-toast';

export const useUpdatePatient = (id) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => {
      if (!id || id === 'me') {
        return patientApi.updateMyProfile(data);
      }
      return patientApi.updatePatient(id, data);
    },
    onSuccess: () => {
      toast.success('Patient profile updated successfully');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PATIENTS] });
    },
    onError: (err) => {
      toast.error(err?.message || 'Failed to update patient records');
    },
  });
};
