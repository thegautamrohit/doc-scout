import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { getVectorStore } from "@/vectorStore";
import { incrementChunksEmbedded } from "@/db/sources";

export const embedDocs = async (docs: Document[], sourceId?: string) => {
  try {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const chunks = await splitter.splitDocuments(docs);

    const vectorStore = await getVectorStore();

    await vectorStore.addDocuments(chunks);

    if (sourceId) {
      // Assuming we can just increment once for all chunks or loop?
      // The DB function increments by 1.
      // "chunks_embedded = chunks_embedded + 1"
      // We should probably call it for each chunk or update the DB function to accept a count.
      // Given the DB function is "incrementChunksEmbedded", it implies +1.
      // But doing a DB call for EACH chunk is bad.
      // However, I will follow the pattern for now, maybe call it in a loop or just once if it represents a "batch".
      // Re-reading `db/sources.ts`: "SET chunks_embedded = chunks_embedded + 1".
      // It seems to count chunks.
      // Let's call it for each chunk for correctness, or better, update the DB function.
      // I'll stick to the plan: "Call incrementChunksEmbedded for each chunk added (or batch update)."
      // I'll loop for now to be safe with existing DB code.
      for (const _ of chunks) {
        incrementChunksEmbedded(sourceId);
      }
    }
  } catch (error) {
    console.error("Error embedding documents:", error);
  }
};
