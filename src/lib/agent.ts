import { GoogleGenerativeAI } from "@google/generative-ai";
import { type SearchResultItem } from "@vizlook/sdk";
import { z } from "zod";

const unwrapJsonCodeBlock = (str: string): string => {
  const startDelimiter = "```json";
  const endDelimiter = "```";

  const startIndex = str.indexOf(startDelimiter);
  if (startIndex === -1) {
    return str;
  }

  const endIndex = str.indexOf(
    endDelimiter,
    startIndex + startDelimiter.length
  );
  if (endIndex === -1) {
    return str;
  }

  return str.substring(startIndex + startDelimiter.length, endIndex);
};

const extractInfoSchema = z.object({
  voice_text: z.string(),
  screen_text: z.string(),
});

const geminiAIClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const extractVoiceAndScreenTextFromQuery = async (query: string) => {
  const prompt = `You are an AI model specializing in semantic extraction from user queries. Your task is to analyze a user's query about a video and extract text that is explicitly described as being spoken or visible on-screen within the video.

You MUST respond with a single, raw JSON object. Do not include any explanatory text.

*   The JSON object must contain two keys: \`voice_text\` and \`screen_text\`.
*   \`voice_text\`: Contains text the query explicitly states is spoken in the video (e.g., "speaker says...", "character shouts..."). The user's own question or the general topic of the query is not spoken dialogue. If no dialogue is explicitly mentioned, its value must be \`""\`.
*   \`screen_text\`: Contains text the query explicitly states is visible on screen (e.g., "title is...", "sign says..."). If no on-screen text is explicitly mentioned, its value must be \`""\`.

---

**Example 1:**
**Query:** "In the video, the speaker says 'welcome to our channel' and the title on the screen is 'My First Vlog'."
**Output:**
{
  "voice_text": "welcome to our channel",
  "screen_text": "My First Vlog"
}

---

**Example 2:**
**Query:** "Show me the part where the sign says 'Danger: High Voltage'."
**Output:**
{
  "voice_text": "",
  "screen_text": "Danger: High Voltage"
}

---

**Example 3:**
**Query:** "Find the scene where the character shouts 'I'll be back'."
**Output:**
{
  "voice_text": "I'll be back",
  "screen_text": ""
}

---

**Example 4:**
**Query:** "I'm looking for a video about cute cats."
**Output:**
{
  "voice_text": "",
  "screen_text": ""
}

---

**Example 5:**
**Query:** "What is machine learning? The screen text must include 'Deep Learning'."
**Output:**
{
  "voice_text": "",
  "screen_text": "Deep Learning"
}

---

**Your Task:**

**Query:** ${query}

**Output:**`;

  const model = geminiAIClient.getGenerativeModel({
    model: "gemini-2.0-flash",
  });
  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 1,
      maxOutputTokens: 1000,
    },
  });

  const response = extractInfoSchema.parse(
    JSON.parse(unwrapJsonCodeBlock(result.response.text()))
  );

  return {
    voiceText: response.voice_text,
    screenText: response.screen_text,
  };
};

export const answer = async (
  query: string,
  citations: SearchResultItem[]
): Promise<string> => {
  const context = citations.map(
    ({ url, title, author, publishedDate, highlights, summary }) => ({
      contentType: "video",
      videoUrl: url,
      title,
      author,
      publishedDate,
      highlightVideoClips: highlights,
      videoSummary: summary,
    })
  );

  const model = geminiAIClient.getGenerativeModel({
    model: "gemini-2.0-flash",
  });
  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `## 1. CORE DIRECTIVE
You are an assistant for question-answering tasks. Use the following pieces of retrieved context to answer the question. If you don't know the answer, just say that you don't know. Use five sentences maximum and keep the answer concise.

## 2. CORE PRINCIPLES (Non-negotiable)
- Do not infer, guess, or add information not explicitly present.
- Never refer to the \`CONTEXT\` itself. State information as fact. Prohibited phrases include "According to the source...", "The context mentions...", etc.
- The answer must be in the same language as the \`QUESTION\`.

## 3. EXECUTION WORKFLOW
You will execute the following three steps in order:
1.  First, analyze the \`QUESTION\` to identify its core intent. Then, scan all sources in the \`CONTEXT\` and ruthlessly discard any that are not directly relevant to answering the question. Proceed using only the filtered, relevant sources.
2.  This is your primary task. Extract all key facts from the filtered sources. Group these facts by logical theme or sub-topic, not by their source. Weave these thematically-grouped facts into a single, coherent, and logical narrative that directly answers the user's question. The flow must be natural and human-like.
3.  As you write each sentence or self-contained block of information, append the correct citation(s) at the very end.

## 4. OUTPUT & CITATION FORMAT
- The final output must be only the answer text with inline citations. No introductory or concluding phrases.
- A citation must be placed at the end of the sentence or group of consecutive sentences supported by the exact same source(s). Place citations after the final punctuation of a sentence.
- Single citation format is \`([author.name](videoUrl))\`. Multiple citations format is \`([author1.name](videoUrl1), [author2.name](videoUrl2))\`.

---

QUESTION: ${query}

CONTEXT: ${JSON.stringify(context)}

ANSWER:`,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 1,
      maxOutputTokens: 2000,
    },
  });

  return result.response.text();
};
