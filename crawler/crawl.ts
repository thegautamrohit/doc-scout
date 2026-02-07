// ingestion/crawler/crawl.ts
import { extractLinks } from "./extract";
import { normalizeUrl } from "./normalize";
import { isValidDocUrl } from "./filter";
import { CrawlOptions } from "./types";
import { rateLimitter } from "./rate-limitter";
import { getRobotsParser } from "./robots";
import { saveCheckpoint, loadCheckpoint } from "./checkpoint";

export async function crawlDocs(
  startUrl: string,
  options: CrawlOptions,
): Promise<string[]> {
  const robots = await getRobotsParser(startUrl);

  const checkpoint = loadCheckpoint();
  const queue: { url: string; depth: number }[] = checkpoint?.queue ?? [
    { url: startUrl, depth: 0 },
  ];

  const visited = new Set<string>(checkpoint?.visited ?? []);
  const results: string[] = checkpoint?.results ?? [];

  while (queue.length && results.length < options.maxPages) {
    const { url, depth } = queue.shift()!;
    const normalized = normalizeUrl(url);

    if (!normalized || visited.has(normalized)) continue;
    if (depth > options.maxDepth) continue;

    if (robots && !robots.isAllowed(normalized, "RAGBot/1.0")) {
      console.log(`Skipped by robots.txt: ${normalized}`);
      continue;
    }

    visited.add(normalized);
    results.push(normalized);

    if (results.length % 5 === 0) {
      saveCheckpoint({
        queue,
        visited: Array.from(visited),
        results,
      });
      console.log(`Saved checkpoint at ${results.length} pages`);
    }

    try {
      await rateLimitter(300);
      const res = await fetch(normalized);
      const html = await res.text();

      const links = extractLinks(html, normalized);

      for (const link of links) {
        const clean = normalizeUrl(link);
        if (
          clean &&
          !visited.has(clean) &&
          isValidDocUrl(clean, options.allowedDomain)
        ) {
          queue.push({ url: clean, depth: depth + 1 });
        }
      }
    } catch {
      continue;
    }
  }

  return results;
}

const main = async (url:string) => {
  const options: CrawlOptions = {
    maxDepth: 3,
    maxPages: 100,
    allowedDomain: url,
  };

  const results = await crawlDocs(url, options);
  console.log(results);
};

main("https://js.langchain.com");
