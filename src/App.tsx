import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
// import RenderPexelImages from "./components/RenderPexelData/RenderPexelImages";
import { FavouritesContextProvider } from "./components/FavouritesContextProvider";
import RenderPexelMedia from "./components/RenderPexelMedia";
import Modal from "./components/Modal";

function App() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);

  return (
    <FavouritesContextProvider>
      {!isModalOpen && (
        <>
          <Navbar />
          <RenderPexelMedia />
        </>
      )}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </FavouritesContextProvider>
  );
}

export default App;
