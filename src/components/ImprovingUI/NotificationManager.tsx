import React, { useState, useEffect } from "react";
import Notification from "./Notification";
import styles from "./Notification.module.scss";

export interface NotificationItem {
  id: number;
  message: string;
  type: "success" | "error";
}

const NotificationManager: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    const handleNotification = (event: CustomEvent<NotificationItem>) => {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        event.detail,
      ]);
    };

    window.addEventListener("addNotification" as any, handleNotification);

    return () => {
      window.removeEventListener("addNotification" as any, handleNotification);
    };
  }, []);

  const removeNotification = (id: number) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  };

  return (
    <div className={styles.notificationManager}>
      {notifications.map((notification, index) => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          duration={1250}
          onClose={() => removeNotification(notification.id)}
          style={{ top: `${index * 5}px` }}
        />
      ))}
    </div>
  );
};

export default NotificationManager;
