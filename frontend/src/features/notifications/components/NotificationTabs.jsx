import React from 'react';

export const NotificationTabs = ({ activeTab, onTabChange, unreadCount = 0, totalCount = 0 }) => {
  const tabs = [
    { id: 'all', label: 'All', count: totalCount },
    { id: 'unread', label: 'Unread', count: unreadCount },
    { id: 'Appointment', label: 'Appointments' },
    { id: 'VitalAlert', label: 'Vitals' },
    { id: 'Prescription', label: 'Prescriptions' },
  ];

  return (
    <div className="flex items-center space-x-1 border-b border-border/60 pb-1 font-sans overflow-x-auto custom-scrollbar">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
              isActive
                ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-accent text-muted-foreground'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default NotificationTabs;
