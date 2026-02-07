import * as cheerio from "cheerio";

export const extractLinks = (html: string, baseUrl: string): string[] => {
  const $ = cheerio.load(html);
  const links = new Set<string>();

  $("a[href]").each((_, element) => {
    const href = $(element).attr("href");
    if (href) {
      try {
        const absoluteUrl = new URL(href, baseUrl).href;
        links.add(absoluteUrl);
      } catch (error) {
        // Skip invalid URLs
      }
    }
  });

  return Array.from(links);
};
