import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import VitalForm from '../components/VitalForm';
import { useCreateVital } from '../hooks/useCreateVital';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../services/api/axios';

export const AddVitalRecordPage = () => {
  const navigate = useNavigate();
  const createMutation = useCreateVital();

  // Fetch list of patients for selection if doctor
  const { data: patients = [] } = useQuery({
    queryKey: ['patients-list-select'],
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
      onSuccess: () => {
        navigate('/vitals');
      },
    });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto font-sans">
      <div className="flex items-center space-x-3">
        <Link
          to="/vitals"
          className="p-1.5 rounded-xl hover:bg-accent text-muted-foreground hover:text-foreground border border-border/60 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-foreground font-display flex items-center space-x-2">
            <Plus className="w-6 h-6 text-primary" />
            <span>Record Vital Signs</span>
          </h1>
          <p className="text-xs text-muted-foreground">Log new physiological measurement values for a patient.</p>
        </div>
      </div>

      <VitalForm
        onSubmit={onSubmit}
        isSubmitting={createMutation.isPending}
        patients={patients}
      />
    </div>
  );
};

export default AddVitalRecordPage;
