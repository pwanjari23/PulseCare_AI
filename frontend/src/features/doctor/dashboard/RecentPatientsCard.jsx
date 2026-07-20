import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, ChevronRight, User } from 'lucide-react';

export const RecentPatientsCard = ({ patients = [] }) => {
  const navigate = useNavigate();

  const dummyPatients = [
    { id: 101, firstName: 'John', lastName: 'Doe', age: 42, lastVisit: 'Yesterday', status: 'Follow-up' },
    { id: 102, firstName: 'Emma', lastName: 'Watson', age: 29, lastVisit: '3 days ago', status: 'Stable' },
    { id: 103, firstName: 'Robert', lastName: 'Downey', age: 55, lastVisit: '1 week ago', status: 'Routine' },
  ];

  const list = patients.length > 0 ? patients : dummyPatients;

  return (
    <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border/50">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-indigo-500" />
          <h3 className="text-base font-bold text-foreground font-display">Recent Clinical Patients</h3>
        </div>
        <Link
          to="/doctor/patients"
          className="text-xs font-semibold text-primary hover:underline flex items-center space-x-1"
        >
          <span>View Directory</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-2.5">
        {list.slice(0, 5).map((p) => (
          <div
            key={p.id}
            className="p-3.5 rounded-2xl bg-accent/30 border border-border/40 flex items-center justify-between text-xs"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center justify-center font-bold">
                <User className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="font-bold text-foreground">{p.firstName} {p.lastName}</h4>
                <p className="text-muted-foreground text-[11px]">Age: {p.age || 40} • Last visit: {p.lastVisit}</p>
              </div>
            </div>

            <button
              onClick={() => navigate(`/vitals`)}
              className="px-3 py-1 bg-card border border-border/60 text-foreground text-xs font-semibold rounded-lg hover:bg-accent transition-colors"
            >
              Vitals EHR
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentPatientsCard;
