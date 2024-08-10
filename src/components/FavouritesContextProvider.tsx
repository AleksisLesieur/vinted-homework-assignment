import React, { useEffect, useState } from "react";
import { Photo } from "./RenderPexelData/RenderPexelImages";

interface FavouritesContextType {
  favourites: Photo[];
  showingFavourites: boolean;
  setShowingFavourites: React.Dispatch<React.SetStateAction<boolean>>;
  toggleFavourites: () => void;
  handleSaveFavourite: (photo: Photo) => void;
  media: string;
  setMedia: React.Dispatch<React.SetStateAction<string>>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  quality: string;
  setQuality: React.Dispatch<React.SetStateAction<string>>;
}

interface FavouritesContextProviderProps {
  children: React.ReactNode;
}

export const FavouritesContext = React.createContext<FavouritesContextType>({
  favourites: [],
  showingFavourites: false,
  setShowingFavourites: () => {},
  toggleFavourites: () => {},
  handleSaveFavourite: () => {},
  media: "Images",
  setMedia: () => {},
  search: "nature",
  setSearch: () => {},
  quality: "240p",
  setQuality: () => {},
});

export const FavouritesContextProvider = ({
  children,
}: FavouritesContextProviderProps) => {
  const [showingFavourites, setShowingFavourites] = useState<boolean>(false);
  const [favourites, setFavourites] = useState<Photo[]>([]);
  const [media, setMedia] = useState<string>("Images");
  const [search, setSearch] = useState<string>("nature");
  const [quality, setQuality] = useState<string>("240p");

  const toggleFavourites = () => {
    setShowingFavourites((prev) => !prev);
  };

  const handleSaveFavourite = (photo: Photo) => {
    setFavourites((prevFavourites) => {
      const updatedFavourites = prevFavourites.some(
        (fav) => fav.id === photo.id
      )
        ? prevFavourites.filter((fav) => fav.id !== photo.id)
        : [...prevFavourites, photo];

      localStorage.setItem("favourites", JSON.stringify(updatedFavourites));

      return updatedFavourites;
    });
  };

  useEffect(() => {
    const storedFavourites = localStorage.getItem("favourites");
    if (storedFavourites) {
      setFavourites(JSON.parse(storedFavourites));
    }
  }, []);

  return (
    <FavouritesContext.Provider
      value={{
        favourites,
        showingFavourites,
        setShowingFavourites,
        toggleFavourites,
        handleSaveFavourite,
        media,
        setMedia,
        search,
        setSearch,
        quality,
        setQuality,
      }}
    >
      {children}
    </FavouritesContext.Provider>
  );
};
