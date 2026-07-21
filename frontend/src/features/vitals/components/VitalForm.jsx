import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Activity, Heart, Thermometer, Zap, Save, Plus, FileText } from 'lucide-react';
import { BLOOD_GLUCOSE_TYPES } from '../constants/vital.constants';
import { calculateBMI, getBMICategory } from '../utils/vital.utils';

const schema = z.object({
  patientId: z.coerce.number().optional(),
  systolicBp: z.coerce.number().min(70, 'Min 70').max(250, 'Max 250'),
  diastolicBp: z.coerce.number().min(40, 'Min 40').max(150, 'Max 150'),
  heartRate: z.coerce.number().min(30, 'Min 30').max(220, 'Max 220'),
  oxygenLevel: z.coerce.number().min(70, 'Min 70%').max(100, 'Max 100%'),
  temperature: z.coerce.number().min(90, 'Min 90°F').max(110, 'Max 110°F'),
  respiratoryRate: z.coerce.number().min(8, 'Min 8').max(60, 'Max 60').optional().nullable(),
  weight: z.coerce.number().min(2, 'Min 2kg').max(300, 'Max 300kg').optional().nullable(),
  height: z.coerce.number().min(30, 'Min 30cm').max(250, 'Max 250cm').optional().nullable(),
  bloodGlucoseMgdl: z.coerce.number().min(40, 'Min 40').max(500, 'Max 500').optional().nullable(),
  bloodGlucoseType: z.string().optional().nullable(),
  painLevel: z.coerce.number().min(0).max(10).optional().nullable(),
  notes: z.string().max(500, 'Notes maximum 500 characters').optional().nullable(),
});

