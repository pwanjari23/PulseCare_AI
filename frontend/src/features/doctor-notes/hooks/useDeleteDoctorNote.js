import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doctorNoteApi } from '../api/doctorNote.api';
import { toast } from 'react-hot-toast';

export const useDeleteDoctorNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => doctorNoteApi.deleteNote(id),
    onSuccess: () => {
      toast.success('Doctor note removed/archived');
      queryClient.invalidateQueries({ queryKey: ['doctor-notes'] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to remove note');
    },
  });
};

export default useDeleteDoctorNote;
