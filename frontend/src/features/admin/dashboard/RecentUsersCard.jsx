import React from 'react';
import { Users, ChevronRight, User } from 'lucide-react';

export const RecentUsersCard = ({ recentUsers = [] }) => {
  const dummyUsers = [
    { id: 301, firstName: 'Alice', lastName: 'Smith', role: 'Patient', registeredAt: '10 mins ago', status: 'Active' },
    { id: 302, firstName: 'Dr. Gregory', lastName: 'House', role: 'Doctor', registeredAt: 'Yesterday', status: 'Pending Approval' },
    { id: 303, firstName: 'Bob', lastName: 'Johnson', role: 'Patient', registeredAt: '2 days ago', status: 'Active' },
  ];

  const list = recentUsers.length > 0 ? recentUsers : dummyUsers;

  return (
    <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border/50">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-primary" />
          <h3 className="text-base font-bold text-foreground font-display">Recent User Registrations</h3>
        </div>
        <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
          User Directory
        </span>
      </div>

      <div className="space-y-2.5">
        {list.map((u) => (
          <div
            key={u.id}
            className="p-3.5 rounded-2xl bg-accent/30 border border-border/40 flex items-center justify-between text-xs"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold">
                <User className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="font-bold text-foreground">{u.firstName} {u.lastName}</h4>
                <p className="text-muted-foreground text-[11px]">{u.role} • Registered {u.registeredAt}</p>
              </div>
            </div>

            <span
              className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${
                u.role === 'Doctor'
                  ? 'bg-healing-500/10 text-healing-600 border-healing-500/20'
                  : 'bg-primary/10 text-primary border-primary/20'
              }`}
            >
              {u.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentUsersCard;
