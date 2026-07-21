/**
 * PulseCare AI - SessionCard Component
 */

import React from 'react';
import { Laptop, Smartphone, ShieldCheck, LogOut, MapPin, Clock } from 'lucide-react';
import { formatSessionDate } from '../utils/settings.utils';

export const SessionCard = ({ session, onRevoke, isRevoking = false, className = '' }) => {
  const isMobile = session.device?.toLowerCase().includes('phone') || session.device?.toLowerCase().includes('mobile');
  const IconComp = isMobile ? Smartphone : Laptop;

  return (
    <div
      className={`p-4 rounded-3xl border ${
        session.current ? 'bg-primary/5 border-primary/30' : 'bg-card border-border/60'
      } font-sans flex items-center justify-between gap-4 ${className}`}
    >
      <div className="flex items-center space-x-3.5">
        <div className={`p-3 rounded-2xl border ${session.current ? 'bg-primary/10 text-primary border-primary/20' : 'bg-accent/40 text-muted-foreground border-border/40'}`}>
          <IconComp className="w-5 h-5" />
        </div>

        <div className="space-y-0.5">
          <div className="flex items-center space-x-2">
            <h4 className="text-xs font-bold text-foreground">
              {session.browser} on {session.os}
            </h4>
            {session.current && (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                This Device
              </span>
            )}
          </div>

          <div className="flex items-center space-x-3 text-[11px] font-mono text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-muted-foreground" /> {session.location || 'Unknown Location'} ({session.ipAddress})
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-muted-foreground" /> {formatSessionDate(session.lastActive)}
            </span>
          </div>
        </div>
      </div>

      {!session.current && (
        <button
          onClick={() => onRevoke?.(session.id)}
          disabled={isRevoking}
          className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 transition-all text-xs font-bold disabled:opacity-50"
          title="Revoke Session"
        >
          <LogOut className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SessionCard;
