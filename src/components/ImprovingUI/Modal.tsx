import React, { useContext } from "react";
import { FavouritesContext } from "./../FavouritesContextProvider";
import "./Modal.scss";

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
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Please select</h2>
        <div className="setting-group">
          <h3>Media Type</h3>
          <div className="button-group">
            <button
              className={media === "Images" ? "active" : ""}
              onClick={() => setMedia("Images")}
            >
              Images
            </button>
            <button
              className={media === "Videos" ? "active" : ""}
              onClick={() => setMedia("Videos")}
            >
              Videos
            </button>
          </div>
        </div>
        <div className="setting-group">
          <h3>Quality</h3>
          <select value={quality} onChange={(e) => setQuality(e.target.value)}>
            {qualities.map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
          </select>
        </div>
        <button className="close-button" onClick={onClose}>
          Save
        </button>
      </div>
    </div>
  );
};

export default Modal;
