import { type SearchResultItem } from "@vizlook/sdk";
import { useEffect, useMemo, useRef, useState } from "react";
import YouTube, { type YouTubePlayer } from "react-youtube";
import { VideoTimeline } from "./video-timeline";
import { VideoTranscription } from "./video-transcription";

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
  const playerOptions = useMemo(
    () => ({
      height: 405,
      width: 720,
      playerVars: {
        autoplay: 1 as 1,
        start: citation.highlights[0]?.startTime || 0,
      },
    }),
    [citation.highlights]
  );
  const playerRef = useRef<YouTubePlayer | null>(null);
  const transcriptionRef = useRef<{ scrollHighlightIntoView: () => void }>(
    null
  );

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [currentPlayTime, setCurrentPlayTime] = useState<number>(0);

  const onReady = (event: { target: YouTubePlayer }) => {
    playerRef.current = event.target;

    setCurrentPlayTime(citation.highlights[0]?.startTime || 0);
    setTimeout(() => {
      transcriptionRef.current?.scrollHighlightIntoView();
    }, 100);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(async () => {
      const currentTime = (await playerRef.current?.getCurrentTime()) ?? 0;
      setCurrentPlayTime(currentTime);
    }, 1000);
  };

  const handleSeekTo = async (seekTime: number) => {
    if (playerRef.current) {
      await playerRef.current.seekTo(seekTime, true);
      await playerRef.current.playVideo();

      setCurrentPlayTime(seekTime);
      setTimeout(() => {
        transcriptionRef.current?.scrollHighlightIntoView();
      }, 100);
    }
  };

  useEffect(() => {
    document.body.classList.add("overflow-hidden");

    return () => {
      document.body.classList.remove("overflow-hidden");

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
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
        <div className="w-full h-full overflow-hidden relative">
          <div className="absolute left-0 top-0 w-full h-full overflow-auto flex flex-col lg:flex-row gap-4">
            <div className="w-full max-w-[720px] mx-auto lg:flex-1 block lg:flex flex-col">
              <YouTube
                videoId={videoId}
                opts={playerOptions}
                className="relative overflow-hidden rounded-lg aspect-video bg-muted shrink-0"
                iframeClassName="absolute top-0 left-0 w-full h-full"
                onReady={onReady}
              />
              <VideoTimeline
                summary={citation.summary}
                currentPlayTime={currentPlayTime}
                onClickTime={handleSeekTo}
              />
            </div>
            <VideoTranscription
              ref={transcriptionRef}
              item={citation}
              currentPlayTime={currentPlayTime}
              onClickTime={handleSeekTo}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
