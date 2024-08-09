// import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
// import RenderPexelImages from "./components/RenderPexelData/RenderPexelImages";
import { FavouritesContextProvider } from "./components/FavouritesContextProvider";
import RenderPexelMedia from "./components/RenderPexelMedia";

function App() {
  return (
    <FavouritesContextProvider>
      <Navbar />
      <RenderPexelMedia />
    </FavouritesContextProvider>
  );
}

export default App;
