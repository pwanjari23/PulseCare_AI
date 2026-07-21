/**
 * PulseCare AI - ProfileHeader Component
 */

import React from 'react';

export const ProfileHeader = ({ title, description, children, className = '' }) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans pb-4 border-b border-border/40 ${className}`}>
      <div>
        <h1 className="text-xl font-bold text-foreground font-display">{title}</h1>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      {children && <div className="flex items-center space-x-2">{children}</div>}
    </div>
  );
};

export default ProfileHeader;
