import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import PrescriptionForm from '../components/PrescriptionForm';
import { useCreatePrescription } from '../hooks/useCreatePrescription';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../services/api/axios';

export const CreatePrescriptionPage = () => {
  const navigate = useNavigate();
  const createMutation = useCreatePrescription();

  // Fetch patient list for selection
  const { data: patients = [] } = useQuery({
    queryKey: ['patients-list-prescription'],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get('/patients');
        return res.data?.data || res.data || [];
      } catch {
        return [];
      }
    },
  });

  const onSubmit = (formData) => {
    createMutation.mutate(formData, {
      onSuccess: (res) => {
        const newId = res?.id || res?.data?.id;
        if (newId) {
          navigate(`/prescriptions/${newId}`);
        } else {
          navigate('/prescriptions');
        }
      },
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans">
      <div className="flex items-center space-x-3">
        <Link
          to="/prescriptions"
          className="p-1.5 rounded-xl hover:bg-accent text-muted-foreground hover:text-foreground border border-border/60 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-foreground font-display flex items-center space-x-2">
            <Plus className="w-6 h-6 text-primary" />
            <span>Create Medical Prescription</span>
          </h1>
          <p className="text-xs text-muted-foreground">Issue a new pharmaceutical prescription order for a patient.</p>
        </div>
      </div>

      <PrescriptionForm
        onSubmit={onSubmit}
        isSubmitting={createMutation.isPending}
        patients={patients}
      />
    </div>
  );
};

export default CreatePrescriptionPage;
