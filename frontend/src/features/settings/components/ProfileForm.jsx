/**
 * PulseCare AI - ProfileForm Component
 */

import React, { useState } from 'react';
import { Save, Loader2 } from 'lucide-react';

export const ProfileForm = ({ profile = {}, onSubmit, isSubmitting = false, className = '' }) => {
  const [formData, setFormData] = useState({
    firstName: profile.firstName || '',
    lastName: profile.lastName || '',
    email: profile.email || '',
    phone: profile.phone || '',
    gender: profile.patientProfile?.gender || profile.gender || 'Male',
    dateOfBirth: profile.patientProfile?.dateOfBirth || profile.dateOfBirth || '',
    licenseNumber: profile.doctorProfile?.licenseNumber || '',
    specialization: profile.doctorProfile?.specialization || '',
    mrn: profile.patientProfile?.mrn || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={`bg-card border border-border/60 rounded-3xl p-6 shadow-xs space-y-5 font-sans ${className}`}>
      <h3 className="text-sm font-bold text-foreground font-display">Personal Details & Information</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
        <div className="space-y-1.5">
          <label htmlFor="firstName" className="font-bold text-foreground">First Name</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            value={formData.firstName}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full px-3.5 py-2.5 bg-accent/30 hover:bg-accent/50 focus:bg-card border border-border/60 focus:border-primary rounded-2xl outline-none transition-all shadow-2xs"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="lastName" className="font-bold text-foreground">Last Name</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            required
            value={formData.lastName}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full px-3.5 py-2.5 bg-accent/30 hover:bg-accent/50 focus:bg-card border border-border/60 focus:border-primary rounded-2xl outline-none transition-all shadow-2xs"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="font-bold text-foreground">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            disabled
            className="w-full px-3.5 py-2.5 bg-accent/20 border border-border/40 text-muted-foreground rounded-2xl cursor-not-allowed"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="phone" className="font-bold text-foreground">Phone Number</label>
          <input
            id="phone"
            name="phone"
            type="text"
            value={formData.phone}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full px-3.5 py-2.5 bg-accent/30 hover:bg-accent/50 focus:bg-card border border-border/60 focus:border-primary rounded-2xl outline-none transition-all shadow-2xs"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="gender" className="font-bold text-foreground">Gender</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full px-3.5 py-2.5 bg-accent/30 hover:bg-accent/50 focus:bg-card border border-border/60 focus:border-primary rounded-2xl outline-none transition-all shadow-2xs font-semibold"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="dateOfBirth" className="font-bold text-foreground">Date of Birth</label>
          <input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full px-3.5 py-2.5 bg-accent/30 hover:bg-accent/50 focus:bg-card border border-border/60 focus:border-primary rounded-2xl outline-none transition-all shadow-2xs"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-sm transition-all disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Profile Changes</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;
