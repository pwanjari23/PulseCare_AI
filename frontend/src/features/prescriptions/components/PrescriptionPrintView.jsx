import React from 'react';
import { formatPrescriptionDate, generatePrescriptionCode } from '../utils/prescription.utils';

export const PrescriptionPrintView = ({ prescription }) => {
  if (!prescription) return null;

  const code = generatePrescriptionCode(prescription.id);
  const docName = prescription.doctor ? `${prescription.doctor.user?.firstName || prescription.doctor.firstName || ''} ${prescription.doctor.user?.lastName || prescription.doctor.lastName || ''}`.trim() : 'Doctor';
  const patName = prescription.patient ? `${prescription.patient.firstName || ''} ${prescription.patient.lastName || ''}`.trim() : 'Patient';

  return (
    <div className="hidden print:block print:p-8 print:bg-white print:text-black font-serif text-sm">
      <div className="border-b-2 border-black pb-4 mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-wider">PulseCare AI Medical Center</h1>
          <p className="text-xs">Advanced Telehealth & Clinical Care</p>
          <p className="text-xs">Email: support@pulsecare.ai | Tel: +1 (800) 555-PULSE</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold font-mono">{code}</p>
          <p className="text-xs">Date: {formatPrescriptionDate(prescription.prescribedAt || prescription.createdAt)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 text-xs border p-3 rounded">
        <div>
          <p className="font-bold uppercase text-[10px] text-gray-600">Prescribing Doctor:</p>
          <p className="font-bold text-sm">{docName}</p>
          {prescription.doctor?.specialization && <p>{prescription.doctor.specialization}</p>}
        </div>
        <div>
          <p className="font-bold uppercase text-[10px] text-gray-600">Patient Details:</p>
          <p className="font-bold text-sm">{patName}</p>
          {prescription.patient?.gender && <p>Gender: {prescription.patient.gender}</p>}
        </div>
      </div>

      {prescription.diagnosis && (
        <div className="mb-6">
          <p className="font-bold text-xs uppercase">Diagnosis:</p>
          <p className="text-sm italic">{prescription.diagnosis}</p>
        </div>
      )}

      <div className="mb-8">
        <h3 className="font-bold text-base border-b mb-3">Rx - Prescribed Medications</h3>
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2">#</th>
              <th className="py-2">Medication</th>
              <th className="py-2">Dosage</th>
              <th className="py-2">Frequency</th>
              <th className="py-2">Duration</th>
              <th className="py-2">Instructions</th>
            </tr>
          </thead>
          <tbody>
            {(prescription.items || []).map((med, i) => (
              <tr key={i} className="border-b">
                <td className="py-2">{i + 1}</td>
                <td className="py-2 font-bold">{med.medicationName || med.name}</td>
                <td className="py-2">{med.dosage}</td>
                <td className="py-2">{med.frequency}</td>
                <td className="py-2">{med.durationDays} Days</td>
                <td className="py-2">{med.instructions || 'As directed'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {prescription.clinicalNotes && (
        <div className="mb-6">
          <p className="font-bold text-xs uppercase">Additional Doctor Advice:</p>
          <p className="text-xs bg-gray-100 p-3 rounded">{prescription.clinicalNotes}</p>
        </div>
      )}

      <div className="mt-16 pt-4 border-t flex justify-between items-end text-xs">
        <div>
          <p className="text-[10px] text-gray-500">Valid without physical signature if verified online.</p>
        </div>
        <div className="text-center">
          <div className="w-32 border-b border-black mb-1" />
          <p className="font-bold">{docName}</p>
          <p className="text-[10px]">Authorized Signature</p>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionPrintView;
