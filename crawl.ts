import { extractLinks } from "./crawler/extract";
import { getRobotsParser } from "./crawler/robots";
import { rateLimitter } from "./crawler/rate-limitter";
import { isValidDocUrl } from "./crawler/filter";
import { normalizeUrl } from "./crawler/normalize";
import { saveCheckpoint, loadCheckpoint } from "./crawler/checkpoint";
import { CrawlResult } from "./crawler/types";

interface CrawlerState {
  visited: Set<string>;
  queue: string[];
}

export const crawl = async (
  startUrl: string,
  maxPages: number = 100,
): Promise<CrawlResult> => {
  const baseUrl = new URL(startUrl).origin;
  console.log(`Starting crawl from ${startUrl} with base ${baseUrl}`);

  // Load checkpoint or initialize state
  let state: CrawlerState = { visited: new Set(), queue: [startUrl] };
  const checkpoint = loadCheckpoint();
  if (checkpoint) {
    state = {
      visited: new Set(checkpoint.visited),
      queue: checkpoint.queue,
    };
    console.log(
      `Resuming from checkpoint: ${state.visited.size} visited, ${state.queue.length} in queue`,
    );
  }

  const robot = await getRobotsParser(baseUrl);

  while (state.queue.length > 0 && state.visited.size < maxPages) {
    const currentUrl = state.queue.shift()!;

    if (state.visited.has(currentUrl)) continue;

    // Check robots.txt
    if (robot && !robot.isAllowed(currentUrl, "DocScoutBot")) {
      console.log(`Skipping (disallowed by robots.txt): ${currentUrl}`);
      continue;
    }

    try {
      console.log(`Crawling: ${currentUrl}`);
      await rateLimitter(); // Be polite

      const response = await fetch(currentUrl);
      if (!response.ok) {
        console.error(`Failed to fetch ${currentUrl}: ${response.statusText}`);
        continue;
      }

      const html = await response.text();
      state.visited.add(currentUrl);

      // Extract new links
      const links = extractLinks(html, currentUrl);

      for (const link of links) {
        const normalized = normalizeUrl(link);
        if (
          normalized &&
          !state.visited.has(normalized) &&
          isValidDocUrl(normalized, baseUrl) &&
          !state.queue.includes(normalized)
        ) {
          state.queue.push(normalized);
        }
      }

      // Save checkpoint periodically (every 10 pages or so, but doing every one for now for safety)
      saveCheckpoint({
        visited: Array.from(state.visited),
        queue: state.queue,
      });
    } catch (error) {
      console.error(`Error crawling ${currentUrl}:`, error);
    }
  }

  console.log(`Crawl finished. Visited ${state.visited.size} pages.`);
  return { urls: Array.from(state.visited) };
};

// Execution block
if (require.main === module) {
  const args = process.argv.slice(2);
  const startUrl = args[0]

  crawl(startUrl)
    .then((result) => {
      console.log("Final Crawled URLs:");
      console.log(JSON.stringify(result.urls, null, 2));
    })
    .catch((err) => console.error("Crawl failed:", err));
}
