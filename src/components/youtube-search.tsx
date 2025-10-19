"use client";

import Link from "next/link";
import { SearchInput, type SearchMode } from "./search-input";

export const YouTubeSearch = () => {
  const handleSearch = (query: string, mode: SearchMode) => {
    console.log("Searching for:", query, mode);
    // 实际搜索逻辑
  };

  return (
    <main className="container min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col justify-center py-8">
        <div className="w-full max-w-3xl mx-auto">
          <h1 className="text-center text-2xl sm:text-4xl mb-4 font-medium">
            YouTube Video Search
          </h1>
          <p className="text-base mb-4 text-center">
            Search what's said and shown in YouTube videos. Videos cover
            healthcare, technology, education, finance, and e-commerce. Powered
            by{" "}
            <Link
              href="https://www.vizlook.com/"
              target="_blank"
              className="underline hover:opacity-65"
            >
              Vizlook - The Video Search Engine
            </Link>
            .
          </p>
          <div>
            <SearchInput onSearch={handleSearch} />
          </div>
        </div>
      </div>
      <div className="w-full h-[3.5rem] footer-placehold"></div>
    </main>
  );
};
