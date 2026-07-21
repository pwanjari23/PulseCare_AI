import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doctorNoteApi } from '../api/doctorNote.api';
import { toast } from 'react-hot-toast';

export const useCreateDoctorNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => doctorNoteApi.createNote(data),
    onSuccess: () => {
      toast.success('Doctor consultation note created successfully');
      queryClient.invalidateQueries({ queryKey: ['doctor-notes'] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to create doctor note');
    },
  });
};

export default useCreateDoctorNote;
