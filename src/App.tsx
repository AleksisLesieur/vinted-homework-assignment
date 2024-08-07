import { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import RenderPexelImages from "./components/RenderPexelImages";
import { Photo } from "./components/RenderPexelImages";

function App() {
  const [search, setSearch] = useState<string>("nature");
  const [mediaType, setMediaType] = useState<string>("Images");
  const [showingFavourites, setShowingFavourites] = useState<boolean>(false);
  const [favourites, setFavourites] = useState<Photo[]>([]);

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
    <div>
      <Navbar
        setSearch={setSearch}
        mediaType={mediaType}
        setMediaType={setMediaType}
        toggleFavourites={toggleFavourites}
        favouriteCount={favourites.length}
        showingFavourites={showingFavourites}
        setShowingFavourites={setShowingFavourites}
      />
      {/* <RenderImages search={search} /> */}
      <RenderPexelImages
        search={search}
        mediaType={mediaType}
        showingFavourites={showingFavourites}
        favourites={favourites}
        handleSaveFavourite={handleSaveFavourite}
      />
    </div>
  );
}

export default App;
