# YouTube Search

### Powered by [Vizlook](https://www.vizlook.com) - The Video Search Engine for AI Applications

![Screenshot](https://youtube-search.vizlook.com/youtube-search-screenshot.png)

## What is YouTube Search?

YouTube Search is a free and open-source tool that lets you search the content inside YouTube videos. Instead of scrubbing through timelines, you can find the exact moment you need by describing it. Search for spoken dialogue, on-screen text, or a combination of both. For example, you can find when a speaker says a specific quote, when a sign with 'Danger' appears, or find a lecture on 'Machine Learning' where the text 'Deep Learning' is visible on a slide.

## Tech Stack

- **Frontend & Server**: [Next.js](https://nextjs.org/docs) with App Router, [TailwindCSS](https://tailwindcss.com), TypeScript
- **Video Search Engine**: [Vizlook](https://www.vizlook.com)
- **AI Integration**: [Google Gemini AI](https://ai.google.dev/gemini-api/docs)
- **Hosting**: [Vercel](https://vercel.com)

## Getting Started

### Clone the repository

```bash
git clone https://github.com/vizlook/youtube-search.git
cd youtube-search
```

### Prerequisites

- Node.js
- [Vizlook API key](https://www.vizlook.com/dashboard/api-keys)
- [Google Gemini API key](https://aistudio.google.com/api-keys)
- optional [Google Tag Manager](https://support.google.com/tagmanager/answer/12811173) for analyze web

### Environment Setup

Create a `.env.local` file in the root directory with the following structure, or copy from `.env.example`:

```env
VIZLOOK_API_KEY=your_vizlook_api_key
GEMINI_API_KEY=your_gemini_api_key

# optional
GOOGLE_TAG_ID=your_google_tag_id
```

### Installation & Start

1. Install dependencies

```bash
pnpm install
```

2. Run the development server

```bash
pnpm dev
```

3. Open http://localhost:3000 in your browser

## About [Vizlook](https://www.vizlook.com)

Vizlook is a powerful video search engine that equips AI products with meaningful video context through a simple API. Vizlook enables applications to search the actual visual and spoken content within a vast library of videos.

We handle the complex processes of video analysis and indexing, allowing your AI to instantly find relevant moments based on what is seen and said. With our specialized API suite, you can integrate sophisticated video search capabilities to provide your AI product with a deeper level of understanding.

---

Built by team [Vizlook](https://www.vizlook.com)
