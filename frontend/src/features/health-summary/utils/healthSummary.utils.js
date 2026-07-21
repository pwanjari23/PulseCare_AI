/**
 * PulseCare AI - Health Summary Utility Helpers
 */

import { RISK_LEVELS } from '../constants/healthSummary.constants';

/**
 * Calculates a dynamic overall health score (0 - 100)
 */
export const calculateOverallScore = (summaryData) => {
  if (!summaryData) return 85;

  let score = 100;
  const riskLevel = summaryData.riskLevel || RISK_LEVELS.LOW;
  const riskFactors = summaryData.riskFactors || [];
  const activeAlerts = summaryData.activeAlerts || [];

  // Deduct based on risk level
  if (riskLevel === RISK_LEVELS.CRITICAL) score -= 45;
  else if (riskLevel === RISK_LEVELS.HIGH) score -= 30;
  else if (riskLevel === RISK_LEVELS.MEDIUM) score -= 15;

  // Deduct for specific risk factors
  score -= Math.min(riskFactors.length * 5, 20);

  // Deduct for active vitals alerts
  score -= Math.min(activeAlerts.length * 8, 24);

  return Math.max(score, 15);
};

/**
 * Formats date into human readable string
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'N/A';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
};

/**
 * Formats relative time (e.g. '2 hours ago', 'Just now')
 */
export const formatTimeAgo = (dateStr) => {
  if (!dateStr) return 'Recently';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'Recently';

  const seconds = Math.floor((new Date() - d) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(dateStr);
};

/**
 * Evaluates individual vital metric status
 */
export const evaluateVitalStatus = (key, value, secondValue = null) => {
  if (value === null || value === undefined) return { status: 'UNKNOWN', label: 'No Data', color: 'text-muted-foreground' };

  switch (key) {
    case 'bloodPressure':
      if (value >= 140 || secondValue >= 90) return { status: 'HIGH', label: 'Elevated', color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' };
      if (value < 90 || secondValue < 60) return { status: 'LOW', label: 'Low', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' };
      return { status: 'NORMAL', label: 'Normal', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' };

    case 'heartRate':
      if (value > 100) return { status: 'HIGH', label: 'Tachycardia', color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' };
      if (value < 60) return { status: 'LOW', label: 'Bradycardia', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' };
      return { status: 'NORMAL', label: 'Normal', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' };

    case 'bloodGlucoseMgdl':
      if (value > 140) return { status: 'HIGH', label: 'Elevated', color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' };
      if (value < 70) return { status: 'LOW', label: 'Low Sugar', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' };
      return { status: 'NORMAL', label: 'Optimal', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' };

    case 'oxygenLevel':
      if (value < 90) return { status: 'CRITICAL', label: 'Hypoxia', color: 'text-rose-500 bg-rose-500/10 border-rose-500/20 animate-pulse' };
      if (value < 95) return { status: 'WARNING', label: 'Slightly Low', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' };
      return { status: 'NORMAL', label: 'Optimal', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' };

    case 'temperature':
      if (value > 100.4) return { status: 'HIGH', label: 'Fever', color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' };
      if (value < 96.0) return { status: 'LOW', label: 'Hypothermia', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' };
      return { status: 'NORMAL', label: 'Normal', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' };

    case 'bmi':
      if (value >= 30) return { status: 'HIGH', label: 'Obese', color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' };
      if (value >= 25) return { status: 'WARNING', label: 'Overweight', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' };
      if (value < 18.5) return { status: 'WARNING', label: 'Underweight', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' };
      return { status: 'NORMAL', label: 'Healthy BMI', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' };

    default:
      return { status: 'NORMAL', label: 'Normal', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' };
  }
};

/**
 * Extracts and normalizes timeline events from health summary
 */
export const extractTimelineEvents = (summaryData) => {
  if (!summaryData) return [];

  const events = [];

  // Vitals Update Event
  if (summaryData.latestVitals) {
    events.push({
      id: `vital-${summaryData.latestVitals.id || 1}`,
      type: 'VITALS_UPDATE',
      title: 'Vitals Recorded',
      description: `BP: ${summaryData.latestVitals.systolicBp || '--'}/${summaryData.latestVitals.diastolicBp || '--'} mmHg, HR: ${summaryData.latestVitals.heartRate || '--'} bpm, SpO₂: ${summaryData.latestVitals.oxygenLevel || '--'}%`,
      date: summaryData.latestVitals.loggedAt || new Date(),
    });
  }

  // AI Summary Event
  if (summaryData.generatedAt) {
    events.push({
      id: `ai-summary-${new Date(summaryData.generatedAt).getTime()}`,
      type: 'AI_SUMMARY_GENERATED',
      title: 'AI Health Assessment Generated',
      description: `Clinical risk index determined as ${summaryData.riskLevel || 'LOW'}.`,
      date: summaryData.generatedAt,
    });
  }

  // Appointments
  (summaryData.recentAppointments || []).forEach((appt) => {
    events.push({
      id: `appt-${appt.id}`,
      type: 'APPOINTMENT',
      title: `Appointment: ${appt.reason || 'Routine Consultation'}`,
      description: appt.doctor ? `Doctor: Dr. ${appt.doctor.firstName} ${appt.doctor.lastName}` : `Status: ${appt.status}`,
      date: appt.appointmentAt,
    });
  });

  // Prescriptions
  (summaryData.recentPrescriptions || []).forEach((presc) => {
    events.push({
      id: `presc-${presc.id}`,
      type: 'PRESCRIPTION',
      title: `Prescription Prescribed: ${presc.diagnosis || 'General Treatment'}`,
      description: `${(presc.medicines || []).length} medication(s) prescribed.`,
      date: presc.prescribedAt,
    });
  });

  // Doctor Notes
  (summaryData.recentDoctorNotes || []).forEach((note) => {
    events.push({
      id: `note-${note.id}`,
      type: 'DOCTOR_NOTE',
      title: `Clinical Note: ${note.title || 'Consultation Note'}`,
      description: note.note ? note.note.substring(0, 80) + '...' : 'Clinical examination note.',
      date: note.createdAt,
    });
  });

  // Sort descending by date
  return events.sort((a, b) => new Date(b.date) - new Date(a.date));
};
