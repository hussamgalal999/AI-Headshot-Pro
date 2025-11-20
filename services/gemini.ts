import { GoogleGenAI, Modality } from "@google/genai";

/**
 * Calls the Gemini 2.5 Flash Image model to edit/generate an image based on a source image and a prompt.
 */
export const generateHeadshot = async (
  imageBase64: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
  // Initialize the client with the API key from the environment
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: imageBase64,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        // Crucial: Request an IMAGE response modality
        responseModalities: [Modality.IMAGE],
      },
    });

    // Extract the generated image bytes
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return part.inlineData.data;
        }
      }
    }

    throw new Error("No image data found in the response.");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
