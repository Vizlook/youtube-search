import { cn } from "@/lib/cn";
import { formatTime } from "@/lib/time";
import { type VideoSummary } from "@vizlook/sdk";

const getBackgroundColor = (index: number): string => {
  const bgColors = [
    "#e6f5c8",
    "#d1e0f8",
    "#f7f3d3",
    "#c8f5f3",
    "#f5c8e4",
    "#c8e4f5",
    "#e4f5c8",
    "#f5d1c8",
    "#e0c8f5",
    "#c8f5d1",
    "#f5e4c8",
    "#d3c8f5",
    "#b3e6b3",
    "#e6b3b3",
    "#b3b3e6",
    "#b3e6e6",
    "#e6b3e6",
    "#e6e6b3",
    "#f0f8ff",
    "#faebd7",
  ];

  return bgColors[index % bgColors.length];
};

type OnClickTimeFn = (startTime: number) => void;

export const VideoTimeline = ({
  summary,
  currentPlayTime,
  onClickTime,
}: {
  summary?: VideoSummary;
  currentPlayTime: number;
  onClickTime: OnClickTimeFn;
}) => {
  const sections = summary?.sectionSummaries || [];

  return sections.length === 0 ? null : (
    <div className="w-full mt-4 border border-border rounded-lg lg:flex-1 lg:overflow-hidden relative min-h-[190px]">
      <div className="lg:absolute left-0 top-0 w-full h-full overflow-y-scroll space-y-2 p-4">
        {sections.map((section, index) => {
          const isHighlight =
            currentPlayTime >= section.startTime &&
            currentPlayTime < section.endTime;

          return (
            <button
              key={section.title}
              className={cn(
                "w-full p-2 px-3 flex flex-col sm:flex-row items-start sm:items-center text-sm rounded-md cursor-pointer",
                {
                  "scale-x-[103%] shadow-[2px_2px_10px_rgba(0,0,0,0.2)]":
                    isHighlight,
                }
              )}
              style={{ backgroundColor: getBackgroundColor(index) }}
              onClick={() => onClickTime(section.startTime)}
            >
              <span className="text-gray-500 w-[110px] shrink-0 text-left">
                {formatTime(section.startTime)} - {formatTime(section.endTime)}
              </span>
              <p className="text-gray-900 font-medium text-left line-clamp-2">
                {section.title}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
