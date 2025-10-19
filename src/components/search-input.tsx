"use client";

import { ChangeEvent, FormEvent, useState, useRef, useEffect } from "react";
import { cn } from "@/lib/cn";
import { QUERY_TIPS } from "@/lib/constants";

export type SearchMode = "Search" | "Answer";

interface SearchInputProps {
  onSearch?: (query: string, mode: SearchMode) => void;
  placeholder?: string;
  className?: string;
}

export const SearchInput = ({
  onSearch,
  placeholder = "Ask anything...",
  className,
}: SearchInputProps) => {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<SearchMode>("Search");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (onSearch && query.trim()) {
      onSearch(query, mode);
    }
  };

  const selectQueryTip = (tip: string) => {
    setQuery(tip);
    if (onSearch && tip.trim()) {
      onSearch(tip, mode);
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [query]);

  return (
    <form onSubmit={handleSubmit} className={cn("relative w-full", className)}>
      <div className="relative flex flex-col w-full overflow-hidden rounded-lg border border-border focus-within:shadow-xs">
        <textarea
          ref={textareaRef}
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full px-4 py-3 outline-none resize-none min-h-[80px]"
          rows={1}
        />

        <div className="flex justify-between items-center px-4 py-2">
          <div className="flex items-center space-x-2 p-1 bg-muted rounded-md">
            <button
              type="button"
              onClick={() => setMode("Search")}
              className={cn(
                "px-3 py-1 text-sm rounded-md transition-colors border border-transparent hover:cursor-pointer",
                mode === "Search"
                  ? "bg-white text-primary border-primary"
                  : "text-gray-700"
              )}
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setMode("Answer")}
              className={cn(
                "px-3 py-1 text-sm rounded-md transition-colors border border-transparent hover:cursor-pointer",
                mode === "Answer"
                  ? "bg-white text-primary border-primary"
                  : "text-gray-700"
              )}
            >
              Answer
            </button>
          </div>

          <button
            type="submit"
            className="p-2 rounded-full bg-primary text-white hover:bg-primary/80 hover:cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
      {QUERY_TIPS.length > 0 ? (
        <div className="mt-4 space-y-2">
          {QUERY_TIPS.map((tip) => (
            <button
              type="button"
              key={tip}
              className="block px-2 py-1 text-sm border border-border rounded-md hover:cursor-pointer hover:bg-muted"
              onClick={() => selectQueryTip(tip)}
            >
              {tip}
            </button>
          ))}
        </div>
      ) : null}
    </form>
  );
};
