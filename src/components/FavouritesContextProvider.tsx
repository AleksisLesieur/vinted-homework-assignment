import React, { useEffect, useState } from "react";
import { Photo } from "./RenderPexelData/RenderPexelImages";
import { Video } from "./RenderPexelData/RenderPexelVideos";

interface FavouritesContextType {
  favouriteImages: Photo[];
  favouriteVideos: Video[];
  showingFavourite: boolean;
  setShowingFavourite: React.Dispatch<React.SetStateAction<boolean>>;
  toggleFavourites: () => void;
  handleSaveFavouriteImages: (photo: Photo) => void;
  handleSaveFavouriteVideos: (video: Video) => void;
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
  favouriteImages: [],
  favouriteVideos: [],
  showingFavourite: false,
  setShowingFavourite: () => {},
  toggleFavourites: () => {},
  handleSaveFavouriteImages: () => {},
  handleSaveFavouriteVideos: () => {},
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
  const [showingFavourite, setShowingFavourite] = useState<boolean>(false);
  const [favouriteImages, setFavouriteImages] = useState<Photo[]>([]);
  const [favouriteVideos, setFavouriteVideos] = useState<Video[]>([]);
  const [media, setMedia] = useState<string>("Images");
  const [search, setSearch] = useState<string>("nature");
  const [quality, setQuality] = useState<string>("240p");

  const toggleFavourites = () => {
    setShowingFavourite((prev) => !prev);
  };

  const handleSaveFavouriteImages = (photo: Photo) => {
    setFavouriteImages((prevFavourites) => {
      let updatedFavourites: Photo[];

      const isPhotoAlreadyFavourited = prevFavourites.some(
        (fav) => fav.id === photo.id
      );

      if (isPhotoAlreadyFavourited) {
        updatedFavourites = prevFavourites.filter((fav) => fav.id !== photo.id);
      } else {
        updatedFavourites = [...prevFavourites, photo];
      }

      localStorage.setItem(
        "favouriteImages",
        JSON.stringify(updatedFavourites)
      );

      return updatedFavourites;
    });
  };

  const handleSaveFavouriteVideos = (video: Video) => {
    setFavouriteVideos((prevFavourites) => {
      let updatedFavourites: Video[];

      const isVideoAlreadyFavourited = prevFavourites.some(
        (fav) => fav.id === video.id
      );

      if (isVideoAlreadyFavourited) {
        updatedFavourites = prevFavourites.filter((fav) => fav.id !== video.id);
      } else {
        updatedFavourites = [...prevFavourites, video];
      }

      localStorage.setItem(
        "favouriteVideos",
        JSON.stringify(updatedFavourites)
      );

      return updatedFavourites;
    });
  };

  useEffect(() => {
    const storedFavourites = localStorage.getItem("favouriteImages");
    if (storedFavourites) {
      setFavouriteImages(JSON.parse(storedFavourites));
    }
  }, []);

  useEffect(() => {
    const storedFavouriteVideos = localStorage.getItem("favouriteVideos");
    if (storedFavouriteVideos) {
      setFavouriteVideos(JSON.parse(storedFavouriteVideos));
    }
  }, []);

  return (
    <FavouritesContext.Provider
      value={{
        favouriteVideos,
        handleSaveFavouriteVideos,
        favouriteImages,
        showingFavourite,
        setShowingFavourite,
        toggleFavourites,
        handleSaveFavouriteImages,
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
