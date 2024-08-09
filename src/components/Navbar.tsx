import React, { useEffect, useRef, useContext } from "react";
import styles from "./Navbar.module.scss";
import { FavouritesContext } from "./FavouritesContextProvider";

// interface SearchData {
//   setSearch: React.Dispatch<React.SetStateAction<string>>;
// }

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
  } = useContext(FavouritesContext);

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
      <div
        onClick={() => {
          toggleFavourites?.();
        }}
      >
        {showingFavourites ? "Go back" : "Favourites"}
        {!!favourites?.length && (
          <span className={styles.favouriteCount}>{favourites.length}</span>
        )}
      </div>
    </nav>
  );
}
