import React from 'react';

export const SocialDivider = ({ text = 'OR' }) => {
  return (
    <div className="relative my-6 text-center">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-border/60" />
      </div>
      <div className="relative inline-block bg-card px-3 text-xs uppercase font-medium tracking-wider text-muted-foreground">
        {text}
      </div>
    </div>
  );
};

export default SocialDivider;
