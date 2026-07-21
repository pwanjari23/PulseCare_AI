/**
 * PulseCare AI - NotificationPreferenceCard Component
 */

import React from 'react';

export const NotificationPreferenceCard = ({ title, description, icon: IconComp, checked, onChange, disabled = false, className = '' }) => {
  return (
    <div className={`p-4 rounded-3xl bg-card border border-border/60 flex items-center justify-between gap-4 font-sans ${className}`}>
      <div className="flex items-center space-x-3.5">
        {IconComp && (
          <div className="p-2.5 rounded-2xl bg-accent/40 text-primary border border-border/40 shrink-0">
            <IconComp className="w-4 h-4" />
          </div>
        )}
        <div>
          <h4 className="text-xs font-bold text-foreground">{title}</h4>
          <p className="text-[11px] text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange?.(!checked)}
        disabled={disabled}
        className={`w-11 h-6 rounded-full transition-colors relative shrink-0 focus:outline-none focus:ring-2 focus:ring-primary ${
          checked ? 'bg-primary' : 'bg-accent border border-border/60'
        }`}
      >
        <span
          className={`w-5 h-5 rounded-full bg-white shadow-2xs transition-transform absolute top-0.5 left-0.5 ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};

export default NotificationPreferenceCard;
