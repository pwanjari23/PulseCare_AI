import React, { useState } from 'react';
import { UserCheck, Check, X, Shield, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const DoctorApprovalCard = ({ pendingDoctors = [] }) => {
  const [list, setList] = useState(
    pendingDoctors.length > 0
      ? pendingDoctors
      : [
          { id: 201, firstName: 'Aria', lastName: 'Stark', specialization: 'Neurology', qualification: 'MD, PhD', registeredAt: '2 hours ago', status: 'Pending Verification' },
          { id: 202, firstName: 'Gregory', lastName: 'House', specialization: 'Diagnostic Medicine', qualification: 'MD', registeredAt: 'Yesterday', status: 'Pending Verification' },
          { id: 203, firstName: 'Meredith', lastName: 'Grey', specialization: 'General Surgery', qualification: 'MD, FACS', registeredAt: '2 days ago', status: 'Pending Verification' },
        ]
  );

  const handleApprove = (id, name) => {
    setList((prev) => prev.filter((d) => d.id !== id));
    toast.success(`Approved Dr. ${name}'s practitioner credentials`);
  };

  const handleReject = (id, name) => {
    setList((prev) => prev.filter((d) => d.id !== id));
    toast.error(`Rejected Dr. ${name}'s application request`);
  };

  return (
    <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border/50">
        <div className="flex items-center space-x-2">
          <UserCheck className="w-5 h-5 text-emerald-500" />
          <h3 className="text-base font-bold text-foreground font-display">Pending Doctor Verification Requests</h3>
        </div>
        <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
          {list.length} Pending
        </span>
      </div>

      {list.length === 0 ? (
        <p className="text-xs text-muted-foreground py-6 text-center">No pending doctor approvals.</p>
      ) : (
        <div className="space-y-3">
          {list.map((doc) => (
            <div
              key={doc.id}
              className="p-4 rounded-2xl bg-accent/30 border border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center font-bold">
                  <Shield className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Dr. {doc.firstName} {doc.lastName}</h4>
                  <p className="text-muted-foreground text-[11px]">{doc.specialization} • {doc.qualification}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 justify-end">
                <button
                  onClick={() => handleApprove(doc.id, `${doc.firstName} ${doc.lastName}`)}
                  className="px-3 py-1.5 bg-emerald-500 text-white text-xs font-semibold rounded-xl hover:bg-emerald-600 shadow-xs transition-colors flex items-center space-x-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Approve</span>
                </button>

                <button
                  onClick={() => handleReject(doc.id, `${doc.firstName} ${doc.lastName}`)}
                  className="px-3 py-1.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 text-xs font-semibold rounded-xl border border-rose-500/20 transition-colors flex items-center space-x-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorApprovalCard;
