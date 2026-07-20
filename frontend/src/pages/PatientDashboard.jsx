import React from 'react';
import { 
  Heart, 
  Activity, 
  Thermometer, 
  Scale, 
  Calendar, 
  Search, 
  Video, 
  MessageSquare,
  ArrowRight,
  Plus,
  Compass,
  Smile,
  ShieldCheck,
  BrainCircuit,
  ArrowUpRight
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import PageHeader from '../components/common/PageHeader';

export const PatientDashboard = () => {
  return (
    <div className="space-y-8">
      {/* Search Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface p-4 rounded-2xl border border-border-subtle shadow-sm">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-text" />
          <input 
            type="text" 
            placeholder="Search tasks, appointment times, or doctor name..." 
            className="w-full pl-10 pr-4 py-2 text-sm bg-bg border border-border-subtle rounded-xl focus:outline-none focus:border-medical-500 transition-colors"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1 bg-success-500/10 text-success-500 border border-success-500/20 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse" />
            Clinical Records Synced
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Middle Content Hub (Left Part) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Row 1: Vitals Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-surface border border-border-subtle rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-text font-semibold uppercase tracking-wider">Heart Rate</span>
                <Heart className="h-5 w-5 text-danger-500 fill-current animate-pulse" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold font-display text-primary-text">72 <span className="text-xs font-normal text-muted-text">BPM</span></h3>
                <span className="text-[10px] text-success-500 font-semibold block mt-1.5">✓ Normal Resting</span>
              </div>
            </div>

            <div className="p-4 bg-surface border border-border-subtle rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-text font-semibold uppercase tracking-wider">Total Weight</span>
                <Scale className="h-5 w-5 text-medical-600" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold font-display text-primary-text">65 <span className="text-xs font-normal text-muted-text">KG</span></h3>
                <span className="text-[10px] text-secondary-text font-semibold block mt-1.5">Optimal BMI Range</span>
              </div>
            </div>

            <div className="p-4 bg-surface border border-border-subtle rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-text font-semibold uppercase tracking-wider">Blood Pressure</span>
                <Activity className="h-5 w-5 text-healing-500" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold font-display text-primary-text">120/80 <span className="text-xs font-normal text-muted-text">mmHg</span></h3>
                <span className="text-[10px] text-success-500 font-semibold block mt-1.5">✓ IdealBP Range</span>
              </div>
            </div>

            <div className="p-4 bg-surface border border-border-subtle rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-text font-semibold uppercase tracking-wider">Body Temp</span>
                <Thermometer className="h-5 w-5 text-warning-500" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold font-display text-primary-text">98.6 <span className="text-xs font-normal text-muted-text">°F</span></h3>
                <span className="text-[10px] text-success-500 font-semibold block mt-1.5">✓ Normal Range</span>
              </div>
            </div>
          </div>

          {/* Row 2: Checkup Schedule Calendar Cards */}
          <div className="p-6 bg-surface border border-border-subtle rounded-3xl shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-primary-text">Regular Checkup Schedule</h3>
                <p className="text-xs text-muted-text mt-0.5">Assigned primary care specialists</p>
              </div>
              <span className="text-xs font-mono bg-bg px-2.5 py-1 rounded-lg border border-border-subtle">Sept 2026</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-bg/50 border border-border-subtle hover:border-medical-500/30 transition-all flex flex-col justify-between gap-4">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-medical-500/10 text-medical-600 border border-medical-500/20 font-bold flex items-center justify-center text-sm">
                      DR
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-primary-text">Dr. Dianne Russell</h4>
                      <p className="text-[11px] text-muted-text mt-0.5">Cardiologist • Specialist</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-medical-600/10 text-medical-600 px-2 py-0.5 rounded-md font-semibold">10:00 AM</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="primary" size="sm" className="w-full flex items-center justify-center gap-1.5 py-2">
                    <Video className="h-3.5 w-3.5" /> Start Telehealth Call
                  </Button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-bg/50 border border-border-subtle hover:border-medical-500/30 transition-all flex flex-col justify-between gap-4">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-healing-500/10 text-healing-500 border border-healing-500/20 font-bold flex items-center justify-center text-sm">
                      DL
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-primary-text">Dr. Devon Lane</h4>
                      <p className="text-[11px] text-muted-text mt-0.5">Optometrist • Primary Care</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-healing-600/10 text-healing-600 px-2 py-0.5 rounded-md font-semibold">2:00 PM</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="w-full flex items-center justify-center gap-1.5 py-2">
                    <Video className="h-3.5 w-3.5 text-muted-text" /> Start Telehealth Call
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Explore Departments */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-primary-text">Explore Clinical Departments</h3>
              <span className="text-xs text-medical-600 font-semibold flex items-center gap-0.5 cursor-pointer">
                See All <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { name: 'Cardiology', icon: Heart, count: '12 Specialists', color: 'text-danger-500 bg-danger-500/10 border-danger-500/20' },
                { name: 'Pediatrics', icon: Smile, count: '8 Specialists', color: 'text-healing-600 bg-healing-600/10 border-healing-600/20' },
                { name: 'Neurology', icon: BrainCircuit, count: '4 Specialists', color: 'text-primary-600 bg-primary-600/10 border-primary-500/20' },
                { name: 'Diagnostics', icon: Compass, count: '16 Labs', color: 'text-warning-600 bg-warning-600/10 border-warning-500/20' }
              ].map((dept, idx) => {
                const Icon = dept.icon;
                return (
                  <div key={idx} className="p-4 rounded-2xl bg-surface border border-border-subtle hover:border-medical-500/30 transition-all text-left shadow-sm hover:shadow cursor-pointer">
                    <div className={`p-2.5 rounded-xl border w-fit ${dept.color} mb-3`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h4 className="text-sm font-bold text-primary-text">{dept.name}</h4>
                    <p className="text-[10px] text-muted-text mt-0.5">{dept.count}</p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Side Panel (Right Part) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Action Button: Book Appointment */}
          <Button variant="primary" className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm shadow-lg shadow-medical-600/20">
            <Plus className="h-4.5 w-4.5" /> Add New Appointment
          </Button>

          {/* Calendar Widget */}
          <div className="p-5 bg-surface border border-border-subtle rounded-3xl shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-border-subtle pb-3">
              <h4 className="text-sm font-bold text-primary-text">Health Calendar</h4>
              <span className="text-[10px] uppercase font-mono font-bold text-muted-text">Dec 2026</span>
            </div>
            
            {/* Mock Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                <span key={d} className="text-[10px] font-bold text-muted-text py-1">{d}</span>
              ))}
              {Array.from({ length: 31 }, (_, i) => {
                const day = i + 1;
                const isToday = day === 13;
                const hasAppointment = day === 13 || day === 25;
                return (
                  <button 
                    key={i} 
                    className={`py-1.5 rounded-lg text-xs font-semibold cursor-pointer relative ${
                      isToday 
                        ? 'bg-medical-600 text-white font-bold' 
                        : 'hover:bg-bg text-secondary-text'
                    }`}
                  >
                    {day}
                    {hasAppointment && !isToday && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-medical-600" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Doctor Assistant Prompter */}
          <div className="p-5 bg-gradient-to-br from-medical-600/10 via-healing-500/5 to-surface border border-medical-500/20 rounded-3xl shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 text-medical-600/20 pointer-events-none">
              <BrainCircuit className="h-14 w-14" />
            </div>

            <div className="flex gap-2.5 items-center mb-3">
              <div className="p-2 rounded-xl bg-medical-600 text-white shadow-sm">
                <BrainCircuit className="h-4.5 w-4.5 animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-primary-text">AI Clinical Assistant</h4>
                <p className="text-[10px] text-muted-text">24/7 Symptom Triage Desk</p>
              </div>
            </div>

            <p className="text-[11px] text-secondary-text leading-relaxed mb-4">
              "Ask about your heart logs, medication schedules, or upload diagnostic reports for instant summarizations."
            </p>

            <div className="relative">
              <input 
                type="text" 
                placeholder="Ask query..." 
                className="w-full pl-3.5 pr-10 py-2.5 text-xs bg-surface border border-border-subtle rounded-xl focus:outline-none focus:border-medical-500 transition-colors shadow-inner"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-medical-600 text-white hover:bg-medical-700 transition-all cursor-pointer">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Connected Care Team */}
          <div className="p-5 bg-surface border border-border-subtle rounded-3xl shadow-sm space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-text">Popular Specialists</h4>
            <div className="space-y-3">
              {[
                { name: 'Dr. Bessie Cooper', role: 'Cardiologist', rating: '4.8 (5.8K reviews)' },
                { name: 'Dr. Savannah Nguyen', role: 'Optometrist', rating: '5.0 (1.2K reviews)' }
              ].map((doc, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 hover:bg-bg/50 rounded-xl transition-all">
                  <div className="flex gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-medical-500/10 text-medical-600 flex items-center justify-center font-bold text-xs">
                      {doc.name.charAt(4)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-primary-text">{doc.name}</p>
                      <p className="text-[9px] text-muted-text mt-0.5">{doc.role} • {doc.rating}</p>
                    </div>
                  </div>
                  <span className="p-1 text-muted-text hover:text-medical-600 cursor-pointer">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default PatientDashboard;
