// Helper function to format seconds into MM:SS format
export const formatTime = (timeInSeconds?: number): string => {
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
