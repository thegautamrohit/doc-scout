import { db } from "./index";
import crypto from "crypto";

export const createSource = (url: string) => {
  const id = crypto.randomUUID();

  db.prepare(
    `
    INSERT INTO sources (id, url, status)
    VALUES (?, ?, ?)
    `,
  ).run(id, url, "PENDING");

  return id;
};

export const createDocuments = (
  sourceId: string,
  content: string,
  url: string,
) => {
  const id = crypto.randomUUID();

  db.prepare(
    `
    INSERT INTO documents (id, source_id, url, title, content, content_hash)
    VALUES (?, ?, ?, ?, ?, ?)
    `,
  ).run(id, sourceId, url, url, content, "content_hash");

  return id;
};

export const updateSourceStatus = (
  sourceId: string,
  status:
    | "pending"
    | "crawling"
    | "scraping"
    | "embedding"
    | "completed"
    | "failed",
) => {
  db.prepare(
    `
        UPDATE sources
        SET status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
        `,
  ).run(status, sourceId);
};

export const updateTotalPages = (sourceId: string, totalPages: number) => {
  db.prepare(
    `
        UPDATE sources 
        SET total_pages = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
        `,
  ).run(totalPages, sourceId);
};

export const incrementPagesCrawled = (sourceId: string) => {
  db.prepare(
    `
        UPDATE sources
        SET pages_crawled = pages_crawled + 1,
        updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
        `,
  ).run(sourceId);
};

export const incrementChunksEmbedded = (sourceId: string) => {
  db.prepare(
    `
        UPDATE sources 
        SET chunks_embedded = chunks_embedded + 1,
        updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
        `,
  ).run(sourceId);
};
