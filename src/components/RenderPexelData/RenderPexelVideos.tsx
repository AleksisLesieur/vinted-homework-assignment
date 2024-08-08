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

export default function RenderPexelImages(): JSX.Element {
  const [page, setPage] = useState<number>(1);
  const [showVideos, setShowVideos] = useState<boolean>(true);
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const controller = useRef(new AbortController());
  const observer = useRef<IntersectionObserver | null>(null);
  const lastVideoRef = useRef<HTMLImageElement | null>(null);

  const { media, search } = useContext(FavouritesContext);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
  }, [search]);

  useEffect(
    function () {
      async function getPictures() {
        // setIsLoadingMore(true);
        try {
          controller.current.abort("Abort");

          const url = `https://api.pexels.com/videos/search?query=${search}&per_page=${page}`;

          const token =
            "FrWFCn9uBS7HA8RtewIBfrdQCl6qofLBF7WPwRiSSLUqL1cCLee1uIsj";
          controller.current = new AbortController();
          const response = await fetch(url, {
            signal: controller.current.signal,
            headers: {
              Authorization: token,
            },
          });

          //   if (search?.length === 0) {
          //     setLoading(false);
          //   }

          const data: PexelsVideoSearchResponse = await response.json();
          setVideos((prevVideos) =>
            page === 1
              ? data.videos[0].video_files
              : [...prevVideos, ...data.videos[0].video_files]
          );

          setHasMore(data.page < Math.ceil(data.total_results / data.per_page));
        } catch (err) {
          console.error(err);
        } finally {
          //   setLoading(false);
          // setIsLoadingMore(false);
        }
      }
      getPictures();
    },
    [page, search, controller]
  );

  //   useEffect(() => {
  //     setShowImages(false);
  //     const timer = setTimeout(() => {
  //       setShowImages(true);
  //     }, 300);
  //     return () => clearTimeout(timer);
  //   }, [search]);

  return (
    <div>
      {videos.map(function (element, index) {
        console.log(element);
        return (
          <div key={index}>
            <video controls width="50%" height="50%">
              <source src={element.link} type={element.file_type} />
              Your browser does not support the video tag.
            </video>
          </div>
        );
      })}
    </div>
  );
}
