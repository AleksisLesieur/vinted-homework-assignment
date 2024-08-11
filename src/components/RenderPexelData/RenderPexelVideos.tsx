import { useEffect, useRef, useState, useContext } from "react";
import styles from "./RenderPexelVideos.module.scss";
import { FavouritesContext } from "../FavouritesContextProvider";
import Loading from "./../../assets/Loading.svg";
import StarIconFull from "./../../assets/StarIconFull.svg";
import StarIconEmpty from "./../../assets/StarIconEmpty.svg";
import { NotificationItem } from "../ImprovingUI/NotificationManager";

interface PexelsVideoSearchResponse {
  next_page: string;
  page: number;
  per_page: number;
  total_results: number;
  url: string;
  videos: Video[];
}

export interface Video {
  avg_color: null;
  duration: number;
  full_res: null;
  height: number;
  id: number;
  image: string;
  tags: [];
  url: string;
  user: User;
  video_files: VideoFile[];
  video_pictures: VideoPicture[];
  width: number;
}

interface User {
  id: number;
  name: string;
  url: string;
}

interface VideoFile {
  file_type: string;
  fps: number;
  height: number | null;
  id: number;
  link: string;
  quality: string;
  size: number;
  width: number | null;
}

interface VideoPicture {
  id: number;
  nr: number;
  picture: string;
}

const Default = "240p";

const QualitySettings: { [key: string]: number } = {
  "240p": 240,
  "360p": 360,
  "480p": 480,
  "720p": 720,
  "1080p": 1080,
  "1440p": 1440,
  "2160p": 2160,
};

function filterVideosByClosestQuality(
  videos: Video[],
  desiredQuality: string
): Video[] {
  const targetHeight =
    QualitySettings[desiredQuality] || QualitySettings[Default];

  return videos.map((video) => {
    const closestFile = video.video_files.reduce((closest, current) => {
      if (!closest.height) return current;
      if (!current.height) return closest;

      const closestDiff = Math.abs(closest.height - targetHeight);
      const currentDiff = Math.abs(current.height - targetHeight);

      return currentDiff < closestDiff ? current : closest;
    }, video.video_files[0]);

    return {
      ...video,
      video_files: [closestFile],
    };
  });
}

export default function RenderPexelVideos(): JSX.Element {
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const controller = useRef(new AbortController());
  const observer = useRef<IntersectionObserver | null>(null);
  const lastVideoRef = useRef<HTMLVideoElement | null>(null);

  const {
    search,
    quality,
    showingFavourite,
    favouriteVideos,
    handleSaveFavouriteVideos,
  } = useContext(FavouritesContext);

  useEffect(() => {
    async function getVideos() {
      if (!hasMore || loading) return;

      setLoading(true);
      try {
        controller.current.abort();
        controller.current = new AbortController();

        const url = `https://api.pexels.com/videos/search?query=${search}&per_page=5&page=${page}`;
        const token =
          "FrWFCn9uBS7HA8RtewIBfrdQCl6qofLBF7WPwRiSSLUqL1cCLee1uIsj";

        const response = await fetch(url, {
          signal: controller.current.signal,
          headers: {
            Authorization: token,
          },
        });

        const data: PexelsVideoSearchResponse = await response.json();

        const filteredVideos = filterVideosByClosestQuality(
          data.videos,
          quality
        );

        setVideos((prevVideos) => [...prevVideos, ...filteredVideos]);
        setHasMore(data.page < Math.ceil(data.total_results / data.per_page));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    getVideos();
  }, [page, search, controller, quality]);

  useEffect(
    function () {
      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (lastVideoRef.current) {
        observer.current.observe(lastVideoRef.current);
      }

      return () => {
        if (observer.current) {
          observer.current.disconnect();
        }
      };
    },
    [loading, hasMore, videos, showingFavourite, quality]
  );

  useEffect(() => {
    setVideos([]);
    setPage(1);
    setHasMore(true);
  }, [search, quality]);

  const isVideoFavourited = (video: Video) => {
    return favouriteVideos.some((fav) => fav.id === video.id);
  };

  const addNotification = (notification: Omit<NotificationItem, "id">) => {
    const event = new CustomEvent("addNotification", {
      detail: { ...notification, id: Date.now() },
    });
    window.dispatchEvent(event);
  };

  const toggleFavorite = (video: Video) => {
    handleSaveFavouriteVideos(video);
    if (isVideoFavourited(video)) {
      addNotification({
        message: "Video removed from favorites",
        type: "error",
      });
    } else {
      addNotification({ message: "Video added to favorites", type: "success" });
    }
  };
  const videosToRender = showingFavourite ? favouriteVideos : videos;

  return (
    <div className={styles.videosContainer}>
      {videosToRender?.map((video, index) => (
        <div key={video.id} className={styles.videoContainer}>
          <video
            ref={index === videos.length - 1 ? lastVideoRef : null}
            controls
            width="100%"
            height="100%"
          >
            <source
              src={video.video_files[0].link}
              type={video.video_files[0].file_type}
            />
            Your browser does not support the video tag.
          </video>
          <div
            className={styles.favoriteIcon}
            onClick={() => toggleFavorite(video)}
          >
            <img
              className={styles["responsive-svg"]}
              src={isVideoFavourited(video) ? StarIconFull : StarIconEmpty}
              alt={isVideoFavourited(video) ? "Favorited" : "Not Favorited"}
            />
          </div>
        </div>
      ))}
      {loading && (
        <img src={Loading} alt="Loading" className={styles.loading} />
      )}

      {loading && hasMore && (
        <div className={styles.edgecase}>
          <img src={Loading} alt="Loading more..." />
        </div>
      )}

      {!search && !showingFavourite && (
        <div className={styles.edgecase}>
          Search for any videos you would like to see!
        </div>
      )}

      {!hasMore && !!videos?.length && !showingFavourite && (
        <div className={styles.edgecase}>
          That's all folks! No more videos for "{search}"
        </div>
      )}

      {!hasMore && !videos?.length && !showingFavourite && !!search.length && (
        <div className={styles.edgecase}>No videos found for "{search}"</div>
      )}
    </div>
  );
}
