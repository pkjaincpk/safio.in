
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getAIRecommendation = async (userQuery: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User wants advice on laptop screen guards: "${userQuery}". 
      Context: We are Safio.in, specializing in LAPTOP screen protection only.
      We categorize our guards by Brand (Apple, Dell, HP, etc.) and Screen Size (13.3", 15.6", etc.) rather than specific model names to ensure broad compatibility.
      Available types: Privacy (for remote work/security), Blue Light (for long hours/eye health), Self-Healing (for touchscreens/scratch protection).
      Recommend the best fit for their laptop and explain why briefly. Mention our 3-month warranty. Keep it professional and helpful.`,
    });
    return response.text;
  } catch (error) {
    console.error('AI Error:', error);
    return "I'm having a bit of trouble connecting to my laptop-protection database. Generally, if you're a digital nomad, Privacy is a must. If you're a developer or student, Blue Light helps with eye fatigue. All Safio.in laptop guards come with a 3-month warranty!";
  }
};
