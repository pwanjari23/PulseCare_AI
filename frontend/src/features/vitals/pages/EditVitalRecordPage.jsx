import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Pencil } from 'lucide-react';
import VitalForm from '../components/VitalForm';
import VitalSkeleton from '../components/VitalSkeleton';
import { useVital } from '../hooks/useVital';
import { useUpdateVital } from '../hooks/useUpdateVital';

export const EditVitalRecordPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: record, isLoading, error } = useVital(id);
  const updateMutation = useUpdateVital();

  const onSubmit = (formData) => {
    updateMutation.mutate(
      { id, data: formData },
      {
        onSuccess: () => {
          navigate(`/vitals/${id}`);
        },
      }
    );
  };

  if (isLoading) return <VitalSkeleton count={2} />;

  if (error || !record) {
    return (
      <div className="text-center py-12 bg-card border border-border/60 rounded-3xl max-w-md mx-auto space-y-3 font-sans">
        <p className="text-sm font-bold text-foreground">Record not found</p>
        <Link to="/vitals" className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl inline-block">
          Back to Vitals
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto font-sans">
      <div className="flex items-center space-x-3">
        <Link
          to={`/vitals/${id}`}
          className="p-1.5 rounded-xl hover:bg-accent text-muted-foreground hover:text-foreground border border-border/60 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-foreground font-display flex items-center space-x-2">
            <Pencil className="w-6 h-6 text-primary" />
            <span>Edit Vital Record #{id}</span>
          </h1>
          <p className="text-xs text-muted-foreground">Modify physiological values or add clinical notes.</p>
        </div>
      </div>

      <VitalForm
        defaultValues={{
          patientId: record.patientId,
          systolicBp: record.systolicBp,
          diastolicBp: record.diastolicBp,
          heartRate: record.heartRate,
          oxygenLevel: record.oxygenLevel,
          temperature: record.temperature,
          respiratoryRate: record.respiratoryRate,
          weight: record.weight,
          height: record.height,
          bloodGlucoseMgdl: record.bloodGlucoseMgdl,
          bloodGlucoseType: record.bloodGlucoseType || 'Fasting',
          painLevel: record.painLevel || 0,
          notes: record.notes || '',
        }}
        onSubmit={onSubmit}
        isSubmitting={updateMutation.isPending}
        isEdit={true}
      />
    </div>
  );
};

export default EditVitalRecordPage;
