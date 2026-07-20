import React from 'react';
import { Check, X } from 'lucide-react';

export const PasswordStrengthIndicator = ({ password = '' }) => {
  const checks = [
    { label: 'At least 8 characters', valid: password.length >= 8 },
    { label: 'One uppercase letter', valid: /[A-Z]/.test(password) },
    { label: 'One lowercase letter', valid: /[a-z]/.test(password) },
    { label: 'One number', valid: /[0-9]/.test(password) },
    { label: 'One special character (!@#$%^&*)', valid: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];

  const score = checks.filter((c) => c.valid).length;

  const getStrengthLabel = () => {
    if (!password) return { label: 'Password Strength', color: 'bg-muted', text: 'text-muted-foreground' };
    if (score <= 2) return { label: 'Weak', color: 'bg-rose-500', text: 'text-rose-500' };
    if (score === 3 || score === 4) return { label: 'Fair', color: 'bg-amber-500', text: 'text-amber-500' };
    return { label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-500' };
  };

  const strength = getStrengthLabel();

  return (
    <div className="space-y-3 pt-2">
      {/* Strength Bar */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-muted-foreground">Strength:</span>
        <span className={`font-semibold ${strength.text}`}>{strength.label}</span>
      </div>

      <div className="grid grid-cols-5 gap-1.5 h-1.5 w-full bg-accent rounded-full overflow-hidden">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-full transition-all duration-300 ${
              level <= score ? strength.color : 'bg-muted'
            }`}
          />
        ))}
      </div>

      {/* Criteria Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
        {checks.map((check, idx) => (
          <div key={idx} className="flex items-center space-x-1.5 text-xs">
            {check.valid ? (
              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            ) : (
              <X className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
            )}
            <span className={check.valid ? 'text-foreground font-medium' : 'text-muted-foreground'}>
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
