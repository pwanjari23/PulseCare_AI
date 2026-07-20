import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Calendar, Clock, Stethoscope, CheckCircle2 } from 'lucide-react';
import { appointmentBookingSchema } from '../validators/appointment.validator';
import { useCreateAppointment } from '../hooks/useCreateAppointment';
import { useDoctors } from '../../doctors/hooks/useDoctors';
import AppointmentSlotPicker from '../components/AppointmentSlotPicker';
import AppointmentSummary from '../components/AppointmentSummary';
import AppointmentConfirmation from '../components/AppointmentConfirmation';
import { CONSULTATION_TYPES, DEFAULT_TIME_SLOTS } from '../constants/appointment.constants';

const STEPS = ['Select Doctor', 'Choose Date & Slot', 'Reason', 'Confirm'];

export const BookAppointmentPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedDoctorId = searchParams.get('doctorId');

  const [step, setStep] = useState(0);
  const [bookedAppointment, setBookedAppointment] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorSearch, setDoctorSearch] = useState('');

  const { data: doctorsData, isLoading: loadingDoctors } = useDoctors();
  const bookMutation = useCreateAppointment();

  const doctors = useMemo(() => {
    if (Array.isArray(doctorsData)) return doctorsData;
    if (doctorsData?.doctors) return doctorsData.doctors;
    return [];
  }, [doctorsData]);

  const filteredDoctors = useMemo(() => {
    if (!doctorSearch) return doctors;
    const s = doctorSearch.toLowerCase();
    return doctors.filter(
      (d) =>
        `${d.firstName} ${d.lastName}`.toLowerCase().includes(s) ||
        (d.specialization || '').toLowerCase().includes(s)
    );
  }, [doctors, doctorSearch]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(appointmentBookingSchema),
    defaultValues: {
      doctorId: preSelectedDoctorId ? Number(preSelectedDoctorId) : undefined,
      date: '',
      slotTime: '',
      reason: '',
      type: 'In-Person',
      symptoms: '',
    },
  });

  const watchedDoctorId = watch('doctorId');
  const watchedSlot = watch('slotTime');

  useEffect(() => {
    if (preSelectedDoctorId) {
      const found = doctors.find((d) => String(d.id) === String(preSelectedDoctorId));
      if (found) {
        setSelectedDoctor(found);
        setValue('doctorId', Number(preSelectedDoctorId));
      }
    }
  }, [preSelectedDoctorId, doctors, setValue]);

  const onSubmit = (data) => {
    bookMutation.mutate(data, {
      onSuccess: (res) => {
        setBookedAppointment({
          ...data,
          id: res?.id || Math.floor(Math.random() * 1000) + 300,
          doctorName: `${selectedDoctor?.firstName || ''} ${selectedDoctor?.lastName || ''}`,
        });
        setStep(4); // confirmation
      },
    });
  };

  if (bookedAppointment && step === 4) {
    return (
      <div className="max-w-md mx-auto pt-8">
        <AppointmentConfirmation appointment={bookedAppointment} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-foreground font-display tracking-tight flex items-center space-x-2">
          <Calendar className="w-7 h-7 text-primary" />
          <span>Book an Appointment</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Complete the steps below to schedule your medical consultation.
        </p>
      </div>

      {/* Stepper */}
      <div className="flex items-center space-x-2 overflow-x-auto py-1">
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div
              className={`flex items-center space-x-1.5 text-xs font-semibold shrink-0 ${
                i < step ? 'text-emerald-500' : i === step ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                i < step
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : i === step
                  ? 'bg-primary border-primary text-primary-foreground'
                  : 'border-border/60 text-muted-foreground'
              }`}>
                {i < step ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span className="hidden sm:block">{s}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 rounded-full min-w-4 ${i < step ? 'bg-emerald-500' : 'bg-border/50'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-5"
        >
          {/* Step 0: Select Doctor */}
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-foreground font-display flex items-center space-x-2">
                <Stethoscope className="w-5 h-5 text-primary" />
                <span>Select Your Doctor</span>
              </h2>
              <input
                type="text"
                placeholder="Search by name or specialization..."
                value={doctorSearch}
                onChange={(e) => setDoctorSearch(e.target.value)}
                className="w-full px-3 py-2 bg-accent/30 border border-border/60 rounded-xl text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
              />
              <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                {loadingDoctors ? (
                  <div className="text-center py-4 text-xs text-muted-foreground animate-pulse">Loading doctors...</div>
                ) : filteredDoctors.map((doc) => {
                  const isSelected = watchedDoctorId === doc.id;
                  return (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => {
                        setValue('doctorId', doc.id);
                        setSelectedDoctor(doc);
                      }}
                      className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-primary/5 border-primary text-foreground'
                          : 'border-border/50 hover:bg-accent/50'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold text-foreground">
                          Dr. {doc.firstName} {doc.lastName}
                        </p>
                        <p className="text-[11px] text-muted-foreground">{doc.specialization} • {doc.hospital}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-foreground">${doc.consultationFee || 120}</p>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-primary ml-auto mt-1" />}
                      </div>
                    </button>
                  );
                })}
              </div>
              {errors.doctorId && <p className="text-[11px] text-rose-500">{errors.doctorId.message}</p>}
            </div>
          )}

          {/* Step 1: Date & Slot */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-foreground font-display flex items-center space-x-2">
                <Clock className="w-5 h-5 text-healing-500" />
                <span>Choose Date & Time Slot</span>
              </h2>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Appointment Date</label>
                <input
                  type="date"
                  {...register('date')}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 bg-accent/30 border border-border/60 rounded-xl text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
                />
                {errors.date && <p className="text-[11px] text-rose-500 mt-1">{errors.date.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-2">Consultation Type</label>
                <div className="flex space-x-2">
                  {CONSULTATION_TYPES.map((ct) => (
                    <button
                      key={ct.id}
                      type="button"
                      onClick={() => setValue('type', ct.id)}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                        watch('type') === ct.id
                          ? 'bg-primary text-primary-foreground border-primary font-bold'
                          : 'bg-card border-border/60 text-muted-foreground hover:bg-accent'
                      }`}
                    >
                      {ct.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-2">Available Time Slots</label>
                <AppointmentSlotPicker
                  selectedSlot={watchedSlot}
                  onSelectSlot={(slot) => setValue('slotTime', slot)}
                  availableSlots={DEFAULT_TIME_SLOTS}
                />
                {errors.slotTime && <p className="text-[11px] text-rose-500 mt-1">{errors.slotTime.message}</p>}
              </div>
            </div>
          )}

          {/* Step 2: Reason */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-foreground font-display">Reason & Symptoms</h2>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Reason for Visit <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('reason')}
                  placeholder="e.g. Routine checkup, chest discomfort, diabetes consultation"
                  className="w-full px-3 py-2 bg-accent/30 border border-border/60 rounded-xl text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
                />
                {errors.reason && <p className="text-[11px] text-rose-500 mt-1">{errors.reason.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Symptoms / Additional Notes <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <textarea
                  {...register('symptoms')}
                  rows={3}
                  placeholder="Describe your current symptoms or any relevant medical history..."
                  className="w-full p-3 bg-accent/30 border border-border/60 rounded-xl text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none resize-none"
                />
              </div>
            </div>
          )}

          {/* Step 3: Review & Confirm */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-foreground font-display">Review & Confirm Booking</h2>
              <AppointmentSummary formData={getValues()} selectedDoctor={selectedDoctor} />
              <p className="text-xs text-muted-foreground text-center">
                By confirming, you agree to the appointment booking terms and the clinic's cancellation policy.
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => (step === 0 ? navigate(-1) : setStep(step - 1))}
          className="flex items-center space-x-1.5 px-4 py-2.5 bg-card border border-border/60 text-foreground text-xs font-semibold rounded-xl hover:bg-accent transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{step === 0 ? 'Cancel' : 'Back'}</span>
        </button>

        {step < 3 ? (
          <button
            type="button"
            onClick={() => {
              if (step === 0 && !watchedDoctorId) return;
              if (step === 1 && (!getValues('date') || !watchedSlot)) return;
              setStep(step + 1);
            }}
            className="flex items-center space-x-1.5 px-5 py-2.5 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/90 shadow-md shadow-primary/20 transition-all"
          >
            <span>Continue</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={bookMutation.isPending}
            className="flex items-center space-x-1.5 px-5 py-2.5 bg-emerald-500 text-white text-xs font-bold rounded-xl hover:bg-emerald-600 shadow-md transition-all disabled:opacity-60"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{bookMutation.isPending ? 'Booking...' : 'Confirm Appointment'}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default BookAppointmentPage;
