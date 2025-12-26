
import { GoogleGenAI, Type, Modality } from "@google/genai";

export class GeminiService {
  private static getClient() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  static async generateFashionPrompt(imageUri: string, withVoice: boolean) {
    const ai = this.getClient();
    const prompt = `Based on this fashion item, create a professional cinematic prompt for a 9:16 vertical video. 
    ${withVoice ? "Include a script for a soft elegant female voiceover." : "Describe only the visual movements, lighting, and atmosphere."}
    The style should be luxurious and modern. Focus on texture, lighting, and elegant poses.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: imageUri.split(',')[1], mimeType: 'image/jpeg' } },
          { text: prompt }
        ]
      },
      config: {
        thinkingConfig: { thinkingBudget: 1000 }
      }
    });

    return response.text;
  }

  static async extractClothing(imageUri: string) {
    const ai = this.getClient();
    // Simulate "extracting" by generating an image of JUST the clothing item on a white background
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: imageUri.split(',')[1], mimeType: 'image/jpeg' } },
          { text: "Extract the main clothing item from this image and place it on a clean studio white background. Show the full garment clearly." }
        ]
      }
    });

    let resultUrl = '';
    for (const part of response.candidates?.[0]?.content.parts || []) {
      if (part.inlineData) {
        resultUrl = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }
    return resultUrl;
  }

  static async tryOnClothing(clothingUri: string, modelUri: string, style: string) {
    const ai = this.getClient();
    // Multi-part generation: Reference clothing + reference model -> result
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          { inlineData: { data: clothingUri.split(',')[1], mimeType: 'image/jpeg' }, text: "This is the clothing garment." },
          { inlineData: { data: modelUri.split(',')[1], mimeType: 'image/jpeg' }, text: "This is the person." },
          { text: `Generate a high-quality photo of this person wearing exactly this garment. Setting: ${style}. High fashion photography, 9:16 aspect ratio.` }
        ]
      },
      config: {
        imageConfig: { aspectRatio: "9:16", imageSize: "1K" }
      }
    });

    const images: string[] = [];
    // Note: Usually generateContent returns 1 image, but we can call it multiple times for 4 results as requested.
    for (const part of response.candidates?.[0]?.content.parts || []) {
      if (part.inlineData) {
        images.push(`data:image/png;base64,${part.inlineData.data}`);
      }
    }
    return images;
  }

  static async createFashionVideo(imageUri: string, prompt: string) {
    const ai = this.getClient();
    const operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      image: {
        imageBytes: imageUri.split(',')[1],
        mimeType: 'image/jpeg',
      },
      config: {
        numberOfVideos: 1,
        resolution: '1080p',
        aspectRatio: '9:16'
      }
    });
    return operation;
  }

  static async extendVideo(previousOperation: any, prompt: string) {
    const ai = this.getClient();
    const operation = await ai.models.generateVideos({
      model: 'veo-3.1-generate-preview',
      prompt: prompt,
      video: previousOperation.response?.generatedVideos?.[0]?.video,
      config: {
        numberOfVideos: 1,
        resolution: '720p', // Only 720p supported for extension currently
        aspectRatio: '9:16'
      }
    });
    return operation;
  }
}
