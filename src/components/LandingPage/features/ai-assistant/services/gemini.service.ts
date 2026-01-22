import { GoogleGenAI } from "@google/genai";

let client: GoogleGenAI | null = null;

const getClient = (): GoogleGenAI => {
  if (!client) {
    const apiKey = process.env.DOCUSAURUS_GEMINI_API_KEY || ''; 
    // In a real generic template we assume the env var is set.
    // If empty, the SDK might throw, which we can catch in the UI.
    client = new GoogleGenAI({ apiKey });
  }
  return client;
};

export const askGemini = async (prompt: string): Promise<string> => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp', // Updated to latest preview model if applicable, or stick to flash
      contents: prompt,
      config: {
        systemInstruction: `You are an expert developer advocate for the Sui Blockchain, specifically focusing on the Indonesian developer community (Sui Indonesia). 
        Your goal is to help developers understand Sui, the Move programming language, and web3 concepts.
        
        Key Traits:
        - Technical, precise, yet accessible.
        - Use analogies relevant to blockchain development.
        - If the user asks in Indonesian, reply in Indonesian. If in English, reply in English.
        - Encourage best practices in Move.
        - Keep answers concise and strictly related to Sui/Move development.
        
        Formatting:
        - Use Markdown for code blocks.
        - Keep paragraphs short.`,
      }
    });
    
    return response.text || "Maaf, saya tidak dapat memproses permintaan Anda saat ini.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Terjadi kesalahan saat menghubungi AI. Pastikan API Key dikonfigurasi dengan benar.";
  }
};
