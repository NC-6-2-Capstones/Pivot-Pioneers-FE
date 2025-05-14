import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

export async function analyzeGoal(goal, assessment) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

  const prompt = `A user has submitted the following goal and assessment:\n\nGoal: ${goal}\n\nAssessment:\n${Object.entries(assessment).map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nPlease break down a 1-year roadmap for this goal into 5 concise milestone summaries:\n1. Start (now)\n2. 3 months\n3. 6 months\n4. 9 months\n5. 12 months (end goal)\n\nAfter the summaries, provide a comprehensive, detailed plan for the entire year.\n\nFormat your response as:\nMilestones:\n- Start: ...\n- 3 months: ...\n- 6 months: ...\n- 9 months: ...\n- 12 months: ...\n\nFull Plan:\n...`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
}
