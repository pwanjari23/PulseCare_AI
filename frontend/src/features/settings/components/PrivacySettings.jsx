/**
 * PulseCare AI - PrivacySettings Component
 */

import React from 'react';
import { Lock, Eye, FileSpreadsheet } from 'lucide-react';
import NotificationPreferenceCard from './NotificationPreferenceCard';

export const PrivacySettings = ({ className = '' }) => {
  return (
    <div className={`space-y-4 font-sans ${className}`}>
      <h3 className="text-sm font-bold text-foreground font-display flex items-center gap-2">
        <Lock className="w-4 h-4 text-primary" /> Privacy & Clinical Data Sharing
      </h3>

      <div className="space-y-3">
        <NotificationPreferenceCard
          title="Clinical Telemetry Analytics"
          description="Allow anonymized vital telemetry aggregation for predictive AI health model training"
          icon={FileSpreadsheet}
          checked={true}
          onChange={() => {}}
        />
        <NotificationPreferenceCard
          title="Physician Profile Public Visibility"
          description="Enable public patient search indexing for specialty directory"
          icon={Eye}
          checked={true}
          onChange={() => {}}
        />
      </div>
    </div>
  );
};

export default PrivacySettings;
