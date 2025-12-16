// src/services/vectorStore.js
const { generateEmbedding, cosineSimilarity } = require("../utils/embeddings");
const fs = require("fs").promises;
const path = require("path");

class VectorStore {
  constructor() {
    this.vectors = [];
    this.storePath = path.join(__dirname, "../../vectors/store.json");
  }

  /**
   * Load stored vectors on server start
   * MUST be called once in server.js
   */
  async initialize() {
    try {
      const data = await fs.readFile(this.storePath, "utf-8");
      this.vectors = JSON.parse(data);
      console.log(`VectorStore: Loaded ${this.vectors.length} vectors`);
    } catch (error) {
      console.log("VectorStore: No existing store found, starting fresh");
      this.vectors = [];
    }
  }

  /**
   * Add a processed document (from DocumentProcessor)
   */
  async addDocument(documentData) {
    const { filename, chunks, metadata } = documentData;

    // Remove existing vectors for the same file
    this.vectors = this.vectors.filter(
      v => v.metadata.filename !== filename
    );

    let addedCount = 0;

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

      // Skip empty chunks
      if (!chunk.text || chunk.text.trim().length === 0) continue;

      // Generate embedding safely
      let embedding = await generateEmbedding(chunk.text);
      if (embedding.embedding) embedding = embedding.embedding; // support for object return

      this.vectors.push({
        id: `${filename}_chunk_${i}`,
        text: chunk.text,
        embedding,
        metadata: {
          ...metadata,
          filename,
          chunkIndex: i,
          startChar: chunk.startChar,
          endChar: chunk.endChar
        }
      });

      addedCount++;
    }

    await this.save();
    return addedCount;
  }

  /**
   * Semantic search
   */
  async search(query, topK = 5) {
    if (this.vectors.length === 0) return [];

    let queryEmbedding = await generateEmbedding(query);
    if (queryEmbedding.embedding) queryEmbedding = queryEmbedding.embedding;

    const scoredResults = this.vectors.map(vector => ({
      text: vector.text,
      metadata: vector.metadata,
      relevance: cosineSimilarity(queryEmbedding, vector.embedding)
    }));

    scoredResults.sort((a, b) => b.relevance - a.relevance);

    return scoredResults.slice(0, topK);
  }

  /**
   * Persist vectors to disk
   */
  async save() {
    await fs.mkdir(path.dirname(this.storePath), { recursive: true });
    await fs.writeFile(
      this.storePath,
      JSON.stringify(this.vectors, null, 2)
    );
  }

  /**
   * Clear all stored vectors (for demo reset)
   */
  async clear() {
    this.vectors = [];
    await this.save();
  }

  /**
   * Analytics & dashboard support
   */
  getStats() {
    const fileStats = {};

    this.vectors.forEach(vector => {
      const file = vector.metadata.filename;
      fileStats[file] = (fileStats[file] || 0) + 1;
    });

    return {
      totalVectors: this.vectors.length,
      documentsIndexed: Object.keys(fileStats).length,
      fileStats
    };
  }
}

module.exports = new VectorStore();
