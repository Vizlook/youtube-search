import Vizlook from "@vizlook/sdk";
import { answer, extractKeyInformationFromQuery } from "@/lib/agent";
import { type SearchVideoResponse } from "@/lib/types";
import { type NextRequest } from "next/server";
import { z } from "zod";

const vizlookClient = new Vizlook({
  apiKey: process.env.VIZLOOK_API_KEY,
});

const requestBodySchema = z.object({
  query: z.string().trim().min(1, { message: "The query cannot be empty." }),
  mode: z.enum(["Search", "Answer"]),
});

export async function POST(request: NextRequest) {
  const parsedBody = requestBodySchema.safeParse(await request.json());

  if (!parsedBody.success) {
    console.error(parsedBody.error);
    return new Response("Bad Request", {
      status: 400,
    });
  }

  try {
    const body = parsedBody.data;

    const { voiceText, screenText, optimizedQuery } =
      await extractKeyInformationFromQuery(body.query);

    const resultItems = (
      await vizlookClient.search(optimizedQuery || body.query, {
        containSpokenText: voiceText || undefined,
        containScreenText: screenText || undefined,
        maxResults: 6,
        includeTranscription: true,
        includeSummary: true,
      })
    ).results;

    const response: SearchVideoResponse = {
      results: resultItems,
    };

    if (body.mode === "Answer" && resultItems.length > 0) {
      response.answer = await answer(body.query, resultItems);
    }

    return Response.json(response);
  } catch (err) {
    console.error(err);
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
}
