import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const embedModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

class VectorStore {
  constructor() {
    this.vectors = [];
    this.load();
  }

  load() {
    try {
      const data = fs.readFileSync("vectors/vectors.json", "utf-8");
      this.vectors = JSON.parse(data);
    } catch {
      this.vectors = [];
    }
  }

  save() {
    fs.mkdirSync("vectors", { recursive: true });
    fs.writeFileSync("vectors/vectors.json", JSON.stringify(this.vectors));
  }

  // 🔹 Split text into chunks
  chunkText(text, chunkSize = 800, overlap = 100) {
    const chunks = [];
    let start = 0;

    while (start < text.length) {
      const end = start + chunkSize;
      chunks.push(text.slice(start, end));
      start = end - overlap;
    }

    return chunks;
  }

  async addDocument({ text, metadata }) {
    const chunks = this.chunkText(text);

    for (const chunk of chunks) {
      if (chunk.trim().length < 50) continue;

      try {
        const embedding = await embedModel.embedContent(chunk);
        this.vectors.push({
          embedding: embedding.embedding.values,
          text: chunk,
          metadata,
        });
      } catch (embedError) {
        console.log(`⚠️ Embedding failed, using fallback for chunk`);
        // Fallback: create a simple hash-based "embedding" for demo purposes
        const simpleEmbedding = this.createSimpleEmbedding(chunk);
        this.vectors.push({
          embedding: simpleEmbedding,
          text: chunk,
          metadata,
        });
      }
    }
    console.log(`🧠 Indexed ${chunks.length} chunks from ${metadata.filename}`);
    this.save();
  }

  createSimpleEmbedding(text) {
    // Simple hash-based embedding for fallback (384 dimensions to match real embeddings)
    const embedding = new Array(384).fill(0);
    const words = text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 2);

    words.forEach(word => {
      const hash = this.simpleHash(word);
      const pos = Math.abs(hash) % 384;
      embedding[pos] += 1;
    });

    // Normalize
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    return embedding.map(val => val / (magnitude || 1));
  }

  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
    }
    return hash;
  }

  cosineSimilarity(a, b) {
    const dot = a.reduce((s, v, i) => s + v * b[i], 0);
    const magA = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
    const magB = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
    return dot / (magA * magB);
  }

  async search(query, topK = 4) {
    if (this.vectors.length === 0) return [];

    let qVec;
    try {
      const qEmbedding = await embedModel.embedContent(query);
      qVec = qEmbedding.embedding.values;
    } catch (embedError) {
      console.log(`⚠️ Query embedding failed, using fallback`);
      qVec = this.createSimpleEmbedding(query);
    }

    return this.vectors
      .map(doc => ({
        ...doc,
        score: this.cosineSimilarity(qVec, doc.embedding),
      }))
      .filter(d => d.score > 0.1) // Lower threshold for simple embeddings
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }
}

export default new VectorStore();
