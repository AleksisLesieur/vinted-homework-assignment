import React, { useState, useEffect, useRef } from "react";
import Notification from "./Notification";
import styles from "./Notification.module.scss";

export interface NotificationItem {
  id: number;
  message: string;
  type: "success" | "error";
}

const NotificationManager: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isAtTop, setIsAtTop] = useState(true);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleNotification = (event: CustomEvent<NotificationItem>) => {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        event.detail,
      ]);
    };

    window.addEventListener("addNotification" as any, handleNotification);

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsAtTop(entry.isIntersecting);
      },
      { threshold: [1] }
    );

    if (topRef.current) {
      observer.observe(topRef.current);
    }

    return () => {
      window.removeEventListener("addNotification" as any, handleNotification);
      observer.disconnect();
    };
  }, []);

  const removeNotification = (id: number) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  };

  return (
    <>
      <div
        ref={topRef}
        style={{ position: "absolute", top: 0, height: "1px" }}
      />
      <div
        className={`${styles.notificationManager} ${
          isAtTop ? styles.atTop : ""
        }`}
      >
        {notifications.map((notification, index) => (
          <Notification
            key={notification.id}
            message={notification.message}
            type={notification.type}
            duration={1250}
            onClose={() => removeNotification(notification.id)}
            style={{ top: `${index * 16}px` }}
          />
        ))}
      </div>
    </>
  );
};

export default NotificationManager;
