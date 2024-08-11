import React, { useContext } from "react";
import { FavouritesContext } from "./../FavouritesContextProvider";
import styles from "./Modal.module.scss";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const { media, setMedia, quality, setQuality } =
    useContext(FavouritesContext);

  if (!isOpen) return null;

  const qualities = ["240p", "360p", "480p", "720p", "1080p", "1440p", "2160p"];

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Please select</h2>
        <div className={styles.settingGroup}>
          <h3>Media Type</h3>
          <div className={styles.buttonGroup}>
            <button
              className={media === "Images" ? styles.active : ""}
              onClick={() => setMedia("Images")}
            >
              Images
            </button>
            <button
              className={media === "Videos" ? styles.active : ""}
              onClick={() => setMedia("Videos")}
            >
              Videos
            </button>
          </div>
        </div>
        <div className={styles.settingGroup}>
          <h3>Quality</h3>
          <select value={quality} onChange={(e) => setQuality(e.target.value)}>
            {qualities.map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
          </select>
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          Save
        </button>
      </div>
    </div>
  );
};

export default Modal;
