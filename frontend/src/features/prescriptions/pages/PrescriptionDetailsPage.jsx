import React, { useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Download, Pencil, FileText, Calendar, User, Stethoscope, CheckCircle } from 'lucide-react';
import { usePrescription } from '../hooks/usePrescription';
import PrescriptionMedicineTable from '../components/PrescriptionMedicineTable';
import PrescriptionStatusBadge from '../components/PrescriptionStatusBadge';
import PrescriptionPrintView from '../components/PrescriptionPrintView';
import PrescriptionSkeleton from '../components/PrescriptionSkeleton';
import { formatPrescriptionDate, generatePrescriptionCode } from '../utils/prescription.utils';
import { useAuthStore } from '../../../stores/auth.store';
import { ROLES } from '../../../constants/roles';
import { toast } from 'react-hot-toast';

export const PrescriptionDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isDoctor = user?.role?.toLowerCase() === ROLES.DOCTOR.toLowerCase();

  const { data: prescription, isLoading, error } = usePrescription(id);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    toast.success('Prescription document generated for download');
    window.print();
  };

  if (isLoading) return <PrescriptionSkeleton count={2} />;

  if (error || !prescription) {
    return (
      <div className="text-center py-12 bg-card border border-border/60 rounded-3xl max-w-md mx-auto space-y-3 font-sans">
        <p className="text-sm font-bold text-foreground">Prescription record not found</p>
        <p className="text-xs text-muted-foreground">{error?.message || 'Invalid or missing prescription ID.'}</p>
        <Link to="/prescriptions" className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl inline-block">
          Back to Prescriptions
        </Link>
      </div>
    );
  }

  const code = generatePrescriptionCode(prescription.id);
  const docName = prescription.doctor ? `${prescription.doctor.user?.firstName || prescription.doctor.firstName || ''} ${prescription.doctor.user?.lastName || prescription.doctor.lastName || ''}`.trim() : 'Doctor';
  const patName = prescription.patient ? `${prescription.patient.firstName || ''} ${prescription.patient.lastName || ''}`.trim() : 'Patient';

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans">
      {/* Print View target */}
      <PrescriptionPrintView prescription={prescription} />

      {/* Screen Header Controls (Hidden on print) */}
      <div className="flex items-center justify-between print:hidden">
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
              <h1 className="text-2xl font-extrabold text-foreground font-display">{code}</h1>
              <PrescriptionStatusBadge status={prescription.status || 'Active'} />
            </div>
            <p className="text-xs text-muted-foreground flex items-center space-x-1 mt-0.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Issued on {formatPrescriptionDate(prescription.prescribedAt || prescription.createdAt)}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-card border border-border/60 hover:bg-accent text-foreground text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5"
          >
            <Printer className="w-4 h-4 text-primary" />
            <span>Print</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-3.5 py-2 bg-card border border-border/60 hover:bg-accent text-foreground text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4 text-emerald-500" />
            <span>Download</span>
          </button>

          {isDoctor && (
            <Link
              to={`/prescriptions/${prescription.id}/edit`}
              className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/90 shadow-md transition-all flex items-center space-x-1.5"
            >
              <Pencil className="w-4 h-4" />
              <span>Edit</span>
            </Link>
          )}
        </div>
      </div>

      {/* Main Prescription Details Card (Hidden on print) */}
      <div className="bg-card border border-border/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 print:hidden">
        {/* Participants Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-accent/20 border border-border/40 space-y-1">
            <span className="text-[10px] text-muted-foreground font-mono uppercase flex items-center gap-1">
              <Stethoscope className="w-3.5 h-3.5 text-primary" /> Prescribing Doctor
            </span>
            <p className="text-sm font-bold text-foreground">{docName}</p>
            {prescription.doctor?.specialization && <p className="text-muted-foreground">{prescription.doctor.specialization}</p>}
          </div>

          <div className="p-4 rounded-2xl bg-accent/20 border border-border/40 space-y-1">
            <span className="text-[10px] text-muted-foreground font-mono uppercase flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-sky-500" /> Patient Info
            </span>
            <p className="text-sm font-bold text-foreground">{patName}</p>
            <p className="text-muted-foreground">Patient Record #{prescription.patientId}</p>
          </div>
        </div>

        {/* Clinical Diagnosis */}
        {prescription.diagnosis && (
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl text-xs space-y-1">
            <span className="font-bold text-primary uppercase text-[10px] tracking-wider">Clinical Diagnosis</span>
            <p className="text-foreground font-semibold text-sm">{prescription.diagnosis}</p>
          </div>
        )}

        {/* Prescribed Medicines Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-foreground font-display flex items-center space-x-2">
            <FileText className="w-4 h-4 text-primary" />
            <span>Prescribed Medicines List ({prescription.items?.length || 0})</span>
          </h3>
          <PrescriptionMedicineTable items={prescription.items || []} />
        </div>

        {/* Clinical Notes & Follow-up */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-4 border-t border-border/40">
          {prescription.clinicalNotes && (
            <div className="space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-mono">Doctor Advice & Notes</span>
              <p className="text-muted-foreground italic bg-accent/20 p-4 rounded-2xl border border-border/40">
                "{prescription.clinicalNotes}"
              </p>
            </div>
          )}

          {prescription.followUpDate && (
            <div className="space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-mono">Recommended Follow-Up</span>
              <p className="text-foreground font-bold font-mono bg-accent/20 p-4 rounded-2xl border border-border/40">
                {formatPrescriptionDate(prescription.followUpDate)}
              </p>
            </div>
          )}
        </div>

        {/* Signature badge */}
        <div className="flex items-center justify-between pt-4 border-t border-border/60 text-xs">
          <div className="flex items-center space-x-1.5 text-emerald-500 font-bold">
            <CheckCircle className="w-4 h-4" />
            <span>Verified Digital Medical Record</span>
          </div>
          <div className="text-right font-mono text-[11px] text-muted-foreground">
            <p className="font-bold text-foreground">{docName}</p>
            <p>PulseCare AI Network</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionDetailsPage;
