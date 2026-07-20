import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, User, Phone, MapPin, AlertCircle, Droplet, Ruler, Scale } from 'lucide-react';
import { patientUpdateSchema } from '../validators/patient.validator';
import { useUpdatePatient } from '../hooks/useUpdatePatient';
import { usePatient } from '../hooks/usePatient';
import { BLOOD_GROUPS } from '../constants/patient.constants';

export const EditPatientPage = ({ patient: propPatient, isSelf = false, onCancel }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const targetId = id || 'me';

  const { data: fetchedPatient } = usePatient(targetId);
  const patient = propPatient || fetchedPatient;

  const updateMutation = useUpdatePatient(targetId);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(patientUpdateSchema),
    defaultValues: {
      phone: patient?.phone || '',
      address: patient?.address || '',
      emergencyContact: patient?.emergencyContact || '',
      bloodGroup: patient?.bloodGroup || 'O+',
      heightCm: patient?.heightCm || 178,
      weightKg: patient?.weightKg || 80,
      allergies: patient?.allergies || '',
      medicalConditions: patient?.medicalConditions || '',
    },
  });

  const onSubmit = (formData) => {
    updateMutation.mutate(formData, {
      onSuccess: () => {
        if (onCancel) onCancel();
        else navigate(-1);
      },
    });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto font-sans">
      <div className="flex items-center justify-between pb-3 border-b border-border/50">
        <div>
          <h2 className="text-xl font-extrabold text-foreground font-display">
            {isSelf ? 'Edit My Profile' : `Edit Profile – ${patient?.firstName || ''} ${patient?.lastName || ''}`}
          </h2>
          <p className="text-xs text-muted-foreground">Update phone, emergency contact, physical metrics, and allergies.</p>
        </div>

        <button
          onClick={onCancel ? onCancel : () => navigate(-1)}
          className="p-2 rounded-xl bg-accent text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-5">
        {/* Contact Fields */}
        <div className="space-y-4">
          <h4 className="text-xs font-mono font-bold uppercase text-primary tracking-wider">Contact & Address Details</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-foreground mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                <input
                  type="text"
                  {...register('phone')}
                  className="w-full pl-9 pr-3 py-2 bg-accent/30 border border-border/60 rounded-xl text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              {errors.phone && <p className="text-[11px] text-rose-500 mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">Emergency Contact</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-rose-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  {...register('emergencyContact')}
                  className="w-full pl-9 pr-3 py-2 bg-accent/30 border border-border/60 rounded-xl text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
                  placeholder="+1 (555) 999-8877"
                />
              </div>
              {errors.emergencyContact && <p className="text-[11px] text-rose-500 mt-1">{errors.emergencyContact.message}</p>}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-foreground mb-1 text-xs">Residential Address</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
              <input
                type="text"
                {...register('address')}
                className="w-full pl-9 pr-3 py-2 bg-accent/30 border border-border/60 rounded-xl text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
                placeholder="742 Evergreen Terrace, City, State"
              />
            </div>
            {errors.address && <p className="text-[11px] text-rose-500 mt-1">{errors.address.message}</p>}
          </div>
        </div>

        {/* Physical & Medical Fields */}
        <div className="space-y-4 pt-2 border-t border-border/40">
          <h4 className="text-xs font-mono font-bold uppercase text-rose-500 tracking-wider">Physical Metrics & Medical Conditions</h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-foreground mb-1">Blood Group</label>
              <select
                {...register('bloodGroup')}
                className="w-full px-3 py-2 bg-accent/30 border border-border/60 rounded-xl text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
              >
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">Height (cm)</label>
              <input
                type="number"
                {...register('heightCm')}
                className="w-full px-3 py-2 bg-accent/30 border border-border/60 rounded-xl text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
              />
              {errors.heightCm && <p className="text-[11px] text-rose-500 mt-1">{errors.heightCm.message}</p>}
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">Weight (kg)</label>
              <input
                type="number"
                {...register('weightKg')}
                className="w-full px-3 py-2 bg-accent/30 border border-border/60 rounded-xl text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
              />
              {errors.weightKg && <p className="text-[11px] text-rose-500 mt-1">{errors.weightKg.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-foreground mb-1">Known Allergies</label>
              <textarea
                {...register('allergies')}
                rows={2}
                className="w-full p-3 bg-accent/30 border border-border/60 rounded-xl text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
                placeholder="Penicillin, Dust, Peanuts..."
              />
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">Chronic Medical Conditions</label>
              <textarea
                {...register('medicalConditions')}
                rows={2}
                className="w-full p-3 bg-accent/30 border border-border/60 rounded-xl text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
                placeholder="Hypertension, Asthma, Diabetes..."
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-border/40">
          <button
            type="button"
            onClick={onCancel ? onCancel : () => navigate(-1)}
            className="px-4 py-2 bg-accent border border-border/60 text-foreground text-xs font-semibold rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="px-5 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/90 shadow-md shadow-primary/20 transition-all flex items-center space-x-1.5"
          >
            <Save className="w-4 h-4" />
            <span>{updateMutation.isPending ? 'Saving...' : 'Save Profile Updates'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPatientPage;
