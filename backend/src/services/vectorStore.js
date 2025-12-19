const fs = require("fs");
const path = require("path");
const { generateEmbedding } = require("./embeddings");

const vectorsDir = path.join(__dirname, "../../vectors");
const vectorsPath = path.join(vectorsDir, "vectors.json");

if (!fs.existsSync(vectorsDir)) {
  fs.mkdirSync(vectorsDir, { recursive: true });
}

let store = [];

// Load existing vectors
if (fs.existsSync(vectorsPath)) {
  try {
    store = JSON.parse(fs.readFileSync(vectorsPath, "utf-8"));
  } catch (e) {
    store = [];
  }
}

function save() {
  fs.writeFileSync(vectorsPath, JSON.stringify(store, null, 2));
}

function cosineSimilarity(a, b) {
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB) + 1e-10);
}

module.exports = {
  addDocument({ text, metadata }) {
    const embedding = generateEmbedding(text);
    store.push({ text, embedding, metadata });
    save();
  },

  
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

    

  getStats() {
    return {
      totalVectors: store.length
    };
  },

  clear() {
    store = [];
    save();
  }
};
