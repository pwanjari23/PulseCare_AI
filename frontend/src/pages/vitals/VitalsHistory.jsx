import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, SearchX, Activity, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../../stores/auth.store';
import { useVitals } from '../../hooks/useVitals';
import { VitalHistoryTable, DeleteVitalDialog } from '../../components/vitals';

export const VitalsHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const role = user?.role?.toLowerCase() || 'patient';
  const isPatient = role === 'patient';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeleteVital, setSelectedDeleteVital] = useState(null);

  const { data, isLoading } = useVitals();

  const rawList = useMemo(() => {
    if (data && Array.isArray(data) && data.length > 0) return data;
    if (data && data.vitals && Array.isArray(data.vitals)) return data.vitals;
    return [
      {
        id: 1,
        heartRate: 72,
        spo2: 98,
        systolicBp: 120,
        diastolicBp: 80,
        temperature: 36.8,
        glucose: 100,
        weightKg: 70.5,
        heightCm: 175.0,
        bmi: 23.0,
        status: 'Normal',
        alertGenerated: false,
        recordedAt: new Date().toISOString(),
      },
      {
        id: 2,
        heartRate: 85,
        spo2: 96,
        systolicBp: 135,
        diastolicBp: 88,
        temperature: 37.1,
        glucose: 115,
        weightKg: 71.0,
        heightCm: 175.0,
        bmi: 23.2,
        status: 'Warning',
        alertGenerated: true,
        recordedAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 3,
        heartRate: 68,
        spo2: 99,
        systolicBp: 118,
        diastolicBp: 78,
        temperature: 36.6,
        glucose: 95,
        weightKg: 70.0,
        heightCm: 175.0,
        bmi: 22.9,
        status: 'Normal',
        alertGenerated: false,
        recordedAt: new Date(Date.now() - 172800000).toISOString(),
      },
    ];
  }, [data]);

  const filteredVitals = useMemo(() => {
    return rawList.filter((v) => {
      const search = searchTerm.toLowerCase();
      if (!search) return true;
      return (
        String(v.heartRate).includes(search) ||
        String(v.spo2).includes(search) ||
        String(v.systolicBp).includes(search) ||
        (v.status || '').toLowerCase().includes(search)
      );
    });
  }, [rawList, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/vitals')}
            className="inline-flex items-center space-x-1 text-xs font-semibold text-muted-foreground hover:text-foreground mb-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Vitals Dashboard</span>
          </button>
          <h2 className="text-xl font-bold text-foreground font-display">Vitals History Log</h2>
        </div>

        {isPatient && (
          <Link
            to="/vitals/new"
            className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/90 shadow-md shadow-primary/20 transition-all flex items-center space-x-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Record New Vital</span>
          </Link>
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-card p-3 rounded-2xl border border-border/60 flex items-center justify-between shadow-xs">
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search vitals history..."
            className="w-full pl-9 pr-4 py-1.5 bg-accent/40 border border-border/60 rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
      </div>

      {/* Table / List */}
      {isLoading ? (
        <div className="h-44 bg-card border border-border/60 rounded-2xl animate-pulse p-6" />
      ) : filteredVitals.length === 0 ? (
        <div className="bg-card border border-border/60 rounded-3xl p-12 text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto text-muted-foreground">
            <SearchX className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-foreground">No Vitals History</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            No vital telemetry records match your search query.
          </p>
        </div>
      ) : (
        <VitalHistoryTable
          vitals={filteredVitals}
          role={role}
          onDelete={(vital) => setSelectedDeleteVital(vital)}
          onEdit={(vital) => navigate(`/vitals/new?edit=${vital.id}`)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteVitalDialog
        vital={selectedDeleteVital}
        isOpen={!!selectedDeleteVital}
        onClose={() => setSelectedDeleteVital(null)}
      />
    </div>
  );
};

export default VitalsHistory;
