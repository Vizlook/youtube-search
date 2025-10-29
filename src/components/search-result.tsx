import { type SearchResultItem } from "@vizlook/sdk";
import { type SearchVideoResponse, type SearchMode } from "@/lib/types";
import { AnswerRenderer } from "./answer-renderer";
import { VideoCard } from "./video-card";
import { useState } from "react";
import { VideoPlayer } from "./video-player";

export const SearchResult = ({
  searchResponse,
  mode,
}: {
  searchResponse: SearchVideoResponse;
  mode: SearchMode;
}) => {
  const { answer, results } = searchResponse;
  const [selectedCitation, setSelectedCitation] =
    useState<SearchResultItem | null>(null);

  const handleClickCitation = (citation: SearchResultItem) => {
    setSelectedCitation(citation);
  };

  const handleClickLinkFromAnswer = (href: string) => {
    const citation = results.find((r) => r.url === href);

    if (citation) {
      handleClickCitation(citation);
    }
  };

  return (
    <div>
      {mode === "Answer" && answer ? (
        <div className="mb-4">
          <AnswerRenderer
            answer={answer}
            citationUrls={results.map((r) => r.url)}
            onClickLink={handleClickLinkFromAnswer}
          />
        </div>
      ) : null}
      {results.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((citation) => (
            <VideoCard
              key={citation.url}
              citation={citation}
              onClick={() => handleClickCitation(citation)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-lg">
          No matching results found. <br />
          We are rapidly expanding YouTube video data.
        </div>
      )}

      {!!selectedCitation && (
        <VideoPlayer
          citation={selectedCitation}
          onClose={() => setSelectedCitation(null)}
        />
      )}
    </div>
  );
};
