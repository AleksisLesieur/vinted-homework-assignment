import RenderPexelImages from "./RenderPexelData/RenderPexelImages";
import RenderPexelVideos from "./RenderPexelData/RenderPexelVideos";
import { FavouritesContext } from "./FavouritesContextProvider";
import { useContext } from "react";

export default function RenderPexelMedia() {
  const { media } = useContext(FavouritesContext);

  switch (media) {
    case "Images":
      return <RenderPexelImages />;
    case "Videos":
      return <RenderPexelVideos />;
    default:
      return <div>Please select a media type</div>;
  }
  //   return media === "Images" ? <RenderPexelImages /> : <RenderPexelVideos />;
}
