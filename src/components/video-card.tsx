import { type SearchResultItem } from "@vizlook/sdk";

const PlayIcon = () => (
  <svg
    width="56"
    height="56"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
      fill="rgba(0, 0, 0, 0.6)"
    />
    <path d="M9.5 16.5v-9L16 12l-6.5 4.5z" fill="#FFFFFF" />
  </svg>
);

const formatTime = (totalSeconds: number): string => {
  // 1. Handle invalid or edge case inputs
  if (
    typeof totalSeconds !== "number" ||
    isNaN(totalSeconds) ||
    totalSeconds < 0
  ) {
    return "0:00";
  }

  // 2. Calculate hours, minutes, and remaining seconds
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  // 3. Pad seconds with a leading zero if needed
  const paddedSeconds = String(seconds).padStart(2, "0");

  // 4. Construct the final time string
  if (hours > 0) {
    // For durations of an hour or more, format as h:mm:ss
    const paddedMinutes = String(minutes).padStart(2, "0");
    return `${hours}:${paddedMinutes}:${paddedSeconds}`;
  } else {
    // For durations less than an hour, format as m:ss
    return `${minutes}:${paddedSeconds}`;
  }
};

interface Props {
  citation: SearchResultItem;
  onClick?: () => void;
}

export const VideoCard = ({ citation, onClick }: Props) => {
  const { title, author, publishedDate, duration, thumbnail, highlights } =
    citation;

  const highlightStartPercentage = highlights[0]
    ? (highlights[0].startTime / duration) * 100
    : 0;
  const highlightDurationSeconds = highlights[0]
    ? highlights[0].endTime - highlights[0].startTime
    : 0;
  const highlightPercentage = (highlightDurationSeconds / duration) * 100;
  const highlightTooltipPositionLeft = !highlights[0]
    ? "0"
    : `${
        ((highlights[0].startTime + highlights[0].endTime) / 2 / duration) * 100
      }%`;

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-xl overflow-hidden shadow-lg bg-white text-left hover:cursor-pointer flex flex-col"
    >
      <div
        // @ts-ignore
        style={{ "--image-url": `url(${thumbnail.url})` }}
        className="relative pt-[56.25%] bg-gray-200 text-white bg-[image:var(--image-url)] bg-cover bg-center"
      >
        <div className="absolute top-1/2 left-1/2 -translate-1/2 text-white mr-2">
          <PlayIcon />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center gap-2">
          <div className="flex-grow">
            <div className="relative h-1 bg-gray-500/70 rounded-full">
              <div
                className="absolute top-0 h-1 bg-primary rounded-full"
                style={{
                  width: `${highlightPercentage}%`,
                  left: `${highlightStartPercentage}%`,
                }}
              />

              <div
                className="absolute top-1/6"
                style={{ left: highlightTooltipPositionLeft }}
              >
                <div className="absolute bottom-full mb-1.5 -translate-x-1/2 left-0">
                  <div className="relative px-2 py-1 bg-primary text-white text-xs rounded">
                    {highlightDurationSeconds}s
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-[4px] border-t-primary"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-xs font-mono bg-black/60 text-white px-1 py-0.5 rounded-sm">
            {formatTime(duration)}
          </div>
        </div>
      </div>

      <div className="p-2 flex-1 flex items-center">
        <div className="size-8 rounded-full overflow-hidden bg-gray-200 mr-3 flex-shrink-0">
          <img src={author.avatar} className="w-full h-full object-cover" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">
            {title}
          </h3>
          <p className="text-sm text-gray-600 truncate">{author.name}</p>
          <p className="text-xs text-gray-600">
            {new Date(publishedDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
    </button>
  );
};
