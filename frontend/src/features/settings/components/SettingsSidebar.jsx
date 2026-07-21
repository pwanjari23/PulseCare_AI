/**
 * PulseCare AI - SettingsSidebar Component
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { User, KeyRound, Shield, Bell, Palette, Globe, FileText } from 'lucide-react';
import { SETTINGS_TAB_CONFIG } from '../constants/settings.constants';

const ICON_MAP = {
  User,
  KeyRound,
  Shield,
  Bell,
  Palette,
  Globe,
  FileText,
};

export const SettingsSidebar = ({ currentRole = 'Admin', className = '' }) => {
  const filteredTabs = SETTINGS_TAB_CONFIG.filter((t) => !t.adminOnly || currentRole === 'Admin');

  return (
    <aside className={`w-full lg:w-64 shrink-0 font-sans ${className}`}>
      <div className="bg-card border border-border/60 rounded-3xl p-3 shadow-xs space-y-1">
        {filteredTabs.map((tab) => {
          const IconComp = ICON_MAP[tab.icon] || User;
          return (
            <NavLink
              key={tab.id}
              to={tab.route}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-2xs font-bold'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`
              }
            >
              <IconComp className="w-4 h-4 shrink-0" />
              <div className="truncate">
                <div>{tab.label}</div>
              </div>
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
};

export default SettingsSidebar;
