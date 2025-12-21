// Simple embedding generation for demo purposes
// Uses a basic term-frequency approach (good enough for hackathon demo)

async function generateEmbedding(text) {
  // Convert text to lowercase and split into words
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2); // Remove very short words
  
  // Create a fixed-size embedding vector (384 dimensions)
  const embedding = new Array(384).fill(0);
  
  // Hash each word and add to corresponding dimensions
  words.forEach((word, idx) => {
    const hash = simpleHash(word);
    const position = hash % 384;
    embedding[position] += 1;
    
    // Add to neighboring positions for better distribution
    if (position > 0) embedding[position - 1] += 0.5;
    if (position < 383) embedding[position + 1] += 0.5;
  });
  
  // Normalize the vector
  const magnitude = Math.sqrt(
    embedding.reduce((sum, val) => sum + val * val, 0)
  );
  
  return embedding.map(val => val / (magnitude || 1));
}

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let magA = 0;
  let magB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    magA += vecA[i] * vecA[i];
    magB += vecB[i] * vecB[i];
  }
  
  const magnitude = Math.sqrt(magA) * Math.sqrt(magB);
  return magnitude === 0 ? 0 : dotProduct / magnitude;
}

export { generateEmbedding, cosineSimilarity };
