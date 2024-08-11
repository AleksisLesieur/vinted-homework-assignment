import React, { useEffect, useRef, useContext, useState } from "react";
import styles from "./Navbar.module.scss";
import { FavouritesContext } from "./FavouritesContextProvider";
import UpArrow from "./../assets/UpArrow.svg";

export default function Navbar(): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);

  const navRef = useRef<HTMLElement | null>(null);

  const [visible, setVisible] = useState<boolean>(false);

  const {
    toggleFavourites,
    favouriteImages,
    favouriteVideos,
    showingFavourite,
    media,
    setMedia,
    setSearch,
    quality,
    setQuality,
  } = useContext(FavouritesContext);

  const handleQualityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setQuality(event.target.value);
  };

  useEffect(function () {
    const handleIntersection: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisible(false);
        } else {
          setVisible(true);
        }
      });
    };
    const options: IntersectionObserverInit = {
      threshold: 0.1,
      rootMargin: "0px",
    };

    const observer = new IntersectionObserver(handleIntersection, options);

    if (navRef.current) {
      observer.observe(navRef.current);
    }

    return () => {
      if (navRef.current) {
        observer.unobserve(navRef.current);
      }
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <nav ref={navRef}>
      <div className={styles.mediaToggle}>
        <span
          className={media === "Images" ? styles.active : ""}
          onClick={() => setMedia("Images")}
        >
          Images
        </span>
        <span> / </span>
        <span
          className={media === "Videos" ? styles.active : ""}
          onClick={() => setMedia("Videos")}
        >
          Videos
        </span>
      </div>
      <input
        placeholder={`Search for ${media}...`}
        className={styles.textStyle}
        ref={inputRef}
        type="text"
        onChange={(e) => setSearch(e.target.value)}
      />
      <div>
        <div className={styles.rightSide}>
          <div>Quality</div>
          <span className={styles.selectWrapper}>
            <select
              name="quality"
              id="quality"
              value={quality}
              onChange={handleQualityChange}
              className={styles.qualitySelect}
            >
              <option value="240p">240p</option>
              <option value="360p">360p</option>
              <option value="480p">480p</option>
              <option value="720p">720p</option>
              <option value="1080p">1080p</option>
              <option value="1440p">1440p</option>
              <option value="2160p">2160p</option>
            </select>
          </span>
          <div> / </div>
          <div
            style={{ cursor: "pointer" }}
            onClick={() => {
              toggleFavourites?.();
            }}
          >
            {showingFavourite ? "Go back" : "Favourites"}
          </div>
          {!!favouriteImages?.length && media === "Images" && (
            <span className={styles.favouriteCount}>
              {favouriteImages.length}
            </span>
          )}
          {!!favouriteVideos?.length && media === "Videos" && (
            <span className={styles.favouriteCount}>
              {favouriteVideos.length}
            </span>
          )}
        </div>
      </div>
      <img
        className={`${styles.testing} ${visible ? styles.visible : ""}`}
        src={UpArrow}
        alt="up-button"
        onClick={scrollToTop}
      />
    </nav>
  );
}
