import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, Clock, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NotificationButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);

  // Mock notifications for foundation view
  const [notifications] = useState([
    { id: 1, title: 'Appointment Confirmed', time: '10m ago', unread: true, desc: 'Dr. Sarah Jenkins confirmed your consultation for tomorrow at 10:00 AM.' },
    { id: 2, title: 'Vitals Logged', time: '1h ago', unread: true, desc: 'Blood pressure telemetry recorded successfully (120/80 mmHg).' },
    { id: 3, title: 'Prescription Updated', time: '1d ago', unread: false, desc: 'New prescription issued for Amoxicillin 500mg.' },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
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

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground transition-colors relative flex items-center justify-center"
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-card animate-pulse" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-popover border border-border/60 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between pb-3 border-b border-border/50">
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-bold text-foreground">Notifications</h4>
              {unreadCount > 0 && (
                <span className="text-[10px] font-extrabold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <button
              className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center space-x-1"
              title="Mark all as read"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark read</span>
            </button>
          </div>

          {/* List */}
          <div className="py-2 space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3 rounded-xl transition-colors border ${
                  n.unread ? 'bg-accent/40 border-primary/20' : 'bg-card border-border/40'
                }`}
              >
                <div className="flex items-start justify-between">
                  <h5 className="text-xs font-bold text-foreground">{n.title}</h5>
                  <span className="text-[10px] text-muted-foreground flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{n.time}</span>
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{n.desc}</p>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-border/50 text-center">
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center space-x-1 text-xs font-semibold text-primary hover:underline"
            >
              <span>View all notifications</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationButton;
