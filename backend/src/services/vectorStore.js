const fs = require("fs");
const path = require("path");
const { generateEmbedding } = require("./embeddings");

const vectorsDir = path.join(__dirname, "../../vectors");
const vectorsPath = path.join(vectorsDir, "vectors.json");

let store = [];

const vectorStore = {
  // Initialize the store (create folder and load existing vectors)
  async initialize() {
    try {
      if (!fs.existsSync(vectorsDir)) {
        fs.mkdirSync(vectorsDir, { recursive: true });
      }

      if (fs.existsSync(vectorsPath)) {
        try {
          store = JSON.parse(fs.readFileSync(vectorsPath, "utf-8"));
        } catch (e) {
          store = [];
        }
      } else {
        store = [];
        fs.writeFileSync(vectorsPath, JSON.stringify(store, null, 2));
      }

      console.log("✅ Vector store initialized. Total vectors:", store.length);
    } catch (err) {
      console.error("Vector store initialization error:", err);
    }
  },

  // Save vectors to file
  save() {
    fs.writeFileSync(vectorsPath, JSON.stringify(store, null, 2));
  },

  // Cosine similarity helper
  cosineSimilarity(a, b) {
    let dot = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    return dot / (Math.sqrt(normA) * Math.sqrt(normB) + 1e-10);
  },

  // Add a new document
  addDocument({ text, metadata }) {
    const embedding = generateEmbedding(text);
    store.push({ text, embedding, metadata });
    this.save();
  },

  // Search documents
  search(query, limit = 8) {
    const qEmbedding = generateEmbedding(query);

    return store
      .map(doc => {
        let score = 0;
        for (let i = 0; i < qEmbedding.length; i++) {
          score += qEmbedding[i] * doc.embedding[i];
        }
        return { ...doc, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  },

  // Get stats
  getStats() {
    return { totalVectors: store.length };
  },

  // Clear store
  clear() {
    store = [];
    this.save();
  }
};

module.exports = vectorStore;
