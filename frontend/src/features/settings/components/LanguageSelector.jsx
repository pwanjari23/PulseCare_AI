/**
 * PulseCare AI - LanguageSelector Component
 */

import React from 'react';
import { Globe } from 'lucide-react';
import { LANGUAGES } from '../constants/settings.constants';

export const LanguageSelector = ({ value = 'en-US', onChange, className = '' }) => {
  return (
    <div className={`space-y-1.5 font-sans ${className}`}>
      <label htmlFor="language-select" className="text-xs font-bold text-foreground flex items-center gap-1.5">
        <Globe className="w-4 h-4 text-primary" /> Display Language
      </label>
      <select
        id="language-select"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full px-3.5 py-2.5 bg-accent/40 hover:bg-accent/60 focus:bg-card border border-border/60 focus:border-primary rounded-2xl text-xs text-foreground outline-none transition-all shadow-2xs font-semibold"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
