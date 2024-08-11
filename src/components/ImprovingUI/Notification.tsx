import React, { useEffect, useState } from "react";
import styles from "./Notification.module.scss";

interface NotificationProps {
  message: string;
  type: "success" | "error";
  duration?: number;
  onClose: () => void;
  style?: React.CSSProperties;
}

const Notification: React.FC<NotificationProps> = ({
  message,
  type,
  duration = 1250,
  onClose,
  style,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    setIsVisible(true);
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress <= 0) {
          clearInterval(timer);
          setIsVisible(false);
          setTimeout(onClose, 300); // Wait for exit animation before removing
          return 0;
        }
        return prevProgress - 100 / (duration / 100);
      });
    }, 100);

    return () => clearInterval(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`${styles.notification} ${isVisible ? styles.show : ""} ${
        styles[type]
      }`}
      style={style}
    >
      <div className={styles.notificationContent}>{message}</div>
      <div className={styles.progressBar} style={{ width: `${progress}%` }} />
    </div>
  );
};

export default Notification;
