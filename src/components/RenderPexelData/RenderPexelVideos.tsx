import { useEffect, useRef, useState, useContext } from "react";
import styles from "./RenderPexelVideos.module.scss";
import Loading from "./../../assets/Loading.svg";
import { FavouritesContext } from "../FavouritesContextProvider";

interface PexelsVideoSearchResponse {
  next_page: string;
  page: number;
  per_page: number;
  total_results: number;
  url: string;
  videos: Video[];
}

interface Video {
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

const DEFAULT_QUALITY = "1080p";

const QUALITY_HEIGHT_MAP: { [key: string]: number } = {
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
    QUALITY_HEIGHT_MAP[desiredQuality] || QUALITY_HEIGHT_MAP[DEFAULT_QUALITY];

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
  const [videos, setVideos] = useState<Video[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const controller = useRef(new AbortController());
  const observer = useRef<IntersectionObserver | null>(null);
  const lastVideoRef = useRef<HTMLImageElement | null>(null);

  const { media, search, quality } = useContext(FavouritesContext);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
  }, [search]);

  useEffect(() => {
    async function getPictures() {
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
      }
    }
    getPictures();
  }, [page, search, controller, quality]);

  return (
    <div className={styles.videosContainer}>
      {videos.map((video) => (
        <div key={video.id} className={styles.videoContainer}>
          <video controls width="90%" height="90%">
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
