import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Save, X, Stethoscope, Building2, Award, DollarSign, MapPin } from 'lucide-react';
import { doctorUpdateSchema } from '../validators/doctor.validator';
import { useUpdateDoctorProfile } from '../hooks/useUpdateDoctorProfile';
import { SPECIALIZATIONS } from '../constants/doctor.constants';

export const EditDoctorProfilePage = ({ doctor, onCancel }) => {
  const navigate = useNavigate();
  const updateMutation = useUpdateDoctorProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(doctorUpdateSchema),
    defaultValues: {
      specialization: doctor?.specialization || 'Cardiology',
      qualifications: doctor?.qualifications || 'MD, FACC',
      experienceYears: doctor?.experienceYears || 10,
      hospital: doctor?.hospital || 'St. Jude Medical Center',
      consultationFee: doctor?.consultationFee || 120,
      clinicAddress: doctor?.clinicAddress || '100 Medical Plaza, Suite 400',
      biography: doctor?.biography || '',
      languages: doctor?.languages || 'English, Spanish',
      education: doctor?.education || 'MD from Johns Hopkins University School of Medicine (2012)',
      certificates: doctor?.certificates || 'American Board of Internal Medicine - Cardiovascular Disease',
    },
  });

  const onSubmit = (formData) => {
    updateMutation.mutate(formData, {
      onSuccess: () => {
        if (onCancel) onCancel();
        else navigate('/doctor/profile');
      },
    });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto font-sans">
      <div className="flex items-center justify-between pb-3 border-b border-border/50">
        <div>
          <h2 className="text-xl font-extrabold text-foreground font-display">Edit Professional Doctor Profile</h2>
          <p className="text-xs text-muted-foreground">Update clinical credentials, consultation fee, clinic address, and biography.</p>
        </div>

        <button
          onClick={onCancel ? onCancel : () => navigate(-1)}
          className="p-2 rounded-xl bg-accent text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-5">
        {/* Core Credentials */}
        <div className="space-y-4">
          <h4 className="text-xs font-mono font-bold uppercase text-primary tracking-wider flex items-center space-x-1.5">
            <Stethoscope className="w-4 h-4" />
            <span>Clinical Credentials & Practice</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-foreground mb-1">Medical Specialization</label>
              <select
                {...register('specialization')}
                className="w-full px-3 py-2 bg-accent/30 border border-border/60 rounded-xl text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
              >
                {SPECIALIZATIONS.map((spec) => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
              {errors.specialization && <p className="text-[11px] text-rose-500 mt-1">{errors.specialization.message}</p>}
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">Qualifications (Degrees)</label>
              <input
                type="text"
                {...register('qualifications')}
                className="w-full px-3 py-2 bg-accent/30 border border-border/60 rounded-xl text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
                placeholder="MD, FACC, MBBS"
              />
              {errors.qualifications && <p className="text-[11px] text-rose-500 mt-1">{errors.qualifications.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-foreground mb-1">Years of Experience</label>
              <input
                type="number"
                {...register('experienceYears')}
                className="w-full px-3 py-2 bg-accent/30 border border-border/60 rounded-xl text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
              />
              {errors.experienceYears && <p className="text-[11px] text-rose-500 mt-1">{errors.experienceYears.message}</p>}
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">Consultation Fee ($)</label>
              <input
                type="number"
                {...register('consultationFee')}
                className="w-full px-3 py-2 bg-accent/30 border border-border/60 rounded-xl text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
              />
              {errors.consultationFee && <p className="text-[11px] text-rose-500 mt-1">{errors.consultationFee.message}</p>}
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">Primary Hospital</label>
              <input
                type="text"
                {...register('hospital')}
                className="w-full px-3 py-2 bg-accent/30 border border-border/60 rounded-xl text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
                placeholder="St. Jude Medical Center"
              />
              {errors.hospital && <p className="text-[11px] text-rose-500 mt-1">{errors.hospital.message}</p>}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-foreground mb-1 text-xs">Clinic Address</label>
            <input
              type="text"
              {...register('clinicAddress')}
              className="w-full px-3 py-2 bg-accent/30 border border-border/60 rounded-xl text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
              placeholder="100 Medical Plaza, Suite 400"
            />
            {errors.clinicAddress && <p className="text-[11px] text-rose-500 mt-1">{errors.clinicAddress.message}</p>}
          </div>
        </div>

        {/* Biography & Education */}
        <div className="space-y-4 pt-2 border-t border-border/40">
          <h4 className="text-xs font-mono font-bold uppercase text-healing-500 tracking-wider">Biography & Background</h4>

          <div className="text-xs">
            <label className="block font-semibold text-foreground mb-1">Professional Biography</label>
            <textarea
              {...register('biography')}
              rows={3}
              className="w-full p-3 bg-accent/30 border border-border/60 rounded-xl text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
              placeholder="Write a brief overview of your clinical specialties..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-foreground mb-1">Languages Spoken</label>
              <input
                type="text"
                {...register('languages')}
                className="w-full px-3 py-2 bg-accent/30 border border-border/60 rounded-xl text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
                placeholder="English, Spanish, French"
              />
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">Education Background</label>
              <input
                type="text"
                {...register('education')}
                className="w-full px-3 py-2 bg-accent/30 border border-border/60 rounded-xl text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
                placeholder="MD from Johns Hopkins (2012)"
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
            <span>{updateMutation.isPending ? 'Saving...' : 'Save Profile'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDoctorProfilePage;
