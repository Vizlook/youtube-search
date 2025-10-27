import { type SearchResultItem } from "@vizlook/sdk";

export type SearchMode = "Search" | "Answer";

export interface SearchVideoResponse {
  answer?: string;
  results: SearchResultItem[];
}
