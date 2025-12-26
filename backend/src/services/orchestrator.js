import vectorStore from "./vectorStore.js";
import axios from "axios";

class Orchestrator {
  async handleQuery(query) {
    try {
      // 1️⃣ Check if any documents are uploaded
      if (vectorStore.vectors.length === 0) {
        return {
          answer: "No documents uploaded yet. Please upload some documents first.",
          sources: []
        };
      }

      console.log(`🔍 Searching ${vectorStore.vectors.length} document chunks for: "${query}"`);

      // 2️⃣ Perform semantic search using vector store
      const relevantChunks = await vectorStore.search(query, 6); // Get top 6 relevant chunks

      if (relevantChunks.length === 0) {
        return {
          answer: "No relevant information found in the uploaded documents.",
          sources: []
        };
      }

      console.log(`📄 Found ${relevantChunks.length} relevant chunks`);

      // 3️⃣ Build context from relevant chunks
      const context = relevantChunks
        .map((chunk, idx) => `[Source ${idx + 1}: ${chunk.metadata?.filename || 'Document'}]\n${chunk.text}`)
        .join('\n\n---\n\n');

      // 4️⃣ Generate answer using Gemini with grounded context
      if (process.env.GEMINI_API_KEY) {
        const prompt = `You are a customer support AI assistant.

Rules:
- Use ONLY the information from the provided document context below
- Answer based on the uploaded documents content
- Be precise, helpful, and cite specific information from the documents
- If the information is not in the context, say: "This information is not available in the uploaded documents."
- Keep answers clear and customer-friendly
- Reference the source document when relevant

Document Context:
${context}

Customer Question: ${query}

Answer:`;

        try {
          const response = await axios.post(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
            {
              contents: [
                {
                  role: "user",
                  parts: [{ text: prompt }]
                }
              ]
            },
            {
              params: { key: process.env.GEMINI_API_KEY }
            }
          );

          const rawAnswer =
            response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

          if (!rawAnswer) {
            return {
              answer: "Unable to generate an answer from the document content.",
              sources: relevantChunks.map(c => c.metadata?.filename).filter(Boolean)
            };
          }

          // Extract sources from relevant chunks
          const sources = [...new Set(relevantChunks.map(c => c.metadata?.filename).filter(Boolean))];

          return {
            answer: rawAnswer.trim(),
            sources: sources
          };
        } catch (err) {
          console.error("❌ Gemini API error:", err.message);
          return {
            answer: "Error processing your question. Please try again.",
            sources: []
          };
        }
      }

      // 5️⃣ Fallback when no API key
      return {
        answer: "AI service is not configured. Please set up GEMINI_API_KEY.",
        sources: []
      };

    } catch (error) {
      console.error("❌ Orchestrator error:", error);
      return {
        answer: "An error occurred while processing your question.",
        sources: []
      };
    }
  }
}

export default new Orchestrator();
