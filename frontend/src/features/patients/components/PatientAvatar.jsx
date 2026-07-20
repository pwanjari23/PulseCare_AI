import React from 'react';
import { User } from 'lucide-react';

export const PatientAvatar = ({ firstName = '', lastName = '', photoUrl = '', size = 'md', className = '' }) => {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'P';

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-2xl',
  };

  const dim = sizeClasses[size] || sizeClasses.md;

  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={`${firstName} ${lastName}`}
        className={`${dim} rounded-2xl object-cover border border-primary/20 shadow-xs ${className}`}
      />
    );
  }

  return (
    <div className={`${dim} rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold font-display shadow-xs ${className}`}>
      {initials ? initials : <User className="w-5 h-5" />}
    </div>
  );
};

export default PatientAvatar;
