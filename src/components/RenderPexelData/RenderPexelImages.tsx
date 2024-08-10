import { useEffect, useRef, useState, useContext } from "react";
import styles from "./RenderPexelImages.module.scss";
import Loading from "./../../assets/Loading.svg";
import { FavouritesContext } from "../FavouritesContextProvider";

interface Source {
  landscape: string;
  large: string;
  large2x: string;
  medium: string;
  original: string;
  portrait: string;
  small: string;
  tiny: string;
}

export interface Photo {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  liked: boolean;
  alt: string;
}

interface PhotosResponse {
  next_page: string;
  page: number;
  per_page: number;
  photos: Photo[];
  total_results: number;
}

export default function RenderPexelImages(): JSX.Element {
  const [page, setPage] = useState<number>(1);
  const [images, setImages] = useState<Photo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [showImages, setShowImages] = useState<boolean>(true);

  const controller = useRef(new AbortController());
  const observer = useRef<IntersectionObserver | null>(null);
  const lastImageRef = useRef<HTMLImageElement | null>(null);

  const {
    showingFavourites,
    favourites,
    handleSaveFavourite,
    media,
    search,
    quality,
  } = useContext(FavouritesContext);

  const renderImageQuality = (element: Photo, quality: string): string => {
    switch (quality) {
      case "240p":
        return element.src.small;
      case "480p":
        return element.src.medium;
      case "720p":
        return element.src.large;
      case "1080p":
        return element.src.large2x;
      case "2160p":
        return element.src.original;
      default:
        return element.src.large; // Default to large if quality is not recognized
    }
  };

  useEffect(() => {
    setPage(1);
    setHasMore(true);
  }, [search]);

  useEffect(
    function () {
      async function getPictures() {
        setLoading(true);
        // setIsLoadingMore(true);
        try {
          controller.current.abort("Abort");

          console.log(images);

          const url =
            media === "Images"
              ? `https://api.pexels.com/v1/search?query=${search}&per_page=5&page=${page}`
              : `https://api.pexels.com/videos/search?query=nature&per_page=1`;

          const token =
            "FrWFCn9uBS7HA8RtewIBfrdQCl6qofLBF7WPwRiSSLUqL1cCLee1uIsj";
          controller.current = new AbortController();
          const response = await fetch(url, {
            signal: controller.current.signal,
            headers: {
              Authorization: token,
            },
          });

          if (search?.length === 0) {
            setLoading(false);
          }

          const data: PhotosResponse = await response.json();
          setImages((prevImages) =>
            page === 1 ? data.photos : [...prevImages, ...data.photos]
          );

          setHasMore(data.page < Math.ceil(data.total_results / data.per_page));

          setLoading(false);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
          // setIsLoadingMore(false);
        }
      }
      getPictures();
    },
    [page, search, controller]
  );

  useEffect(() => {
    setShowImages(false);
    const timer = setTimeout(() => {
      setShowImages(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(
    function () {
      if (loading) return;

      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
          console.log(hasMore);
          console.log(media);
          console.log(quality);
        }
      });

      if (lastImageRef.current) {
        observer.current.observe(lastImageRef.current);
      }

      return () => {
        if (observer.current) {
          observer.current.disconnect();
        }
      };
    },
    [loading, hasMore, images, showingFavourites, showImages]
  );

  function getTenWords(inputString: string): string {
    const words = inputString.trim().split(/\s+/);
    return words.slice(0, 10).join(" ");
  }

  const imagesToRender = showingFavourites ? favourites : images;

  return (
    <div className={styles["images-grid"]}>
      {showImages &&
        imagesToRender?.map((element, index) => {
          const isFavourite = favourites?.some((fav) => fav.id === element.id);
          // saveFavouriteImage(element);
          return (
            <div
              key={index}
              className={`${styles["image-container"]} `}
              // style={{
              //   backgroundImage: `url(${element.src.tiny})`,
              //   boxShadow: "5px 5px 10px 8px rgba(30, 30, 30, 0.52)",
              // }}
            >
              <img
                ref={index === images.length - 1 ? lastImageRef : null}
                key={index}
                src={renderImageQuality(element, quality)}
                alt={element.alt}
              />
              <div className={styles["image-description"]}>
                <div className={styles["image-title"]}>
                  {getTenWords(element.alt)}
                </div>
                <div className={styles["image-photographer"]}>
                  {element.photographer}
                </div>
              </div>
              <div
                className={styles.favourite}
                onClick={() => handleSaveFavourite?.(element)}
              >
                {isFavourite ? "Remove" : "Favourite"}
              </div>
            </div>
          );
        })}

      {showingFavourites && favourites?.length === 0 && (
        <div className={styles.edgecase}>No favourites saved yet</div>
      )}

      {!showImages && !loading && (
        <div className={styles.edgecase}>
          <img src={Loading} alt="Loading..." />
        </div>
      )}

      {loading && hasMore && (
        <div className={styles.edgecase}>
          <img src={Loading} alt="Loading more..." />
        </div>
      )}

      {!images && !search && !showingFavourites && (
        <div className={styles.edgecase}>
          Search for any pictures you would like to see!
        </div>
      )}

      {!hasMore && !!images?.length && !showingFavourites && (
        <div className={styles.edgecase}>
          That's all folks! No more images for "{search}"
        </div>
      )}
      {!hasMore && !images?.length && !showingFavourites && !!search.length && (
        <div className={styles.edgecase}>No images found for "{search}"</div>
      )}
    </div>
  );
}
