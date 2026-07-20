import React from 'react';
import { NavLink } from 'react-router-dom';

export const SidebarItem = ({ item, collapsed = false, onClick }) => {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.route}
      onClick={onClick}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 select-none ${
          isActive
            ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 font-bold'
            : 'text-muted-foreground hover:bg-accent hover:text-foreground'
        }`
      }
      title={collapsed ? item.label : undefined}
    >
      {({ isActive }) => (
        <>
          <Icon className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'}`} />
          
          {!collapsed && (
            <span className="truncate flex-1">{item.label}</span>
          )}

          {!collapsed && item.badge && (
            <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
              isActive
                ? 'bg-primary-foreground/20 text-primary-foreground'
                : 'bg-primary/10 text-primary border border-primary/20'
            }`}>
              {item.badge}
            </span>
          )}

          {/* Floating Tooltip when collapsed */}
          {collapsed && (
            <div className="absolute left-full ml-3 px-2.5 py-1 bg-popover text-popover-foreground text-xs font-medium rounded-md shadow-md border border-border/60 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
              {item.label}
            </div>
          )}
        </>
      )}
    </NavLink>
  );
};

export default SidebarItem;
