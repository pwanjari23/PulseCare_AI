import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Settings, Key, LogOut, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../../stores/auth.store';
import { useQueryClient } from '@tanstack/react-query';

export const ProfileDropdown = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLogout = async () => {
    setIsOpen(false);
    await logout(queryClient);
    navigate('/login');
  };

  const userInitial = user?.firstName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U';
  const userName = user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.email || 'PulseCare User';
  const userRole = user?.role || 'Patient';

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2.5 p-1.5 rounded-xl hover:bg-accent transition-colors"
        aria-label="User profile menu"
        aria-expanded={isOpen}
      >
        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-xs shrink-0">
          {userInitial}
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-xs font-bold text-foreground leading-tight truncate max-w-[120px]">{userName}</p>
          <p className="text-[10px] text-muted-foreground font-mono font-semibold uppercase">{userRole}</p>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden sm:block" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-popover border border-border/60 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
          {/* User Details Box */}
          <div className="p-3 border-b border-border/50 bg-accent/30 rounded-xl mb-1">
            <p className="text-xs font-bold text-foreground truncate">{userName}</p>
            <p className="text-[11px] text-muted-foreground truncate mt-0.5">{user?.email}</p>
            <span className="inline-block mt-1.5 text-[9px] font-extrabold font-mono uppercase bg-primary/15 text-primary px-2 py-0.5 rounded-md border border-primary/20">
              {userRole} Account
            </span>
          </div>

          {/* Menu Actions */}
          <div className="space-y-0.5 py-1">
            <Link
              to="/patient/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-2.5 px-3 py-2 text-xs font-semibold text-foreground hover:bg-accent rounded-xl transition-colors"
            >
              <User className="w-4 h-4 text-muted-foreground" />
              <span>Profile</span>
            </Link>

            <Link
              to="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-2.5 px-3 py-2 text-xs font-semibold text-foreground hover:bg-accent rounded-xl transition-colors"
            >
              <Settings className="w-4 h-4 text-muted-foreground" />
              <span>Settings</span>
            </Link>

            <Link
              to="/change-password"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-2.5 px-3 py-2 text-xs font-semibold text-foreground hover:bg-accent rounded-xl transition-colors"
            >
              <Key className="w-4 h-4 text-muted-foreground" />
              <span>Change Password</span>
            </Link>
          </div>

          <div className="border-t border-border/50 pt-1 mt-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
