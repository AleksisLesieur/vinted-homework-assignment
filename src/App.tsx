import { useState } from "react";
import Navbar from "./components/Navbar";
import { FavouritesContextProvider } from "./components/FavouritesContextProvider";
import RenderPexelMedia from "./components/RenderPexelMedia";
import Modal from "./components/ImprovingUI/Modal";
import NotificationManager from "./components/ImprovingUI/NotificationManager";

function App() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);

  return (
    <FavouritesContextProvider>
      <Navbar />
      <RenderPexelMedia />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <NotificationManager />
    </FavouritesContextProvider>
  );
}

export default App;
