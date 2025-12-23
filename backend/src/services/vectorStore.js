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

    console.log("🧠 Stored chunk:", metadata.filename);
  }

  cosineSimilarity(a, b) {
    const dot = a.reduce((s, v, i) => s + v * b[i], 0);
    const magA = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
    const magB = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
    return dot / (magA * magB);
  }

  async search(query, topK = 5) {
    if (this.vectors.length === 0) return [];

    const normalizedQuery = query.toLowerCase();
    const queryEmbedding = await embedModel.embedContent(query);
    const qVec = queryEmbedding.embedding.values;

    const scored = this.vectors.map(doc => {
      const semantic = this.cosineSimilarity(qVec, doc.embedding);
      const keywordBonus = doc.text.toLowerCase().includes(normalizedQuery)
        ? 0.15
        : 0;

      return {
        ...doc,
        score: semantic + keywordBonus
      };
    });

    return scored
      .filter(d => d.score > 0.25)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }
}

export default new VectorStore();
