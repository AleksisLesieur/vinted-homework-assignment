import React, { useEffect, useRef, useContext, useState } from "react";
import styles from "./Navbar.module.scss";
import { FavouritesContext } from "./FavouritesContextProvider";

const qualities = ["240p", "360p", "480p", "720p", "1080p", "1440p", "2160p"];

export default function Navbar(): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    toggleFavourites,
    favourites,
    showingFavourites,
    media,
    // setShowingFavourites,
    setMedia,
    setSearch,
    quality,
    setQuality,
  } = useContext(FavouritesContext);

  const handleQualityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setQuality(event.target.value);
  };

  useEffect(
    function () {
      inputRef.current?.focus();
    },
    [inputRef]
  );

  return (
    <nav className={styles.nav}>
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
            {showingFavourites ? "Go back" : "Favourites"}
          </div>
          {!!favourites?.length && (
            <span className={styles.favouriteCount}>{favourites.length}</span>
          )}
        </div>
      </div>
    </nav>
  );
}
