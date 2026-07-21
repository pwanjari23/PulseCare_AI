import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Save, Eye, FileText, Stethoscope, User, Calendar } from 'lucide-react';
import PrescriptionMedicineRow from './PrescriptionMedicineRow';
import PrescriptionPreview from './PrescriptionPreview';

const itemSchema = z.object({
  medicationName: z.string().min(1, 'Medication name is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  frequency: z.string().min(1, 'Frequency is required'),
  durationDays: z.coerce.number().min(1, 'Min 1 day').max(365, 'Max 365 days'),
  instructions: z.string().optional().nullable(),
});

const schema = z.object({
  patientId: z.coerce.number().min(1, 'Please select a patient'),
  diagnosis: z.string().optional().nullable(),
  clinicalNotes: z.string().optional().nullable(),
  followUpDate: z.string().optional().nullable(),
  status: z.string().optional().default('Active'),
  items: z.array(itemSchema).min(1, 'Please add at least one medication'),
});

export const PrescriptionForm = ({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  isEdit = false,
  patients = [],
}) => {
  const [showPreview, setShowPreview] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues || {
      patientId: '',
      diagnosis: '',
      clinicalNotes: '',
      followUpDate: '',
      status: 'Active',
      items: [
        {
          medicationName: '',
          dosage: '1 Tablet',
          frequency: 'Twice daily (1-0-1)',
          durationDays: 5,
          instructions: 'After meals',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const formValues = watch();
  const selectedPatient = patients.find((p) => String(p.id) === String(formValues.patientId));
  const patientName = selectedPatient
    ? `${selectedPatient.user?.firstName || selectedPatient.firstName || ''} ${selectedPatient.user?.lastName || selectedPatient.lastName || ''}`.trim()
    : 'Selected Patient';

  const handleRowChange = (index, field, val) => {
    setValue(`items.${index}.${field}`, val, { shouldValidate: true });
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top action bar to toggle preview */}
      <div className="flex items-center justify-between bg-card border border-border/60 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-primary" />
          <span className="text-xs font-bold text-foreground">Prescription Builder</span>
        </div>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center space-x-1.5 ${
            showPreview
              ? 'bg-primary text-primary-foreground border-primary font-bold shadow-xs'
              : 'bg-card border-border/60 text-muted-foreground hover:bg-accent'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>{showPreview ? 'Hide Live Preview' : 'Show Live Preview'}</span>
        </button>
      </div>

      {showPreview && (
        <PrescriptionPreview data={formValues} patientName={patientName} />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Patient & Diagnosis details */}
        <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-foreground font-display flex items-center space-x-2">
            <User className="w-4 h-4 text-primary" />
            <span>Patient & Clinical Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Patient Selector */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-foreground">
                Select Patient <span className="text-rose-500">*</span>
              </label>
              <select
                {...register('patientId')}
                disabled={isEdit}
                className="w-full px-3 py-2 bg-accent/30 border border-border/60 rounded-xl text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none disabled:opacity-60"
              >
                <option value="">-- Select Patient --</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.user?.firstName || p.firstName} {p.user?.lastName || p.lastName} (ID #{p.id})
                  </option>
                ))}
              </select>
              {errors.patientId && <p className="text-[11px] text-rose-500">{errors.patientId.message}</p>}
            </div>

            {/* Diagnosis */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-foreground">Diagnosis / Primary Concern</label>
              <input
                type="text"
                {...register('diagnosis')}
                placeholder="e.g. Acute Pharyngitis, Mild Hypertension"
                className="w-full px-3 py-2 bg-accent/30 border border-border/60 rounded-xl text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Medicines Section */}
        <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-foreground font-display flex items-center space-x-2">
                <Stethoscope className="w-4 h-4 text-emerald-500" />
                <span>Prescribed Medications ({fields.length})</span>
              </h3>
              <p className="text-xs text-muted-foreground">Add all medications to be dispensed to the patient.</p>
            </div>

            <button
              type="button"
              onClick={() =>
                append({
                  medicationName: '',
                  dosage: '1 Tablet',
                  frequency: 'Twice daily (1-0-1)',
                  durationDays: 5,
                  instructions: 'After meals',
                })
              }
              className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 text-xs font-bold rounded-xl hover:bg-primary/20 transition-all flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Medication</span>
            </button>
          </div>

          {errors.items?.root && <p className="text-[11px] text-rose-500">{errors.items.root.message}</p>}
          {errors.items?.message && <p className="text-[11px] text-rose-500">{errors.items.message}</p>}

          <div className="space-y-3">
            {fields.map((fieldItem, idx) => (
              <PrescriptionMedicineRow
                key={fieldItem.id}
                index={idx}
                item={formValues.items?.[idx] || fieldItem}
                onChange={handleRowChange}
                onRemove={() => remove(idx)}
                canRemove={fields.length > 1}
                errors={errors.items?.[idx] || {}}
              />
            ))}
          </div>
        </div>

        {/* Clinical Notes & Follow-up */}
        <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-foreground font-display flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-amber-500" />
            <span>Additional Instructions & Follow-up</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-foreground">Follow-Up Date</label>
              <input
                type="date"
                {...register('followUpDate')}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 bg-accent/30 border border-border/60 rounded-xl text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-foreground">Clinical Notes / Special Advice</label>
              <input
                type="text"
                {...register('clinicalNotes')}
                placeholder="e.g. Drink plenty of water. Avoid cold drinks."
                className="w-full px-3 py-2 bg-accent/30 border border-border/60 rounded-xl text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-primary text-primary-foreground text-xs font-bold rounded-2xl hover:bg-primary/90 shadow-md shadow-primary/20 transition-all disabled:opacity-60 flex items-center space-x-2"
          >
            {isEdit ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{isSubmitting ? 'Saving...' : isEdit ? 'Update Prescription' : 'Issue Prescription'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default PrescriptionForm;
