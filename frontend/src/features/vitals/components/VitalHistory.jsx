import React, { useState } from 'react';
import { LayoutList, Table, Clock } from 'lucide-react';
import VitalCard from './VitalCard';
import VitalTable from './VitalTable';
import VitalTimeline from './VitalTimeline';

export const VitalHistory = ({ records = [], onEdit, onDelete, canManage = false }) => {
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards' | 'timeline'

  return (
    <div className="space-y-4 font-sans">
      {/* View Switcher */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground font-display">Measurement Logs ({records.length})</h3>
        <div className="flex items-center space-x-1 bg-accent/50 p-1 rounded-xl border border-border/60">
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg text-xs transition-colors flex items-center space-x-1 ${
              viewMode === 'table' ? 'bg-card text-foreground shadow-2xs font-bold' : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Table View"
          >
            <Table className="w-3.5 h-3.5" />
            <span className="text-[11px]">Table</span>
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`p-1.5 rounded-lg text-xs transition-colors flex items-center space-x-1 ${
              viewMode === 'cards' ? 'bg-card text-foreground shadow-2xs font-bold' : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Cards View"
          >
            <LayoutList className="w-3.5 h-3.5" />
            <span className="text-[11px]">Cards</span>
          </button>
          <button
            onClick={() => setViewMode('timeline')}
            className={`p-1.5 rounded-lg text-xs transition-colors flex items-center space-x-1 ${
              viewMode === 'timeline' ? 'bg-card text-foreground shadow-2xs font-bold' : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Timeline View"
          >
            <Clock className="w-3.5 h-3.5" />
            <span className="text-[11px]">Timeline</span>
          </button>
        </div>
      </div>

      {/* Render View */}
      {viewMode === 'table' ? (
        <VitalTable records={records} onEdit={onEdit} onDelete={onDelete} canManage={canManage} />
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {records.map((r) => (
            <VitalCard key={r.id} record={r} onEdit={onEdit} onDelete={onDelete} canManage={canManage} />
          ))}
        </div>
      ) : (
        <VitalTimeline records={records} />
      )}
    </div>
  );
};

export default VitalHistory;
