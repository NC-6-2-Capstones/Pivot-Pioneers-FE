import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

export async function analyzeGoal(goal, assessment) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

  const prompt = `A user has submitted the following goal and assessment:\n\nGoal: ${goal}\n\nAssessment:\n${Object.entries(assessment).map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nProvide a helpful, concise AI coaching response:`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
}
