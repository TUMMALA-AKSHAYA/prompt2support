import vectorStore from "../services/vectorStore.js";

class RetrievalAgent {
  retrieve(query, limit = 5) {
    const results = vectorStore.search(query, limit);

    return results.map(r => ({
      text: r.text,
      metadata: r.metadata
    }));
  }
}

export default new RetrievalAgent();
