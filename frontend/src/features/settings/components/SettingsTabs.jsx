/**
 * PulseCare AI - SettingsTabs Component
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { SETTINGS_TAB_CONFIG } from '../constants/settings.constants';

export const SettingsTabs = ({ currentRole = 'Admin', className = '' }) => {
  const filteredTabs = SETTINGS_TAB_CONFIG.filter((t) => !t.adminOnly || currentRole === 'Admin');

  return (
    <div className={`flex items-center space-x-2 overflow-x-auto pb-2 border-b border-border/40 font-sans ${className}`}>
      {filteredTabs.map((t) => (
        <NavLink
          key={t.id}
          to={t.route}
          className={({ isActive }) =>
            `px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
              isActive ? 'bg-primary text-primary-foreground shadow-2xs font-bold' : 'bg-accent/40 text-muted-foreground hover:bg-accent'
            }`
          }
        >
          {t.label}
        </NavLink>
      ))}
    </div>
  );
};

export default SettingsTabs;
