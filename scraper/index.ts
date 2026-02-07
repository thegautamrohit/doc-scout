import { crawlDocs } from "../crawler/crawl";
import { Document } from "@langchain/core/documents";
import * as cheerio from "cheerio";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import pLimit from "p-limit";

type ContentExtractor = (html: string, url: string) => string | null;

const limit = pLimit(5);

const getUrls = async (url: string) => {
  const crawledUrls = await crawlDocs(url, {
    maxDepth: 2,
    maxPages: 3,
    allowedDomain: url,
  });

  return crawledUrls;
};

async function fetchRawHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; RAGBot/1.0; +https://doc-scout.com)",
    },
  });

  return await res.text();
}

const extractContent = (html: string, url: string): string | null => {
  return readabilityExtractor(html, url) ?? fallbackExtractor(html, url);
};

const readabilityExtractor: ContentExtractor = (html, url) => {
  const dom = new JSDOM(html, { url });
  const reader = new Readability(dom.window.document);
  const article = reader.parse();

  return article?.textContent ?? null;
};

const fallbackExtractor: ContentExtractor = (html) => {
  const $ = cheerio.load(html);
  $("script, style, nav, footer, header, aside").remove();

  const candidates = $("body *")
    .map((_, el) => $(el).text())
    .get()
    .filter((text) => text.length > 200);

  if (!candidates.length) return null;

  // Pick the longest meaningful block
  return candidates.sort((a, b) => b.length - a.length)[0];
};

const createDocuments = async (url: string) => {
  const urls = await getUrls(url);

  const docs = await Promise.all(
    urls.map((url) =>
      limit(async () => {
        const html = await fetchRawHtml(url);
        if (!html) return null;

        const content = extractContent(html, url);
        if (!content) return null;

        return new Document({
          pageContent: content.replace(/\n{3,}/g, "\n\n").trim(),
          metadata: { source: url },
        });
      }),
    ),
  );

  return docs.filter(Boolean);
};

createDocuments("https://docs.langchain.com/").then((res) => {
  console.log(res, "<<<<<<RESPONSE>>>>>>>");
});
