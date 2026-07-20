import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogIn, 
  Key, 
  Mail, 
  Fingerprint, 
  Activity, 
  Stethoscope, 
  ShieldCheck, 
  Loader2,
  Terminal,
  Cpu,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { useAuthStore } from '../stores/auth.store';
import { ROLES } from '../constants/roles';
import { ROUTES } from '../constants/routes';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  
  const [activeRole, setActiveRole] = useState('patient'); // 'patient' | 'doctor' | 'admin'
  const [isScanning, setIsScanning] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const themeColors = {
    patient: {
      accent: 'text-healing-600 bg-healing-600/10 border-healing-600/20',
      pill: 'bg-healing-600',
      glow: 'shadow-[0_0_60px_0_rgba(13,148,136,0.12)]',
      border: 'border-healing-500/30',
      label: 'Patient Portal',
      desc: 'Secure access to vitals logs & prescriptions',
      icon: Activity
    },
    doctor: {
      accent: 'text-medical-600 bg-medical-600/10 border-medical-500/20',
      pill: 'bg-medical-600',
      glow: 'shadow-[0_0_60px_0_rgba(37,99,235,0.12)]',
      border: 'border-medical-500/30',
      label: 'Doctor Console',
      desc: 'Access patient watchlist & scheduling',
      icon: Stethoscope
    },
    admin: {
      accent: 'text-indigo-600 bg-indigo-600/10 border-indigo-500/20',
      pill: 'bg-indigo-600',
      glow: 'shadow-[0_0_60px_0_rgba(79,70,229,0.12)]',
      border: 'border-indigo-500/30',
      label: 'Admin Hub',
      desc: 'Monitor database parameters & security logs',
      icon: ShieldCheck
    }
  };

  const currentTheme = themeColors[activeRole];
  const ThemeIcon = currentTheme.icon;

  const handleBiometricLogin = () => {
    if (isScanning) return;
    setIsScanning(true);

    setTimeout(() => {
      setIsScanning(false);
      
      const formattedRole = activeRole === 'doctor' ? ROLES.DOCTOR : role === 'admin' ? ROLES.ADMIN : ROLES.PATIENT;
      // Wait, role is undefined here, let's use activeRole instead of role!
      const finalRole = activeRole === 'doctor' ? ROLES.DOCTOR : activeRole === 'admin' ? ROLES.ADMIN : ROLES.PATIENT;
      
      const mockUser = { 
        name: `Demo ${finalRole}`, 
        role: finalRole,
        email: `${activeRole}@pulsecare.ai`
      };
      
      login('mock_access_token', 'mock_refresh_token', mockUser);
      
      if (finalRole === ROLES.DOCTOR) navigate(ROUTES.DOCTOR.DASHBOARD);
      else if (finalRole === ROLES.PATIENT) navigate(ROUTES.PATIENT.DASHBOARD);
      else if (finalRole === ROLES.ADMIN) navigate(ROUTES.ADMIN.DASHBOARD);
    }, 1800);
  };

  return (
    <div className={`max-w-5xl w-full bg-surface border border-border-subtle rounded-3xl shadow-2xl overflow-hidden backdrop-blur-md grid grid-cols-1 md:grid-cols-12 min-h-[620px] transition-all duration-500 ${currentTheme.glow}`}>
      
      {/* LEFT COLUMN: High-Fidelity Clinical Telemetry Dashboard Preview (Desktop Only) */}
      <div className="hidden md:flex md:col-span-7 bg-gray-950 text-slate-100 p-8 flex-col justify-between relative overflow-hidden select-none border-r border-border-subtle">
        
        {/* Abstract grid masking */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
        <div className={`absolute top-1/3 left-1/3 w-[300px] h-[300px] opacity-15 rounded-full filter blur-3xl transition-colors duration-500 ${currentTheme.pill}`} />

        {/* Top: Header Info */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-success-500 animate-pulse" />
            <span className="text-[10px] font-bold font-mono text-slate-400 tracking-wider uppercase">Clinical Ops Streamer</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded">Latency: 14ms</span>
        </div>

        {/* Center: Live Heart Rate Graph & Alerts Panel */}
        <div className="relative z-10 my-auto space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold tracking-tight text-white font-display">Live Patient Triage Monitor</h3>
            <p className="text-xs text-slate-400">Simulation of real-time clinical dispatch rules</p>
          </div>

          {/* Graph visual mockup */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300">Heart Rate telemetry (Active)</span>
              <span className="text-healing-400 font-mono flex items-center gap-1 font-bold">
                <Activity className="h-3.5 w-3.5 animate-pulse" /> 72 BPM
              </span>
            </div>
            
            {/* Draw abstract CSS ECG line */}
            <div className="h-16 flex items-end gap-1 pb-1 relative">
              <svg className="absolute inset-0 w-full h-full text-healing-500/30 overflow-visible" preserveAspectRatio="none">
                <path d="M 0 32 L 60 32 L 70 12 L 80 48 L 90 28 L 100 32 L 180 32 L 190 4 L 200 60 L 210 24 L 220 32 L 300 32" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="1 1" className="w-full" />
                <path d="M 0 32 L 60 32 L 70 12 L 80 48 L 90 28 L 100 32 L 180 32 L 190 4 L 200 60 L 210 24 L 220 32 L 300 32" fill="none" stroke="var(--color-healing-500, #0d9488)" strokeWidth="2" strokeDasharray="300" strokeDashoffset="0" className="animate-dash w-full" />
              </svg>
            </div>
          </div>

          {/* Alerts Watchlist Widget */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-danger-500/20 text-danger-500 flex items-center justify-center font-bold text-xs">
                  SC
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Sarah Connor</p>
                  <p className="text-[10px] text-slate-400">Tachycardia Alert</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-md text-[9px] font-bold bg-danger-500/10 text-danger-500 border border-danger-500/20 uppercase">
                112 bpm
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-success-500/20 text-success-500 flex items-center justify-center font-bold text-xs">
                  BW
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Bruce Wayne</p>
                  <p className="text-[10px] text-slate-400">BP Telemetry Stabilized</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-md text-[9px] font-bold bg-success-500/10 text-success-500 border border-success-500/20 uppercase">
                Vitals OK
              </span>
            </div>
          </div>
        </div>

        {/* Bottom: Logs Ticker */}
        <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-4 text-[10px] text-slate-500 font-mono">
          <span className="flex items-center gap-1">
            <Terminal className="h-3.5 w-3.5" /> SECURE SSL ENCRYPTION ACTIVE
          </span>
          <span>SYSTEM V1.0.0</span>
        </div>
      </div>

      {/* RIGHT COLUMN: The Interactive Authentication Console Panel */}
      <div className="md:col-span-5 p-8 flex flex-col justify-between relative bg-surface">
        
        {/* Dynamic selector */}
        <div className="space-y-6">
          <div className="text-left space-y-1">
            <h2 className="text-xl font-extrabold text-primary-text font-display tracking-tight">System Sign In</h2>
            <p className="text-xs text-muted-text">Select authorization scope below</p>
          </div>

          {/* Segmented Controller */}
          <div className="flex bg-bg p-1 rounded-2xl border border-border-subtle relative">
            {['patient', 'doctor', 'admin'].map((role) => (
              <button
                key={role}
                onClick={() => {
                  if (!isScanning) setActiveRole(role);
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl capitalize transition-all relative z-10 cursor-pointer ${
                  activeRole === role 
                    ? 'text-primary-text' 
                    : 'text-muted-text hover:text-secondary-text'
                }`}
              >
                {role}
                {activeRole === role && (
                  <motion.div 
                    layoutId="activeRoleTab"
                    className="absolute inset-0 bg-surface border border-border-subtle rounded-xl shadow-sm -z-10"
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Console Details Text */}
          <div className="p-4 rounded-2xl bg-bg/50 border border-border-subtle flex gap-3 items-start">
            <div className={`p-2 rounded-xl shrink-0 transition-colors duration-300 ${currentTheme.accent}`}>
              <ThemeIcon className="h-4.5 w-4.5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-primary-text">{currentTheme.label} Access</h4>
              <p className="text-[10px] text-muted-text mt-0.5 leading-relaxed">{currentTheme.desc}</p>
            </div>
          </div>

          {/* Biometric circle */}
          <div className="flex flex-col items-center justify-center space-y-2.5 py-2">
            <button
              onClick={handleBiometricLogin}
              disabled={isScanning}
              className={`w-16 h-16 rounded-full border flex items-center justify-center relative cursor-pointer group transition-all duration-300 ${
                isScanning 
                  ? `${currentTheme.border} bg-surface` 
                  : 'bg-bg hover:bg-surface border-border-subtle shadow-sm active:scale-95'
              }`}
            >
              {isScanning && (
                <>
                  <span className={`absolute inset-0 rounded-full opacity-20 animate-ping ${currentTheme.pill}`} />
                  <span className={`absolute -inset-1.5 rounded-full opacity-10 animate-pulse border border-dashed ${currentTheme.accent}`} />
                </>
              )}

              <Fingerprint className={`h-8 w-8 transition-colors duration-300 ${
                isScanning ? 'text-muted-text' : `text-secondary-text group-hover:${activeRole === 'patient' ? 'text-healing-600' : activeRole === 'doctor' ? 'text-medical-600' : 'text-indigo-600'}`
              }`} />

              {isScanning && (
                <motion.div
                  initial={{ y: -24 }}
                  animate={{ y: 24 }}
                  transition={{ repeat: Infinity, repeatType: 'reverse', duration: 0.9, ease: 'easeInOut' }}
                  className={`absolute w-10 h-[2px] opacity-80 blur-[1px] ${currentTheme.pill}`}
                />
              )}
            </button>
            <span className="text-[9px] uppercase font-mono font-bold tracking-widest text-muted-text animate-pulse">
              {isScanning ? 'Syncing credentials...' : 'Quick Bio Scan'}
            </span>
          </div>

          {/* Form Credentials */}
          <form className="space-y-3.5" onSubmit={(e) => e.preventDefault()}>
            <Input
              label="Email Address"
              type="email"
              placeholder={`${activeRole}@pulsecare.ai`}
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl"
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={Key}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl"
            />

            <div className="flex items-center justify-between text-[11px] pt-0.5">
              <label className="flex items-center gap-1.5 cursor-pointer text-muted-text">
                <input type="checkbox" className="rounded border-border-subtle text-medical-600 focus:ring-medical-500 cursor-pointer w-3.5 h-3.5" />
                <span>Keep session active</span>
              </label>
              <Link to="/forgot-password" className="text-medical-600 font-semibold">
                Reset Keys
              </Link>
            </div>

            <Button 
              variant="primary" 
              disabled={isScanning}
              className="w-full mt-2 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all" 
              onClick={handleBiometricLogin}
            >
              {isScanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
              <span>Authorize Connection</span>
            </Button>
          </form>
        </div>

        {/* Console footer link */}
        <div className="text-center pt-6 text-[10px] text-muted-text">
          Protected by PulseCare Security Cloud. <Link to="/" className="text-medical-600 underline font-semibold">Gateway Policies</Link>
        </div>

      </div>

    </div>
  );
};

export default Login;
