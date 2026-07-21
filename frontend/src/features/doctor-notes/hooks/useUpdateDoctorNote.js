import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doctorNoteApi } from '../api/doctorNote.api';
import { toast } from 'react-hot-toast';

export const useUpdateDoctorNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => doctorNoteApi.updateNote(id, data),
    onSuccess: () => {
      toast.success('Consultation note updated');
      queryClient.invalidateQueries({ queryKey: ['doctor-notes'] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to update note');
    },
  });
};

export default useUpdateDoctorNote;
