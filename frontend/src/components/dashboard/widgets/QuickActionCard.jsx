import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const QuickActionCard = ({ title, description, icon: Icon, route, buttonText = 'Access', badge }) => {
  return (
    <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between mb-3">
          {Icon && (
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Icon className="w-5 h-5" />
            </div>
          )}
          {badge && (
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent text-foreground border border-border/60">
              {badge}
            </span>
          )}
        </div>

        <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{description}</p>
      </div>

      <div className="mt-4 pt-3 border-t border-border/40">
        <Link
          to={route}
          className="inline-flex items-center justify-between w-full text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          <span>{buttonText}</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};

export default QuickActionCard;
