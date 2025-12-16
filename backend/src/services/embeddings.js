const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

// Initialize OpenAI client with API key from .env
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate embedding for a single text chunk
 * @param {string} text - Text to embed
 * @returns {Promise<number[]>} - Embedding vector
 */
async function getEmbedding(text) {
  try {
    const response = await client.embeddings.create({
      model: 'text-embedding-3-small', // or 'text-embedding-3-large'
      input: text,
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    return null;
  }
}

/**
 * Save embeddings to vectors folder
 * @param {string} filename - JSON file name
 * @param {Array} data - Array of { text, embedding }
 */
function saveEmbedding(filename, data) {
  const vectorsDir = path.join(__dirname, '../../vectors');
  if (!fs.existsSync(vectorsDir)) fs.mkdirSync(vectorsDir);

  const filePath = path.join(vectorsDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

module.exports = {
  getEmbedding,
  saveEmbedding,
};
