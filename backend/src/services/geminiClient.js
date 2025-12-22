import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export async function generateAnswer(question, context) {
  const prompt = `
You are a customer support assistant.

RULES:
- Answer ONLY using the information provided below
- If the answer is not present, say: "This information is not available in the uploaded documents"
- Do NOT add external knowledge
- Be concise and clear

DOCUMENT CONTEXT:
${context}

QUESTION:
${question}
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
