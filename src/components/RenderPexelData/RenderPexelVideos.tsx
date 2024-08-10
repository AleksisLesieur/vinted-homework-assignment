import { useEffect, useRef, useState, useContext } from "react";
import styles from "./RenderPexelVideos.module.scss";
import { FavouritesContext } from "../FavouritesContextProvider";
import Loading from "./../../assets/Loading.svg";

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

const Default = "1080p";

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
      if (!closest) return current;
      if (!current.height) return closest;

      const closestDiff = Math.abs((closest.height || 0) - targetHeight);
      const currentDiff = Math.abs(current.height - targetHeight);

      return currentDiff < closestDiff ? current : closest;
    });

    return {
      ...video,
      video_files: [closestFile],
    };
  });
}

export default function RenderPexelImages(): JSX.Element {
  const [page, setPage] = useState<number>(1);
  const [showVideos, setShowVideos] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const controller = useRef(new AbortController());
  const observer = useRef<IntersectionObserver | null>(null);
  const lastVideoRef = useRef<HTMLVideoElement | null>(null);

  const { media, search, quality, showingFavourite } =
    useContext(FavouritesContext);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
  }, [search]);

  useEffect(() => {
    async function getVideos() {
      setLoading(true);
      try {
        controller.current.abort("Abort");

        const url = `https://api.pexels.com/videos/search?query=${search}&per_page=5&page=${page}`;

        const token =
          "FrWFCn9uBS7HA8RtewIBfrdQCl6qofLBF7WPwRiSSLUqL1cCLee1uIsj";
        controller.current = new AbortController();
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

        setVideos((prevVideos) =>
          page === 1 ? filteredVideos : [...prevVideos, ...filteredVideos]
        );

        setHasMore(data.page < Math.ceil(data.total_results / data.per_page));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    getVideos();
  }, [page, search, controller, quality]);

  useEffect(() => {
    setShowVideos(false);
    console.log;
    const timer = setTimeout(() => {
      setShowVideos(true);
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
    [loading, hasMore, videos, showingFavourite]
  );

  return (
    <div className={styles.videosContainer}>
      {videos.map((video, index) => (
        <div key={index} className={styles.videoContainer}>
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
        </div>
      ))}
    </div>
  );
}
