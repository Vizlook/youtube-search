import { useState } from "react";
import {
  type AudioClip,
  type VideoClip,
  type VideoSummary,
  type SearchResultItem,
} from "@vizlook/sdk";
import { cn } from "@/lib/cn";

// Helper function to format seconds into MM:SS format
const formatTime = (timeInSeconds?: number) => {
  if (timeInSeconds === null || timeInSeconds === undefined) {
    return "00:00";
  }

  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
};

const PlayIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M8 5V19L19 12L8 5Z" fill="rgb(104, 114, 130)" />
  </svg>
);

type OnClickTimeFn = (startTime: number) => void;

const VideoToTextTab = ({
  videoClips,
  onClickTime,
}: {
  videoClips: VideoClip[];
  onClickTime: OnClickTimeFn;
}) => (
  <div className="space-y-4">
    {videoClips?.map((clip, index) => (
      <div key={index} className="bg-muted rounded-lg p-4">
        <div
          className="inline-flex items-center mb-2 cursor-pointer"
          onClick={() => onClickTime(clip.startTime)}
        >
          <button className="cursor-pointer">
            <PlayIcon />
          </button>
          <button className="text-gray-500 font-mono text-sm md:text-base ml-1 cursor-pointer">
            {formatTime(clip.startTime)} - {formatTime(clip.endTime)}
          </button>
        </div>
        <p className="text-gray-900 text-sm md:text-base">
          {clip.visualDescription}
        </p>
      </div>
    ))}
  </div>
);

const AudioTranscriptionTab = ({
  audioClips,
  onClickTime,
}: {
  audioClips: AudioClip[];
  onClickTime: OnClickTimeFn;
}) => (
  <div className="space-y-4">
    {audioClips?.map((clip, index) => (
      <div key={index} className="bg-muted rounded-lg p-4">
        <div
          className="inline-flex items-center mb-2 cursor-pointer"
          onClick={() => onClickTime(clip.startTime)}
        >
          <button className="cursor-pointer">
            <PlayIcon />
          </button>
          <button className="text-gray-500 font-mono text-sm md:text-base ml-1 cursor-pointer">
            {formatTime(clip.startTime)} - {formatTime(clip.endTime)}
          </button>
          <div className="font-semibold text-gray-900 ml-2 text-sm md:text-base">
            {clip.speakerId}
          </div>
        </div>
        <p className="text-gray-900 text-sm md:text-base">
          {clip.transcription}
        </p>
      </div>
    ))}
  </div>
);

const VideoSummaryTab = ({
  summary,
  onClickTime,
}: {
  summary?: VideoSummary;
  onClickTime: OnClickTimeFn;
}) => (
  <div className="space-y-4">
    <div>
      <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
        Overall Summary
      </h3>
      <p className="text-gray-900 text-sm md:text-base">
        {summary?.overallSummary}
      </p>
    </div>
    <div>
      <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
        Sections
      </h3>
      <div className="space-y-4">
        {summary?.sectionSummaries?.map((section, index) => (
          <div key={index} className="bg-muted rounded-lg p-4">
            <div
              className="inline-flex items-center mb-2 cursor-pointer"
              onClick={() => onClickTime(section.startTime)}
            >
              <button className="cursor-pointer">
                <PlayIcon />
              </button>
              <button className="text-gray-500 font-mono text-sm md:text-base ml-1 cursor-pointer">
                {formatTime(section.startTime)} - {formatTime(section.endTime)}
              </button>
            </div>
            <h4 className="font-semibold text-base md:text-lg text-gray-900 mb-1">
              {section.title}
            </h4>
            <p className="text-gray-900 text-sm md:text-base">
              {section.summary}
            </p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

enum TabId {
  VideoToText,
  AudioTranscription,
  Summary,
}

export const VideoTranscription = ({
  item,
  onClickTime,
}: {
  item: SearchResultItem;
  onClickTime: OnClickTimeFn;
}) => {
  const [activeTab, setActiveTab] = useState<TabId>(TabId.VideoToText);
  const tabs: {
    id: TabId;
    label: string;
    show: boolean;
  }[] = [
    {
      id: TabId.VideoToText,
      label: "Video to Text",
      show: !!item.transcription?.videoClips,
    },
    {
      id: TabId.AudioTranscription,
      label: "Audio Transcription",
      show: !!item.transcription?.audioClips,
    },
    {
      id: TabId.Summary,
      label: "Summary",
      show: !!item.summary,
    },
  ].filter((tab) => tab.show);

  return (
    <div className="bg-white font-sans w-full flex-1 flex flex-col rounded-lg overflow-hidden border border-border p-4">
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
          {activeTab === TabId.VideoToText && (
            <VideoToTextTab
              videoClips={item.transcription?.videoClips || []}
              onClickTime={onClickTime}
            />
          )}
          {activeTab === TabId.AudioTranscription && (
            <AudioTranscriptionTab
              audioClips={item.transcription?.audioClips || []}
              onClickTime={onClickTime}
            />
          )}
          {activeTab === TabId.Summary && (
            <VideoSummaryTab summary={item.summary} onClickTime={onClickTime} />
          )}
        </div>
      </div>
    </div>
  );
};
