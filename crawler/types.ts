// ingestion/crawler/types.ts
export interface CrawlOptions {
  maxDepth: number;
  maxPages: number;
  allowedDomain: string;
}

export interface CrawlResult {
  urls: string[];
}