export const VitalForm = ({ defaultValues, onSubmit, isSubmitting = false, isEdit = false, patients = [] }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues || {
      systolicBp: 120,
      diastolicBp: 80,
      heartRate: 72,
      oxygenLevel: 98,
      temperature: 98.6,
      respiratoryRate: 16,
      weight: 70,
      height: 170,
      bloodGlucoseMgdl: 95,
      bloodGlucoseType: 'Fasting',
      painLevel: 0,
      notes: '',
    },
  });

  const weightVal = watch('weight');
  const heightVal = watch('height');
  const calculatedBmi = calculateBMI(weightVal, heightVal);
  const bmiCat = getBMICategory(calculatedBmi);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 font-sans">
      {/* Patient Selector (If provided) */}
      {patients.length > 0 && (
        <div className="bg-card border border-border/60 rounded-3xl p-5 shadow-sm space-y-2">
          <label className="block text-xs font-bold text-foreground">Select Patient <span className="text-rose-500">*</span></label>
          <select
            {...register('patientId')}
            className="w-full px-3 py-2 bg-accent/30 border border-border/60 rounded-xl text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
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
      )}

      {/* Core Vitals Section */}
      <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-foreground font-display flex items-center space-x-2">
          <Activity className="w-4 h-4 text-primary" />
          <span>Core Cardiovascular & Respiratory Vitals</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Systolic BP */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-foreground">Systolic BP (mmHg) <span className="text-rose-500">*</span></label>
            <input
              type="number"
              {...register('systolicBp')}
              placeholder="e.g. 120"
              className="w-full px-3 py-2 bg-accent/30 border border-border/60 rounded-xl text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none font-mono"
            />
            {errors.systolicBp && <p className="text-[11px] text-rose-500">{errors.systolicBp.message}</p>}
          </div>

          {/* Diastolic BP */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-foreground">Diastolic BP (mmHg) <span className="text-rose-500">*</span></label>
            <input
              type="number"
              {...register('diastolicBp')}
              placeholder="e.g. 80"
              className="w-full px-3 py-2 bg-accent/30 border border-border/60 rounded-xl text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none font-mono"
            />
            {errors.diastolicBp && <p className="text-[11px] text-rose-500">{errors.diastolicBp.message}</p>}
          </div>

          {/* Heart Rate */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-foreground">Heart Rate (BPM) <span className="text-rose-500">*</span></label>
            <input
              type="number"
              {...register('heartRate')}
              placeholder="e.g. 72"
              className="w-full px-3 py-2 bg-accent/30 border border-border/60 rounded-xl text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none font-mono"
            />
            {errors.heartRate && <p className="text-[11px] text-rose-500">{errors.heartRate.message}</p>}
          </div>

          {/* SpO2 */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-foreground">SpO₂ Oxygen (%) <span className="text-rose-500">*</span></label>
            <input
              type="number"
              step="0.1"
              {...register('oxygenLevel')}
              placeholder="e.g. 98"
              className="w-full px-3 py-2 bg-accent/30 border border-border/60 rounded-xl text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none font-mono"
            />
            {errors.oxygenLevel && <p className="text-[11px] text-rose-500">{errors.oxygenLevel.message}</p>}
          </div>

          {/* Temperature */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-foreground">Body Temp (°F) <span className="text-rose-500">*</span></label>
            <input
              type="number"
              step="0.1"
              {...register('temperature')}
              placeholder="e.g. 98.6"
              className="w-full px-3 py-2 bg-accent/30 border border-border/60 rounded-xl text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none font-mono"
            />
            {errors.temperature && <p className="text-[11px] text-rose-500">{errors.temperature.message}</p>}
          </div>

          {/* Respiratory Rate */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-foreground">Respiratory Rate (breaths/min)</label>
            <input
              type="number"
              {...register('respiratoryRate')}
              placeholder="e.g. 16"
              className="w-full px-3 py-2 bg-accent/30 border border-border/60 rounded-xl text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none font-mono"
            />
            {errors.respiratoryRate && <p className="text-[11px] text-rose-500">{errors.respiratoryRate.message}</p>}
          </div>
        </div>
      </div>

      {/* Anthropometric & Metabolic Section */}
      <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-foreground font-display flex items-center space-x-2">
          <Heart className="w-4 h-4 text-emerald-500" />
          <span>Biometrics & Blood Glucose</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-foreground">Height (cm)</label>
            <input
              type="number"
              {...register('height')}
              placeholder="e.g. 170"
              className="w-full px-3 py-2 bg-accent/30 border border-border/60 rounded-xl text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-foreground">Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              {...register('weight')}
              placeholder="e.g. 70"
              className="w-full px-3 py-2 bg-accent/30 border border-border/60 rounded-xl text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-foreground">Blood Glucose (mg/dL)</label>
            <input
              type="number"
              {...register('bloodGlucoseMgdl')}
              placeholder="e.g. 95"
              className="w-full px-3 py-2 bg-accent/30 border border-border/60 rounded-xl text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-foreground">Glucose Reading Type</label>
            <select
              {...register('bloodGlucoseType')}
              className="w-full px-3 py-2 bg-accent/30 border border-border/60 rounded-xl text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
            >
              {BLOOD_GLUCOSE_TYPES.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Calculated BMI Callout */}
        {calculatedBmi && (
          <div className="p-3 bg-accent/30 border border-border/40 rounded-2xl flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-semibold">Calculated BMI:</span>
            <div className="flex items-center space-x-2">
              <span className="font-mono font-extrabold text-foreground">{calculatedBmi} kg/m²</span>
              <span className={`font-bold px-2 py-0.5 rounded-full bg-card border border-border/60 ${bmiCat.color}`}>
                {bmiCat.label}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Notes & Pain Score */}
      <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-foreground font-display flex items-center space-x-2">
          <FileText className="w-4 h-4 text-amber-500" />
          <span>Pain Score & Clinical Notes</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-foreground">Pain Score (0 - 10)</label>
            <input
              type="number"
              min="0"
              max="10"
              {...register('painLevel')}
              placeholder="0 (No pain)"
              className="w-full px-3 py-2 bg-accent/30 border border-border/60 rounded-xl text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none font-mono"
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="block text-xs font-semibold text-foreground">Clinical Observations & Notes</label>
            <input
              type="text"
              {...register('notes')}
              placeholder="e.g. Patient resting comfortably, regular sinus rhythm."
              className="w-full px-3 py-2 bg-accent/30 border border-border/60 rounded-xl text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
            />
            {errors.notes && <p className="text-[11px] text-rose-500">{errors.notes.message}</p>}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-primary text-primary-foreground text-xs font-bold rounded-2xl hover:bg-primary/90 shadow-md shadow-primary/20 transition-all disabled:opacity-60 flex items-center space-x-2"
        >
          {isEdit ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{isSubmitting ? 'Saving Record...' : isEdit ? 'Update Vital Record' : 'Record Vitals'}</span>
        </button>
      </div>
    </form>
  );
};

export default VitalForm;
