import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Eye, Plus, FileText, User, Lock, EyeOff } from 'lucide-react';
import ClinicalAssessmentSection from './ClinicalAssessmentSection';
import DiagnosisSection from './DiagnosisSection';
import SymptomsSection from './SymptomsSection';
import ExaminationSection from './ExaminationSection';
import FollowUpSection from './FollowUpSection';
import AdviceSection from './AdviceSection';
import DoctorNotePreview from './DoctorNotePreview';

const schema = z.object({
  patientId: z.coerce.number().min(1, 'Please select a patient'),
  title: z.string().min(2, 'Title must be at least 2 characters').max(200),
  chiefComplaint: z.string().min(3, 'Please specify chief complaint / present illness'),
  diagnosis: z.string().min(2, 'Please enter diagnosis'),
  symptoms: z.string().optional().nullable(),
  examination: z.string().optional().nullable(),
  advice: z.string().optional().nullable(),
  followUpDate: z.string().optional().nullable(),
  internalNotes: z.string().optional().nullable(),
  isPatientVisible: z.boolean().optional().default(true),
});

export const DoctorNoteForm = ({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  isEdit = false,
  patients = [],
}) => {
  const [showPreview, setShowPreview] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues || {
      patientId: '',
      title: 'Clinical Consultation Note',
      chiefComplaint: '',
      diagnosis: '',
      symptoms: '',
      examination: '',
      advice: '',
      followUpDate: '',
      internalNotes: '',
      isPatientVisible: true,
    },
  });

  const formValues = watch();
  const selectedPatient = patients.find((p) => String(p.id) === String(formValues.patientId));
  const patientName = selectedPatient
    ? `${selectedPatient.user?.firstName || selectedPatient.firstName || ''} ${selectedPatient.user?.lastName || selectedPatient.lastName || ''}`.trim()
    : 'Selected Patient';

  const handleFormSubmit = (data) => {
    // Composite content object for structured clinical sections while fulfilling single text field requirement of backend
    const compositeContent = JSON.stringify({
      chiefComplaint: data.chiefComplaint,
      diagnosis: data.diagnosis,
      symptoms: data.symptoms,
      examination: data.examination,
      advice: data.advice,
      followUpDate: data.followUpDate,
      internalNotes: data.internalNotes,
      isPatientVisible: data.isPatientVisible,
    });

    onSubmit({
      patientId: Number(data.patientId),
      title: data.title,
      noteContent: compositeContent,
    });
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Preview Action Bar */}
      <div className="flex items-center justify-between bg-card border border-border/60 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-primary" />
          <span className="text-xs font-bold text-foreground">Clinical Note Editor</span>
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
        <DoctorNotePreview data={formValues} patientName={patientName} />
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Patient & Header Section */}
        <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-foreground font-display flex items-center space-x-2">
            <User className="w-4 h-4 text-primary" />
            <span>Consultation Overview</span>
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

            {/* Note Title */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-foreground">Note Title / Subject <span className="text-rose-500">*</span></label>
              <input
                type="text"
                {...register('title')}
                placeholder="e.g. General Consultation Note, Cardiology Follow-up"
                className="w-full px-3 py-2 bg-accent/30 border border-border/60 rounded-xl text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
              />
              {errors.title && <p className="text-[11px] text-rose-500">{errors.title.message}</p>}
            </div>
          </div>
        </div>

        {/* Clinical Assessments */}
        <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-foreground font-display">Clinical Findings & Diagnosis</h3>
          <div className="space-y-4">
            <ClinicalAssessmentSection
              value={formValues.chiefComplaint}
              onChange={(v) => register('chiefComplaint').onChange({ target: { name: 'chiefComplaint', value: v } })}
              error={errors.chiefComplaint?.message}
              register={register}
            />
            <DiagnosisSection
              value={formValues.diagnosis}
              onChange={(v) => register('diagnosis').onChange({ target: { name: 'diagnosis', value: v } })}
              error={errors.diagnosis?.message}
              register={register}
            />
            <SymptomsSection
              value={formValues.symptoms}
              onChange={(v) => register('symptoms').onChange({ target: { name: 'symptoms', value: v } })}
              error={errors.symptoms?.message}
              register={register}
            />
            <ExaminationSection
              value={formValues.examination}
              onChange={(v) => register('examination').onChange({ target: { name: 'examination', value: v } })}
              error={errors.examination?.message}
              register={register}
            />
          </div>
        </div>

        {/* Advice & Plan */}
        <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-foreground font-display">Treatment Plan & Patient Advice</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AdviceSection
              value={formValues.advice}
              onChange={(v) => register('advice').onChange({ target: { name: 'advice', value: v } })}
              error={errors.advice?.message}
              register={register}
            />
            <FollowUpSection
              value={formValues.followUpDate}
              onChange={(v) => register('followUpDate').onChange({ target: { name: 'followUpDate', value: v } })}
              error={errors.followUpDate?.message}
              register={register}
            />
          </div>
        </div>

        {/* Internal Notes & Privacy Settings */}
        <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-foreground font-display flex items-center space-x-2">
            <Lock className="w-4 h-4 text-amber-500" />
            <span>Internal Notes & Patient Visibility</span>
          </h3>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-foreground">Private Doctor / Internal Notes (Hidden from Patient)</label>
              <textarea
                rows={2}
                {...register('internalNotes')}
                placeholder="Private clinical observations, differential diagnosis, internal team notes..."
                className="w-full px-3 py-2 bg-accent/30 border border-border/60 rounded-xl text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
              />
            </div>

            <label className="flex items-center space-x-2 cursor-pointer w-fit">
              <input
                type="checkbox"
                {...register('isPatientVisible')}
                className="rounded border-border/60 text-primary focus:ring-primary/40"
              />
              <span className="text-xs font-semibold text-foreground flex items-center space-x-1.5">
                <Eye className="w-3.5 h-3.5 text-primary" />
                <span>Make summary note visible to Patient in their Portal</span>
              </span>
            </label>
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
            <span>{isSubmitting ? 'Saving Note...' : isEdit ? 'Update Consultation Note' : 'Save Consultation Note'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default DoctorNoteForm;
