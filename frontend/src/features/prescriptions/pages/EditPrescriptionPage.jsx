import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Pencil } from 'lucide-react';
import PrescriptionForm from '../components/PrescriptionForm';
import PrescriptionSkeleton from '../components/PrescriptionSkeleton';
import { usePrescription } from '../hooks/usePrescription';
import { useUpdatePrescription } from '../hooks/useUpdatePrescription';

export const EditPrescriptionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: prescription, isLoading, error } = usePrescription(id);
  const updateMutation = useUpdatePrescription();

  const onSubmit = (formData) => {
    updateMutation.mutate(
      { id, data: formData },
      {
        onSuccess: () => {
          navigate(`/prescriptions/${id}`);
        },
      }
    );
  };

  if (isLoading) return <PrescriptionSkeleton count={2} />;

  if (error || !prescription) {
    return (
      <div className="text-center py-12 bg-card border border-border/60 rounded-3xl max-w-md mx-auto space-y-3 font-sans">
        <p className="text-sm font-bold text-foreground">Prescription record not found</p>
        <Link to="/prescriptions" className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl inline-block">
          Back to Prescriptions
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans">
      <div className="flex items-center space-x-3">
        <Link
          to={`/prescriptions/${id}`}
          className="p-1.5 rounded-xl hover:bg-accent text-muted-foreground hover:text-foreground border border-border/60 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-foreground font-display flex items-center space-x-2">
            <Pencil className="w-6 h-6 text-primary" />
            <span>Edit Prescription #{id}</span>
          </h1>
          <p className="text-xs text-muted-foreground">Modify prescribed medications, doses, or advice.</p>
        </div>
      </div>

      <PrescriptionForm
        defaultValues={{
          patientId: prescription.patientId,
          diagnosis: prescription.diagnosis || '',
          clinicalNotes: prescription.clinicalNotes || '',
          followUpDate: prescription.followUpDate || '',
          status: prescription.status || 'Active',
          items: prescription.items || [
            {
              medicationName: '',
              dosage: '1 Tablet',
              frequency: 'Twice daily (1-0-1)',
              durationDays: 5,
              instructions: 'After meals',
            },
          ],
        }}
        onSubmit={onSubmit}
        isSubmitting={updateMutation.isPending}
        isEdit={true}
      />
    </div>
  );
};

export default EditPrescriptionPage;
