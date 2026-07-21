import React from 'react';
import NotificationCard from './NotificationCard';

export const NotificationList = ({ notifications = [], onDelete }) => {
  if (notifications.length === 0) return null;

  return (
    <div className="space-y-3 font-sans">
      {notifications.map((n) => (
        <NotificationCard key={n.id} notification={n} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default NotificationList;
