import React from 'react';

export const AuthCard = ({ title, subtitle, children, footer }) => {
  return (
    <div className="w-full max-w-xl bg-card/80 backdrop-blur-xl border border-border/60 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-primary/5 transition-all duration-300">
      {/* Header section */}
      {(title || subtitle) && (
        <div className="mb-6 text-center sm:text-left">
          {title && <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-2">{title}</h2>}
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      )}

      {/* Main Body */}
      <div>{children}</div>

      {/* Footer section */}
      {footer && <div className="mt-6 pt-6 border-t border-border/40 text-center">{footer}</div>}
    </div>
  );
};

export default AuthCard;
