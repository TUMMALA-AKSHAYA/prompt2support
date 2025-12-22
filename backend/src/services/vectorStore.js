import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const embedModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

class VectorStore {
  constructor() {
    this.vectors = [];
  }

  async addDocument({ text, metadata }) {
    if (!text || text.length < 20) return;

    const embedding = await embedModel.embedContent(text);

    this.vectors.push({
      embedding: embedding.embedding.values,
      text,
      metadata
    });

    console.log("🧠 Embedded chunk:", metadata.filename);
  }

  cosineSimilarity(a, b) {
    const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dot / (magA * magB);
  }

  async search(query, topK = 5) {
    if (this.vectors.length === 0) return [];

    const queryEmbedding = await embedModel.embedContent(query);
    const qVec = queryEmbedding.embedding.values;

    const scored = this.vectors.map(doc => ({
      ...doc,
      relevance: this.cosineSimilarity(qVec, doc.embedding)
    }));

    return scored
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, topK);
  }
}

export default new VectorStore();
