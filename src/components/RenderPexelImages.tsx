import { useEffect, useRef, useState } from "react";
import styles from "./RenderPexelImages.module.scss";
import Loading from "./../assets/Loading.svg";

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

// interface PexelsVideoSearchResponse {
//   page: number;
//   per_page: number;
//   total_results: number;
//   url: string;
//   videos: Video[];
// }

interface Video {
  id: number;
  width: number;
  height: number;
  url: string;
  image: string;
  duration: number;
  user: User;
  video_files: VideoFile[];
  video_pictures: VideoPicture[];
}

interface User {
  id: number;
  name: string;
  url: string;
}

interface VideoFile {
  id: number;
  quality: string;
  file_type: string;
  width: number | null;
  height: number | null;
  link: string;
}

interface VideoPicture {
  id: number;
  picture: string;
  nr: number;
}

interface RenderProps {
  search: string;
  mediaType: string;
  showingFavourites: boolean;
  favourites: Photo[];
  handleSaveFavourite: (photo: Photo) => void;
}

export default function RenderPexelImages({
  search,
  mediaType,
  showingFavourites,
  favourites,
  handleSaveFavourite,
}: RenderProps): JSX.Element {
  const [page, setPage] = useState<number>(1);
  const [images, setImages] = useState<Photo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [showImages, setShowImages] = useState<boolean>(true);

  const controller = useRef(new AbortController());
  const observer = useRef<IntersectionObserver | null>(null);
  const lastImageRef = useRef<HTMLImageElement | null>(null);

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

          const url = `https://api.pexels.com/v1/search?query=${search}&per_page=5&page=${page}`;

          // if (mediaType === "videos") {
          //   url = `https://api.pexels.com/videos/search?query=${search}&per_page=5`;
          // }
          const token =
            "FrWFCn9uBS7HA8RtewIBfrdQCl6qofLBF7WPwRiSSLUqL1cCLee1uIsj";
          controller.current = new AbortController();
          const response = await fetch(url, {
            signal: controller.current.signal,
            headers: {
              Authorization: token,
            },
          });

          if (search.length === 0) {
            setLoading(false);
          }

          const data: PhotosResponse = await response.json();
          setImages((prevImages) =>
            page === 1 ? data.photos : [...prevImages, ...data.photos]
          );

          setHasMore(data.page < Math.ceil(data.total_results / data.per_page));
          console.log(data.total_results, "total results");
          console.log(data.page, "page");
          console.log(data.per_page, "per page");
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
    }, 300);
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
          const isFavourite = favourites.some((fav) => fav.id === element.id);
          // saveFavouriteImage(element);
          return (
            <div
              key={index}
              className={`${styles["image-container"]} ${styles["blur-load"]}`}
              style={{
                backgroundImage: `url(${element.src.tiny})`,
                boxShadow: "5px 5px 10px 8px rgba(30, 30, 30, 0.52)",
              }}
            >
              <img
                ref={index === images.length - 1 ? lastImageRef : null}
                key={index}
                src={element.src.large2x}
                alt={element.alt}
                onClick={() => console.log(mediaType)}
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
                onClick={() => handleSaveFavourite(element)}
              >
                {isFavourite ? "Remove" : "Favourite"}
              </div>
            </div>
          );
        })}

      {showingFavourites && favourites.length === 0 && (
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

      {!images && !search && (
        <div className={styles.edgecase}>
          Search for any pictures you would like to see!
        </div>
      )}

      {!hasMore && !!images && (
        <div className={styles.edgecase}>
          That's all folks! No more images for "{search}"
        </div>
      )}
    </div>
  );
}
