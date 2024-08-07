import React, { useEffect, useRef, useState } from "react";
import styles from "./Navbar.module.scss";

interface SearchData {
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  mediaType: string;
  setMediaType: React.Dispatch<React.SetStateAction<string>>;
  favouriteCount: number;
  toggleFavourites: () => void;
  showingFavourites: boolean;
  setShowingFavourites: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Navbar({
  setSearch,
  mediaType,
  setMediaType,
  toggleFavourites,
  favouriteCount,
  showingFavourites,
  setShowingFavourites,
}: SearchData): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);

  const [type, setType] = useState<boolean>(true);

  function toggleType() {
    setType((type) => !type);
    setMediaType(() => (type ? "Videos" : "Images"));
  }

  useEffect(
    function () {
      inputRef.current?.focus();
    },
    [inputRef]
  );

  return (
    <nav>
      <div
        onClick={() => {
          toggleType();
          setShowingFavourites(false);
        }}
      >
        {mediaType}
      </div>
      <input
        placeholder={`Search for ${mediaType}...`}
        className={styles.textStyle}
        ref={inputRef}
        type="text"
        onChange={(e) => setSearch(e.target.value)}
      />
      <div
        onClick={() => {
          toggleFavourites();
        }}
      >
        {showingFavourites ? "Go back" : "Favourites"}
        {!!favouriteCount && (
          <span className={styles.favouriteCount}>{favouriteCount}</span>
        )}
      </div>
    </nav>
  );
}
