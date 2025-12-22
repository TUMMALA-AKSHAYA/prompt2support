 
function generateEmbedding(text) {
  // Fixed-size vector
  const VECTOR_SIZE = 128;
  const vector = new Array(VECTOR_SIZE).fill(0);

  if (!text || typeof text !== "string") {
    return vector;
  }

  // Normalize text
  const normalized = text.toLowerCase().trim();

  // Convert characters into numeric signal
  for (let i = 0; i < normalized.length; i++) {
    const charCode = normalized.charCodeAt(i);

    // Spread signal across vector
    const index = i % VECTOR_SIZE;
    vector[index] += charCode / 255;
  }

  // Optional normalization (improves similarity)
  const magnitude = Math.sqrt(
    vector.reduce((sum, val) => sum + val * val, 0)
  ) || 1;

  return vector.map(v => v / magnitude);
}

module.exports = {
  generateEmbedding
};
