import { type SearchResultItem } from "@vizlook/sdk";
import YouTube, { type YouTubePlayer, type YouTubeProps } from "react-youtube";
import { useEffect, useMemo, useRef, useState } from "react";
import { VideoTranscription } from "./video-transcription";

type Options = YouTubeProps["opts"];

const extractYoutubeVideoIdFromUrl = (url: string): string | undefined => {
  // handle YouTube URL: https://www.youtube.com/watch?v=VIDEO_ID
  let match = url.match(
    /^(?:https?:\/\/)?www\.youtube\.com\/watch\?.*v=([^&]+)/
  );
  if (match?.[1]) {
    return match[1];
  }

  // handle YouTube URL: https://www.youtube.com/embed/VIDEO_ID
  match = url.match(/^(?:https?:\/\/)?www\.youtube\.com\/embed\/([^&\?\n]+)/);
  if (match?.[1]) {
    return match[1];
  }

  // handle YouTube URL: https://youtu.be/VIDEO_ID
  match = url.match(/^(?:https?:\/\/)?youtu\.be\/([^&\?\n]+)/);
  if (match?.[1]) {
    return match[1];
  }

  return undefined;
};

const videoRatio = 9 / 16;

export const VideoPlayer = ({
  citation,
  onClose,
}: {
  citation: SearchResultItem;
  onClose?: () => void;
}) => {
  const videoId = useMemo(
    () => extractYoutubeVideoIdFromUrl(citation.url),
    [citation.url]
  );
  const [playOptions, setPlayOptions] = useState<Options | null>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const onReady = (event: { target: YouTubePlayer }) => {
    playerRef.current = event.target;
  };

  const handleSeekTo = async (seekTime: number) => {
    if (playerRef.current) {
      await playerRef.current.seekTo(seekTime, true);
      await playerRef.current.playVideo();
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      const width = containerRef.current.getBoundingClientRect().width;

      if (width < 640) {
        setPlayOptions({
          height: width * videoRatio,
          width: width,
          playerVars: {
            autoplay: 1 as 1,
            start: citation.highlights[0]?.startTime || 0,
          },
        });
      } else {
        setPlayOptions({
          height: 640 * videoRatio,
          width: 640,
          playerVars: {
            autoplay: 1 as 1,
            start: citation.highlights[0]?.startTime || 0,
          },
        });
      }
    }

    document.body.classList.add("overflow-hidden");

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85">
      <div
        className="relative mx-4 w-[92%] h-[95%] rounded-lg bg-white px-2 sm:px-4 py-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute -top-3 -right-3 flex size-7 md:size-8 items-center justify-center rounded-full bg-white text-2xl text-gray-600 shadow-md transition-colors hover:bg-gray-200 hover:text-black cursor-pointer"
          onClick={onClose}
        >
          &times;
        </button>
        <div
          ref={containerRef}
          className="w-full h-full flex flex-col xl:flex-row gap-4"
        >
          {!!playOptions && (
            <YouTube
              videoId={videoId}
              opts={playOptions}
              className="flex justify-center"
              iframeClassName="rounded-lg overflow-hidden"
              onReady={onReady}
            />
          )}
          <VideoTranscription item={citation} onClickTime={handleSeekTo} />
        </div>
      </div>
    </div>
  );
};
