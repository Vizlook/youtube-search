import { useRef, useState, useImperativeHandle, forwardRef } from "react";
import {
  type AudioClip,
  type VideoClip,
  type VideoSummary,
  type SearchResultItem,
} from "@vizlook/sdk";
import { cn } from "@/lib/cn";
import { formatTime } from "@/lib/time";

const PlayIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M8 5V19L19 12L8 5Z" fill="rgb(104, 114, 130)" />
  </svg>
);

const highlightMarkClassName = "current-play-position";

const VideoToTextTab = ({
  videoClips,
  currentPlayTime,
  onClickTime,
}: {
  videoClips: VideoClip[];
  currentPlayTime: number;
  onClickTime: OnClickTimeFn;
}) => (
  <div className="space-y-4">
    {videoClips?.map((clip, index) => {
      const isHighlight =
        currentPlayTime >= clip.startTime && currentPlayTime < clip.endTime;

      return (
        <div
          key={index}
          className={cn("bg-muted rounded-lg p-4", {
            "bg-gray-300/70": isHighlight,
            [highlightMarkClassName]: isHighlight,
          })}
        >
          <div
            className="inline-flex items-center mb-2 cursor-pointer hover:opacity-75"
            onClick={() => onClickTime(clip.startTime)}
          >
            <button className="cursor-pointer">
              <PlayIcon />
            </button>
            <button className="text-gray-500 font-mono text-sm ml-1 cursor-pointer">
              {formatTime(clip.startTime)} - {formatTime(clip.endTime)}
            </button>
          </div>
          <p className="text-gray-900 text-sm">{clip.visualDescription}</p>
        </div>
      );
    })}
  </div>
);

const AudioTranscriptionTab = ({
  audioClips,
  currentPlayTime,
  onClickTime,
}: {
  audioClips: AudioClip[];
  currentPlayTime: number;
  onClickTime: OnClickTimeFn;
}) => (
  <div className="space-y-4">
    {audioClips?.map((clip, index) => {
      const isHighlight =
        currentPlayTime >= clip.startTime && currentPlayTime < clip.endTime;

      return (
        <div
          key={index}
          className={cn("bg-muted rounded-lg p-4", {
            "bg-gray-300/70": isHighlight,
            [highlightMarkClassName]: isHighlight,
          })}
        >
          <div
            className="inline-flex items-center mb-2 cursor-pointer hover:opacity-75"
            onClick={() => onClickTime(clip.startTime)}
          >
            <button className="cursor-pointer">
              <PlayIcon />
            </button>
            <button className="text-gray-500 font-mono text-sm ml-1 cursor-pointer">
              {formatTime(clip.startTime)} - {formatTime(clip.endTime)}
            </button>
            <div className="font-medium text-gray-900 ml-2 text-sm">
              {clip.speakerId}
            </div>
          </div>
          <p className="text-gray-900 text-sm">{clip.transcription}</p>
        </div>
      );
    })}
  </div>
);

const VideoSummaryTab = ({
  summary,
  currentPlayTime,
  onClickTime,
}: {
  summary?: VideoSummary;
  currentPlayTime: number;
  onClickTime: OnClickTimeFn;
}) => (
  <div className="space-y-4">
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Overall Summary
      </h3>
      <p className="text-gray-900 text-sm">{summary?.overallSummary}</p>
    </div>
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Sections</h3>
      <div className="space-y-4">
        {summary?.sectionSummaries?.map((section, index) => {
          const isHighlight =
            currentPlayTime >= section.startTime &&
            currentPlayTime < section.endTime;

          return (
            <div
              key={index}
              className={cn("bg-muted rounded-lg p-4", {
                "bg-gray-300/70": isHighlight,
                [highlightMarkClassName]: isHighlight,
              })}
            >
              <div
                className="inline-flex items-center mb-2 cursor-pointer hover:opacity-75"
                onClick={() => onClickTime(section.startTime)}
              >
                <button className="cursor-pointer">
                  <PlayIcon />
                </button>
                <button className="text-gray-500 font-mono text-sm ml-1 cursor-pointer">
                  {formatTime(section.startTime)} -{" "}
                  {formatTime(section.endTime)}
                </button>
              </div>
              <h4 className="font-semibold text-base text-gray-900 mb-1">
                {section.title}
              </h4>
              <p className="text-gray-900 text-sm">{section.summary}</p>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

enum TabId {
  AudioTranscription,
  VideoToText,
  Summary,
}

type OnClickTimeFn = (startTime: number) => void;
interface VideoTranscriptionProps {
  item: SearchResultItem;
  currentPlayTime: number;
  onClickTime: OnClickTimeFn;
}

export const VideoTranscription = forwardRef<
  {
    scrollHighlightIntoView: () => void;
  },
  VideoTranscriptionProps
>((props, ref) => {
  const { item, currentPlayTime, onClickTime } = props;
  const [activeTab, setActiveTab] = useState<TabId>(TabId.AudioTranscription);
  const tabs: {
    id: TabId;
    label: string;
    show: boolean;
  }[] = [
    {
      id: TabId.AudioTranscription,
      label: "Audio Transcript",
      show: !!item.transcription?.audioClips,
    },
    {
      id: TabId.VideoToText,
      label: "Video to Text",
      show: !!item.transcription?.videoClips,
    },
    {
      id: TabId.Summary,
      label: "Summary",
      show: !!item.summary,
    },
  ].filter((tab) => tab.show);

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollHighlightIntoView = () => {
    containerRef.current
      ?.getElementsByClassName(highlightMarkClassName)[0]
      ?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
  };

  useImperativeHandle(ref, () => ({
    scrollHighlightIntoView,
  }));

  return (
    <div
      ref={containerRef}
      className="bg-white font-sans w-full lg:max-xl:w-[400px] lg:max-xl:shrink-0 xl:flex-1 flex flex-col rounded-lg overflow-hidden border border-border p-4 min-h-[550px]"
    >
      <div className="flex border-b mb-5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center text-sm md:text-base p-2 md:px-3 transition-colors duration-200 ease-in-out cursor-pointer",
              {
                "border-b-2 border-gray-800 text-gray-800 font-semibold":
                  activeTab === tab.id,
                "text-gray-500 hover:text-gray-700": activeTab !== tab.id,
              }
            )}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full overflow-y-scroll">
          {activeTab === TabId.AudioTranscription && (
            <AudioTranscriptionTab
              audioClips={item.transcription?.audioClips || []}
              currentPlayTime={currentPlayTime}
              onClickTime={onClickTime}
            />
          )}
          {activeTab === TabId.VideoToText && (
            <VideoToTextTab
              videoClips={item.transcription?.videoClips || []}
              currentPlayTime={currentPlayTime}
              onClickTime={onClickTime}
            />
          )}
          {activeTab === TabId.Summary && (
            <VideoSummaryTab
              summary={item.summary}
              currentPlayTime={currentPlayTime}
              onClickTime={onClickTime}
            />
          )}
        </div>
      </div>
    </div>
  );
});
