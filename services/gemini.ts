
import { GoogleGenAI, Type } from "@google/genai";
import { Store } from "../types";

// Always use the standard initialization format with a named parameter
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSmartRecommendations = async (query: string, stores: Store[]): Promise<string[]> => {
  // Ensure the hard requirement for process.env.API_KEY is met
  if (!process.env.API_KEY) return [];

  try {
    const storeNames = stores.map(s => s.name).join(', ');
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Given the stores: ${storeNames}, which ones match the intent: "${query}"? Return only the store IDs as a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    // Directly access the .text property of GenerateContentResponse
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
};
