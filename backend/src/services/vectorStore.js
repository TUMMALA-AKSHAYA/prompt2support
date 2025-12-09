const { generateEmbedding, cosineSimilarity } = require('../utils/embeddings');
const fs = require('fs').promises;
const path = require('path');

class VectorStore {
  constructor() {
    this.vectors = [];
    this.storePath = path.join(__dirname, '../../vectors/store.json');
  }

  async initialize() {
    try {
      const data = await fs.readFile(this.storePath, 'utf-8');
      this.vectors = JSON.parse(data);
      console.log(`Loaded ${this.vectors.length} vectors from storage`);
    } catch (error) {
      console.log('No existing vector store found, starting fresh');
      this.vectors = [];
    }
  }

  async addDocument(documentData) {
    const { filename, chunks, metadata } = documentData;
    
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const embedding = await generateEmbedding(chunk.text);
      
      this.vectors.push({
        id: `${filename}_chunk_${i}`,
        text: chunk.text,
        embedding: embedding,
        metadata: {
          ...metadata,
          filename: filename,
          chunkIndex: i,
          startChar: chunk.startChar,
          endChar: chunk.endChar
        }
      });
    }

    await this.save();
    return this.vectors.length;
  }

  async search(query, topK = 5) {
    const queryEmbedding = await generateEmbedding(query);
    
    const results = this.vectors.map(vector => ({
      ...vector,
      similarity: cosineSimilarity(queryEmbedding, vector.embedding)
    }));

    results.sort((a, b) => b.similarity - a.similarity);
    
    return results.slice(0, topK).map(result => ({
      text: result.text,
      metadata: result.metadata,
      relevance: result.similarity
    }));
  }

  async save() {
    await fs.mkdir(path.dirname(this.storePath), { recursive: true });
    await fs.writeFile(this.storePath, JSON.stringify(this.vectors, null, 2));
  }

  async clear() {
    this.vectors = [];
    await this.save();
  }

  getStats() {
    const fileStats = {};
    
    this.vectors.forEach(vector => {
      const filename = vector.metadata.filename;
      if (!fileStats[filename]) {
        fileStats[filename] = 0;
      }
      fileStats[filename]++;
    });

    return {
      totalVectors: this.vectors.length,
      documentsIndexed: Object.keys(fileStats).length,
      fileStats: fileStats
    };
  }
}

module.exports = new VectorStore();