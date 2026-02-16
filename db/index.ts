import Database from "better-sqlite3";
import path from "path";
import { initDB } from "./schema";

const dbPath = path.join(process.cwd(), "doc-scout.db");

export const db = new Database(dbPath);

// enable WAL mode (important)
db.exec("PRAGMA journal_mode = WAL;");

initDB(db);
