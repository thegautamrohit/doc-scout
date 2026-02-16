import { crawlDocs } from "@/crawler/crawl";
import {
  createDocuments,
  createSource,
  updateSourceStatus,
} from "@/db/sources";
import { embedDocs } from "@/embed";
import { scrapeContent } from "@/scraper";
import { Document } from "@langchain/core/documents";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    console.log("Ask-doc route hit");
    return NextResponse.json({ message: "Ask-doc route hit" });
  } catch (error) {
    console.error("Error in ask-doc route:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const jsonReq = await req.json();

    const { sourceUrl } = jsonReq;

    if (!sourceUrl) {
      return NextResponse.json(
        {
          error: "Missing sourceUrl",
        },
        { status: 400 },
      );
    }

    const sourceId = await createSource(sourceUrl);

    await updateSourceStatus(sourceId, "crawling");

    const urls = await crawlDocs(
      sourceUrl,
      {
        maxDepth: 3,
        maxPages: 100,
        allowedDomain: sourceUrl,
      },
      sourceId,
    );

    await updateSourceStatus(sourceId, "scraping");

    const docsContent = await scrapeContent(urls);

    await updateSourceStatus(sourceId, "embedding");

    // Store content in SQL DB

    const docs: Document[] = [];

    for (const { content, url } of docsContent) {
      const docId = await createDocuments(sourceId, content, url);

      docs.push(
        new Document({
          pageContent: content,
          metadata: { source: sourceId, url, id: docId },
        }),
      );
    }

    // await embedDocs(docs, sourceId);

    await updateSourceStatus(sourceId, "completed");

    return NextResponse.json({ message: "Ask-doc-processing completed" });
  } catch (error) {
    console.error("Error in ask-doc route:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 },
    );
  }
}
