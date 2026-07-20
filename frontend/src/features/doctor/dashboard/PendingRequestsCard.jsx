import React from 'react';
import { Clock, Check, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const PendingRequestsCard = () => {
  const requests = [
    { id: 1, patientName: 'Alice Smith', type: 'Appointment Booking Request', time: '15 mins ago' },
    { id: 2, patientName: 'David Miller', type: 'Prescription Refill Request', time: '1 hour ago' },
  ];

  const handleApprove = (name) => {
    toast.success(`Request for ${name} approved successfully`);
  };

  return (
    <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border/50">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-amber-500" />
          <h3 className="text-base font-bold text-foreground font-display">Pending Clinical Requests</h3>
        </div>
        <span className="text-xs font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
          {requests.length} Pending
        </span>
      </div>

      <div className="space-y-2.5">
        {requests.map((req) => (
          <div
            key={req.id}
            className="p-3.5 rounded-2xl bg-accent/30 border border-border/40 flex items-center justify-between text-xs"
          >
            <div>
              <h4 className="font-bold text-foreground">{req.patientName}</h4>
              <p className="text-muted-foreground text-[11px]">{req.type} • {req.time}</p>
            </div>

            <button
              onClick={() => handleApprove(req.patientName)}
              className="px-3 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 text-xs font-semibold rounded-xl transition-colors flex items-center space-x-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Approve</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingRequestsCard;
