import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Activity, Heart, Thermometer, Zap, Clock, User, Pencil, Trash2, FileText } from 'lucide-react';
import { useVital } from '../hooks/useVital';
import VitalStatusBadge from '../components/VitalStatusBadge';
import VitalMetricCard from '../components/VitalMetricCard';
import VitalReferenceRange from '../components/VitalReferenceRange';
import VitalSkeleton from '../components/VitalSkeleton';
import { formatBP, formatLoggedDate, calculateBMI, getBMICategory } from '../utils/vital.utils';
import { useAuthStore } from '../../../stores/auth.store';
import { ROLES } from '../../../constants/roles';

export const VitalDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isDoctor = user?.role?.toLowerCase() === ROLES.DOCTOR.toLowerCase();

  const { data: record, isLoading, error } = useVital(id);

  if (isLoading) return <VitalSkeleton count={2} />;
  if (error || !record) {
    return (
      <div className="text-center py-12 bg-card border border-border/60 rounded-3xl max-w-md mx-auto space-y-3 font-sans">
        <p className="text-sm font-bold text-foreground">Vital record not found</p>
        <p className="text-xs text-muted-foreground">{error?.message || 'Invalid or missing record ID.'}</p>
        <Link to="/vitals" className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl inline-block">
          Back to Vitals
        </Link>
      </div>
    );
  }

  const bmi = calculateBMI(record.weight, record.height);
  const bmiCat = getBMICategory(bmi);

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 rounded-xl hover:bg-accent text-muted-foreground hover:text-foreground border border-border/60 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-extrabold text-foreground font-display">Vital Record #{record.id}</h1>
              <VitalStatusBadge record={record} />
            </div>
            <p className="text-xs text-muted-foreground flex items-center space-x-1 mt-0.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Logged on {formatLoggedDate(record.loggedAt || record.createdAt)}</span>
            </p>
          </div>
        </div>

        {isDoctor && (
          <div className="flex items-center space-x-2">
            <Link
              to={`/vitals/${record.id}/edit`}
              className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/90 shadow-md transition-all flex items-center space-x-1.5"
            >
              <Pencil className="w-4 h-4" />
              <span>Edit</span>
            </Link>
          </div>
        )}
      </div>

      {/* Patient Info Card */}
      {record.patient && (
        <div className="bg-card border border-border/60 rounded-3xl p-5 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-lg">
            {record.patient.firstName?.[0] || 'P'}
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground font-display">
              {record.patient.firstName} {record.patient.lastName}
            </h3>
            <p className="text-xs text-muted-foreground flex items-center space-x-2 mt-0.5">
              <span>Patient ID: #{record.patient.id}</span>
              {record.patient.gender && <span>• {record.patient.gender}</span>}
              {record.patient.bloodGroup && <span>• Blood Group: {record.patient.bloodGroup}</span>}
            </p>
          </div>
        </div>
      )}

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <VitalMetricCard
          title="Blood Pressure"
          value={formatBP(record.systolicBp, record.diastolicBp)}
          icon={Activity}
          metricKey="SYSTOLIC_BP"
          subtext={`Systolic: ${record.systolicBp} | Diastolic: ${record.diastolicBp}`}
        />
        <VitalMetricCard
          title="Heart Rate"
          value={record.heartRate}
          unit="BPM"
          icon={Heart}
          metricKey="HEART_RATE"
        />
        <VitalMetricCard
          title="SpO₂ Saturation"
          value={record.oxygenLevel}
          unit="%"
          icon={Zap}
          metricKey="OXYGEN_LEVEL"
        />
        <VitalMetricCard
          title="Body Temp"
          value={record.temperature}
          unit="°F"
          icon={Thermometer}
          metricKey="TEMPERATURE"
        />
      </div>

      {/* Secondary Biometrics */}
      <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-foreground font-display">Secondary & Metabolic Metrics</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-accent/30 rounded-2xl space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-mono">Respiratory Rate</span>
            <p className="text-sm font-bold text-foreground font-mono">{record.respiratoryRate ? `${record.respiratoryRate} bpm` : 'N/A'}</p>
          </div>
          <div className="p-3 bg-accent/30 rounded-2xl space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-mono">Weight & Height</span>
            <p className="text-sm font-bold text-foreground font-mono">{record.weight ? `${record.weight}kg` : '--'} / {record.height ? `${record.height}cm` : '--'}</p>
          </div>
          <div className="p-3 bg-accent/30 rounded-2xl space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-mono">Calculated BMI</span>
            <p className="text-sm font-bold text-foreground font-mono">{bmi ? `${bmi} (${bmiCat.label})` : 'N/A'}</p>
          </div>
          <div className="p-3 bg-accent/30 rounded-2xl space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-mono">Blood Glucose</span>
            <p className="text-sm font-bold text-foreground font-mono">{record.bloodGlucoseMgdl ? `${record.bloodGlucoseMgdl} mg/dL` : 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Notes & Observations */}
      {record.notes && (
        <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-2">
          <h3 className="text-sm font-bold text-foreground font-display flex items-center space-x-2">
            <FileText className="w-4 h-4 text-amber-500" />
            <span>Clinical Notes</span>
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed bg-accent/20 p-4 rounded-2xl border border-border/40 font-mono">
            {record.notes}
          </p>
        </div>
      )}

      {/* Clinical reference ranges */}
      <VitalReferenceRange />
    </div>
  );
};

export default VitalDetailsPage;
