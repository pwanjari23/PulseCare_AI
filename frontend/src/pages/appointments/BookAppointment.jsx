import React from 'react';
import AppointmentForm from '../../components/appointments/AppointmentForm';

export const BookAppointment = () => {
  return (
    <div className="space-y-6">
      <div className="max-w-3xl mx-auto text-center space-y-1">
        <h2 className="text-2xl font-bold text-foreground font-display">Book a Consultation</h2>
        <p className="text-xs text-muted-foreground">
          Schedule a video or in-clinic appointment with PulseCare AI certified medical practitioners.
        </p>
      </div>

      <AppointmentForm />
    </div>
  );
};

export default BookAppointment;
