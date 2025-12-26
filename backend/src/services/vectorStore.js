import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const embedModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

class VectorStore {
  constructor() {
    this.vectors = [];
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

      const embedding = await embedModel.embedContent(chunk);

      this.vectors.push({
        embedding: embedding.embedding.values,
        text: chunk,
        metadata,
      });
    }

    console.log(`🧠 Indexed ${chunks.length} chunks from ${metadata.filename}`);
  }

  cosineSimilarity(a, b) {
    const dot = a.reduce((s, v, i) => s + v * b[i], 0);
    const magA = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
    const magB = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
    return dot / (magA * magB);
  }

  async search(query, topK = 4) {
    if (this.vectors.length === 0) return [];

    const qEmbedding = await embedModel.embedContent(query);
    const qVec = qEmbedding.embedding.values;

    return this.vectors
      .map(doc => ({
        ...doc,
        score: this.cosineSimilarity(qVec, doc.embedding),
      }))
      .filter(d => d.score > 0.2)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }
}

export default new VectorStore();
