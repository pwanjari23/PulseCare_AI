/**
 * PulseCare AI - PasswordForm Component
 */

import React, { useState } from 'react';
import { Eye, EyeOff, KeyRound, Save, Loader2, CheckCircle2 } from 'lucide-react';
import { getPasswordStrength } from '../utils/settings.utils';

export const PasswordForm = ({ onSubmit, isSubmitting = false, className = '' }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const strength = getPasswordStrength(newPassword);
  const isMatch = newPassword && newPassword === confirmPassword;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isMatch) return;
    onSubmit?.({ currentPassword, newPassword });
  };

  return (
    <form onSubmit={handleSubmit} className={`bg-card border border-border/60 rounded-3xl p-6 shadow-xs space-y-5 font-sans ${className}`}>
      <div className="flex items-center space-x-2">
        <KeyRound className="w-5 h-5 text-primary" />
        <h3 className="text-sm font-bold text-foreground font-display">Security Password Update</h3>
      </div>

      <div className="space-y-4 text-xs font-mono">
        {/* Current Password */}
        <div className="space-y-1.5">
          <label htmlFor="current-pwd" className="font-bold text-foreground">Current Password</label>
          <div className="relative">
            <input
              id="current-pwd"
              type={showCurrent ? 'text' : 'password'}
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={isSubmitting}
              className="w-full pl-3.5 pr-10 py-2.5 bg-accent/30 hover:bg-accent/50 focus:bg-card border border-border/60 focus:border-primary rounded-2xl outline-none transition-all shadow-2xs"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
            >
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="space-y-1.5">
          <label htmlFor="new-pwd" className="font-bold text-foreground">New Password</label>
          <div className="relative">
            <input
              id="new-pwd"
              type={showNew ? 'text' : 'password'}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isSubmitting}
              className="w-full pl-3.5 pr-10 py-2.5 bg-accent/30 hover:bg-accent/50 focus:bg-card border border-border/60 focus:border-primary rounded-2xl outline-none transition-all shadow-2xs"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
            >
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Password Strength Meter */}
          {newPassword && (
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-muted-foreground">Strength:</span>
                <span className={`font-bold ${strength.textClass}`}>{strength.label}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-accent overflow-hidden">
                <div className={`h-full transition-all duration-300 ${strength.color}`} style={{ width: `${strength.score}%` }} />
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label htmlFor="confirm-pwd" className="font-bold text-foreground">Confirm New Password</label>
          <div className="relative">
            <input
              id="confirm-pwd"
              type={showConfirm ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isSubmitting}
              className="w-full pl-3.5 pr-10 py-2.5 bg-accent/30 hover:bg-accent/50 focus:bg-card border border-border/60 focus:border-primary rounded-2xl outline-none transition-all shadow-2xs"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {confirmPassword && !isMatch && (
            <p className="text-[10px] text-rose-500 font-bold">Passwords do not match.</p>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isSubmitting || !isMatch || !newPassword}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-sm transition-all disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Updating Password...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Update Password</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default PasswordForm;
