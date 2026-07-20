import React, { useState } from 'react';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  Stethoscope,
  Calendar,
  Clock,
  FileText,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  CalendarCheck,
} from 'lucide-react';

import { bookAppointmentSchema } from '../../validators/appointment.validator';
import { FormInput, FormSelect } from '../ui/forms/Form';
import { useDoctors, useBookAppointment } from '../../hooks/useAppointments';

export const AppointmentForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [apiError, setApiError] = useState(null);

  const { data: doctors = [], isLoading: isLoadingDoctors } = useDoctors();
  const bookAppointmentMutation = useBookAppointment();

  const methods = useForm({
    resolver: zodResolver(bookAppointmentSchema),
    defaultValues: {
      doctorId: '',
      scheduledDate: new Date().toISOString().split('T')[0],
      timeSlot: '',
      durationMinutes: '30',
      reason: '',
    },
    mode: 'onChange',
  });

  const selectedDoctorId = useWatch({ control: methods.control, name: 'doctorId' });
  const selectedDate = useWatch({ control: methods.control, name: 'scheduledDate' });
  const selectedSlot = useWatch({ control: methods.control, name: 'timeSlot' });
  const reasonText = useWatch({ control: methods.control, name: 'reason' });

  // Mock available slots generator for interactive booking
  const availableSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:30 AM', '02:00 PM', '02:30 PM', '03:30 PM',
  ];

  const selectedDoctorObj = doctors.find((d) => String(d.id) === String(selectedDoctorId));

  const onSubmit = async (values) => {
    setApiError(null);

    // Combine date and time slot into ISO 8601 string
    const [timeStr, period] = values.timeSlot.split(' ');
    let [hours, minutes] = timeStr.split(':').map(Number);
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    const scheduledDateObj = new Date(values.scheduledDate);
    scheduledDateObj.setHours(hours, minutes, 0, 0);

    const payload = {
      doctorId: Number(values.doctorId),
      scheduledAt: scheduledDateObj.toISOString(),
      durationMinutes: Number(values.durationMinutes || 30),
      reason: values.reason,
    };

    try {
      await bookAppointmentMutation.mutateAsync(payload);
      toast.success('Appointment booked successfully!');
      navigate('/appointments');
    } catch (err) {
      console.error('Booking error:', err);
      const message = err.message || 'Failed to book appointment. Please select another slot.';
      setApiError(message);
      toast.error(message);
    }
  };

  const steps = [
    { number: 1, title: 'Select Doctor' },
    { number: 2, title: 'Date & Time' },
    { number: 3, title: 'Visit Details' },
    { number: 4, title: 'Review & Confirm' },
  ];

  return (
    <FormProvider {...methods}>
      <div className="bg-card border border-border/60 rounded-3xl p-6 sm:p-8 shadow-xl max-w-3xl mx-auto space-y-6">
        {/* Step Indicator Header */}
        <div className="flex items-center justify-between border-b border-border/50 pb-4">
          {steps.map((s) => (
            <div key={s.number} className="flex items-center space-x-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                  step === s.number
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                    : step > s.number
                    ? 'bg-emerald-500 text-white'
                    : 'bg-accent text-muted-foreground'
                }`}
              >
                {step > s.number ? <CheckCircle2 className="w-4 h-4" /> : s.number}
              </div>
              <span
                className={`text-xs font-semibold hidden md:inline ${
                  step === s.number ? 'text-foreground font-bold' : 'text-muted-foreground'
                }`}
              >
                {s.title}
              </span>
            </div>
          ))}
        </div>

        {apiError && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 text-sm flex items-start space-x-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{apiError}</span>
          </div>
        )}

        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          {/* STEP 1: Select Doctor */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground font-display">Step 1: Choose Your Doctor</h3>
                <p className="text-xs text-muted-foreground">Select a certified specialist for your consultation.</p>
              </div>

              {isLoadingDoctors ? (
                <div className="py-8 text-center text-xs text-muted-foreground">Loading medical specialists...</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {doctors.map((doc) => {
                    const isSelected = String(selectedDoctorId) === String(doc.id);
                    return (
                      <div
                        key={doc.id}
                        onClick={() => methods.setValue('doctorId', doc.id, { shouldValidate: true })}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-primary/10 border-primary ring-1 ring-primary/40'
                            : 'bg-card border-border/60 hover:bg-accent/50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                            <Stethoscope className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-foreground">
                              Dr. {doc.firstName} {doc.lastName}
                            </h4>
                            <p className="text-[11px] text-muted-foreground">{doc.specialization || 'Cardiology'}</p>
                            <span className="text-[10px] font-mono text-primary font-semibold block mt-1">
                              Fee: ${doc.consultationFee || doc.fee || 150}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Date & Available Time Slots */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground font-display">Step 2: Choose Date & Time Slot</h3>
                <p className="text-xs text-muted-foreground">Available slots update based on selected doctor availability.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput name="scheduledDate" label="Consultation Date *" type="date" />
                <FormSelect
                  name="durationMinutes"
                  label="Slot Duration"
                  options={[
                    { value: '15', label: '15 Minutes' },
                    { value: '30', label: '30 Minutes' },
                    { value: '45', label: '45 Minutes' },
                    { value: '60', label: '60 Minutes' },
                  ]}
                />
              </div>

              {/* Time Slots Grid */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold text-foreground flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span>Available Time Slots *</span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {availableSlots.map((slot) => {
                    const isSelected = selectedSlot === slot;
                    return (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => methods.setValue('timeSlot', slot, { shouldValidate: true })}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all border ${
                          isSelected
                            ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                            : 'bg-card border-border/60 text-foreground hover:bg-accent'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Visit Reason */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground font-display">Step 3: Reason for Visit</h3>
                <p className="text-xs text-muted-foreground">Describe your symptoms or consultation objective.</p>
              </div>

              <FormInput
                name="reason"
                label="Symptoms / Reason for Appointment"
                placeholder="e.g., Routine blood pressure checkup and prescription refill..."
              />
            </div>
          )}

          {/* STEP 4: Review & Confirm */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground font-display">Step 4: Review Appointment Details</h3>
                <p className="text-xs text-muted-foreground">Verify details before submitting your booking.</p>
              </div>

              <div className="p-4 rounded-2xl bg-accent/30 border border-border/60 space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Selected Doctor:</span>
                  <span className="font-bold text-foreground">
                    {selectedDoctorObj ? `Dr. ${selectedDoctorObj.firstName} ${selectedDoctorObj.lastName}` : 'Dr. Specialist'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Date & Time:</span>
                  <span className="font-bold text-foreground">{selectedDate} at {selectedSlot}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-bold text-foreground">30 Minutes</span>
                </div>
                <div className="py-1">
                  <span className="text-muted-foreground block mb-0.5">Reason:</span>
                  <span className="font-medium text-foreground">{reasonText || 'General Consultation'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 bg-accent text-accent-foreground text-xs font-semibold rounded-xl border border-border/60 hover:bg-accent/80 transition-colors flex items-center space-x-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : <div />}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => {
                  if (step === 1 && !selectedDoctorId) {
                    toast.error('Please select a doctor');
                    return;
                  }
                  if (step === 2 && (!selectedDate || !selectedSlot)) {
                    toast.error('Please select date and time slot');
                    return;
                  }
                  setStep(step + 1);
                }}
                className="px-5 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-xl hover:bg-primary/90 transition-colors flex items-center space-x-1"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={bookAppointmentMutation.isPending}
                className="px-6 py-2.5 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/25 disabled:opacity-50 transition-all flex items-center space-x-2"
              >
                {bookAppointmentMutation.isPending ? (
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Confirm & Book Appointment</span>
                    <CalendarCheck className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </FormProvider>
  );
};

export default AppointmentForm;
