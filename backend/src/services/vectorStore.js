const fs = require("fs");
const path = require("path");
const { generateEmbedding } = require("./embeddings");

const vectorsPath = path.join(__dirname, "../../vectors/vectors.json");

let store = [];

if (fs.existsSync(vectorsPath)) {
  store = JSON.parse(fs.readFileSync(vectorsPath));
}

function save() {
  fs.writeFileSync(vectorsPath, JSON.stringify(store, null, 2));
}

module.exports = {
  addDocument({ text, metadata }) {
    const embedding = generateEmbedding(text);
    store.push({ text, embedding, metadata });
    save();
  },

  search(query, limit = 4) {
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
  }
};
