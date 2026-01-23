# DocAtlas

> Autonomous documentation intelligence powered by LangChain, RAG, and vector search.

DocAtlas allows users to input **any documentation URL** (for example: LangChain docs, framework docs, API references). The system automatically **crawls relevant pages**, **indexes them**, and enables **high-quality question answering** over the entire documentation set.

This project is built as a **production-oriented RAG system**, focusing on crawl control, ingestion pipelines, retrieval quality, and real-world scalability concerns.

---

## 🚀 Features

- 🔗 **Autonomous Documentation Crawling**
  Automatically discovers and fetches relevant internal documentation links starting from a root URL.

- 🧠 **Production-Grade RAG Pipeline**
  Semantic chunking, vector embeddings, similarity search, and grounded LLM responses.

- 📚 **Multi-page Context Understanding**
  Answers questions using context distributed across many documentation pages.

- ⚙️ **Configurable Ingestion Pipeline**
  Control crawl depth, allowed domains, chunk size, embedding models, and vector DB settings.

- 🧾 **Source-Aware Answers**
  Each response can be traced back to the originating documentation URLs.

- 🌐 **Framework-Agnostic Docs Support**
  Works with most modern documentation sites (MDX, HTML-based docs, API references).

---

## 🏗️ System Architecture

```
User URL Input
     ↓
Crawl Controller (URL discovery & filtering)
     ↓
LangChain Web Loaders (Content Extraction)
     ↓
Text Chunking & Metadata Enrichment
     ↓
Vector Database (Embeddings Storage)
     ↓
Retriever (Similarity / Hybrid Search)
     ↓
LLM Answer Generation
```

---

## 🛠️ Tech Stack

- **Frontend**: Next.js (React)
- **Backend**: Node.js (API Routes)
- **LLM Orchestration**: LangChain (JS)
- **Embeddings**: OpenAI / Ollama / HuggingFace (configurable)
- **Vector Database**: Pinecone (pluggable)
- **Web Scraping**: LangChain Cheerio Web Loader + Custom Crawl Logic

---

## 📦 Project Structure

```
/ingestion
  ├─ crawler.ts        # URL discovery & crawl control
  ├─ loader.ts         # LangChain web loaders
  ├─ ingest.ts         # Chunking & embedding pipeline

/app
  ├─ api/query         # RAG query endpoint
  ├─ api/ingest        # Trigger ingestion for new docs
  └─ ui                # Chat interface

/lib
  ├─ vectorstore.ts    # Pinecone / vector DB config
  ├─ llm.ts            # LLM configuration
  └─ retriever.ts      # Retrieval strategies
```

---

## 🔍 How It Works

1. User provides a **documentation root URL**
2. The system:
   - Discovers internal documentation links
   - Filters irrelevant or duplicate pages
   - Loads page content using LangChain loaders

3. Content is:
   - Chunked semantically
   - Embedded and stored in a vector database

4. User questions trigger:
   - Similarity-based retrieval
   - Context-aware LLM generation

5. The answer is returned with grounded context from docs

---

## 🧪 Example Use Cases

- Chat with **LangChain documentation**
- Ask questions about **framework or SDK docs**
- Internal **developer documentation assistant**
- API reference exploration
- Learning complex libraries faster

---

## ⚙️ Configuration

Key configurable options:

- Crawl depth & page limits
- Allowed domains / routes
- Chunk size & overlap
- Embedding model
- Vector database provider
- Retrieval strategy (k, MMR, hybrid)

Configuration is managed via environment variables and config files.

---

## 🚧 Limitations (Current)

- JavaScript-heavy sites may require headless browsing
- Very large doc sets need ingestion throttling
- No authentication / multi-tenant support (yet)

---

## 🗺️ Roadmap

- [ ] Hybrid (keyword + vector) retrieval
- [ ] Incremental re-indexing
- [ ] Document change detection
- [ ] Citations & answer confidence scores
- [ ] Multi-doc workspace support
- [ ] LangGraph-based agentic retrieval

---

## 🤝 Why This Project Matters

DocAtlas is designed to demonstrate **real-world RAG system thinking**, not just toy implementations. It showcases:

- Autonomous ingestion pipelines
- Production retrieval concerns
- Scalable architecture decisions
- Applied LLM system design

This project is ideal for engineers transitioning into **Full-Stack AI / LLM Engineering roles**.

---

## 📄 License

MIT

---

## 🙌 Acknowledgements

- LangChain
- Pinecone
- OpenAI / Ollama
- The open-source community
