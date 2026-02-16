import Database from "better-sqlite3";

export function initDB(db: Database.Database) {
  db.exec(
    `
          CREATE TABLE IF NOT EXISTS sources (
          id TEXT PRIMARY KEY,
          url TEXT NOT NULL,
          status TEXT NOT NULL,
          total_pages INTEGER DEFAULT 0,
          pages_crawled INTEGER DEFAULT 0,
          chunks_embedded INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );

          CREATE TABLE IF NOT EXISTS documents (
          id TEXT PRIMARY KEY,
          source_id TEXT NOT NULL,
          url TEXT NOT NULL,
          title TEXT,
          content TEXT,
          content_hash TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (source_id) REFERENCES sources(id)
          )
    `,
  );
}
