// import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
// import RenderPexelImages from "./components/RenderPexelData/RenderPexelImages";
import { FavouritesContextProvider } from "./components/FavouritesContextProvider";
import RenderPexelMedia from "./components/RenderPexelMedia";

function App() {
  // testing stuff
  return (
    <FavouritesContextProvider>
      <Navbar />
      {/* <RenderPexelImages search={search} /> */}
      <RenderPexelMedia />
    </FavouritesContextProvider>
  );
}

export default App;
