import React from 'react';
import { motion } from 'framer-motion';
import NotificationItem from './NotificationItem';

export const NotificationList = ({ notifications = [], onSelectNotification }) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
      }}
      className="space-y-2.5"
    >
      {notifications.map((n) => (
        <NotificationItem
          key={n.id}
          notification={n}
          onSelect={onSelectNotification}
        />
      ))}
    </motion.div>
  );
};

export default NotificationList;
