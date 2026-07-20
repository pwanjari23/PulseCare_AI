import React from 'react';
import SidebarItem from './SidebarItem';

export const SidebarGroup = ({ group, collapsed = false, onItemClick }) => {
  return (
    <div className="space-y-1 py-1.5">
      {!collapsed && group.group && (
        <h4 className="px-3 text-[10px] font-extrabold font-mono uppercase tracking-wider text-muted-foreground/70 mb-1">
          {group.group}
        </h4>
      )}
      <div className="space-y-1">
        {group.items.map((item) => (
          <SidebarItem key={item.id} item={item} collapsed={collapsed} onClick={onItemClick} />
        ))}
      </div>
    </div>
  );
};

export default SidebarGroup;
