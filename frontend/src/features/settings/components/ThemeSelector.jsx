/**
 * PulseCare AI - ThemeSelector Component
 */

import React from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { THEMES } from '../constants/settings.constants';

export const ThemeSelector = ({ value = THEMES.SYSTEM, onChange, className = '' }) => {
  const options = [
    { value: THEMES.LIGHT, label: 'Light Mode', icon: Sun },
    { value: THEMES.DARK, label: 'Dark Mode', icon: Moon },
    { value: THEMES.SYSTEM, label: 'System Sync', icon: Laptop },
  ];

  return (
    <div className={`space-y-3 font-sans ${className}`}>
      <h3 className="text-sm font-bold text-foreground font-display">Theme & Color Mode</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {options.map((opt) => {
          const IconComp = opt.icon;
          const isSelected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange?.(opt.value)}
              className={`p-4 rounded-3xl border flex flex-col items-center justify-center space-y-2 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-primary/10 border-primary text-primary shadow-2xs font-bold'
                  : 'bg-card border-border/60 text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              <IconComp className="w-5 h-5" />
              <span className="text-xs">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ThemeSelector;
