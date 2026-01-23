import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import type { PredictionResult } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Schema for the final price prediction
const predictionSchema = {
  type: Type.OBJECT,
  properties: {
    predictedPrice: {
      type: Type.NUMBER,
      description: "The estimated median price of the house in INR.",
    },
    reasoning: {
      type: Type.STRING,
      description: "A brief explanation for the price prediction.",
    },
    priceRangeLow: {
        type: Type.NUMBER,
        description: "The lower end of the estimated price range in INR.",
    },
    priceRangeHigh: {
        type: Type.NUMBER,
        description: "The higher end of the estimated price range in INR.",
    }
  },
  required: ["predictedPrice", "reasoning", "priceRangeLow", "priceRangeHigh"],
};

interface LocationValidationResult {
    isValid: boolean;
    reason: string;
    correctedLocation: string;
}


/**
 * A wrapper for ai.models.generateContent that includes a retry mechanism
 * with exponential backoff for handling transient API errors (e.g., 503).
 */
const generateContentWithRetry = async (
    params: Parameters<typeof ai.models.generateContent>[0]
): Promise<GenerateContentResponse> => {
    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await ai.models.generateContent(params);
        } catch (error) {
            lastError = error as Error;
            // Check for error messages indicating a retryable, transient issue.
            if (error instanceof Error && (error.message.includes("503") || error.message.toLowerCase().includes("unavailable") || error.message.toLowerCase().includes("overloaded"))) {
                if (attempt < maxRetries - 1) {
                    // Exponential backoff with jitter
                    const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
                    console.log(`Model is busy. Retrying in ${Math.round(delay / 1000)}s... (Attempt ${attempt + 1}/${maxRetries})`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            } else {
                // Not a retryable error, so throw immediately.
                throw error;
            }
        }
    }
    // If all retries fail, throw a more user-friendly error.
    console.error("All retries failed.", lastError);
    throw new Error(`The AI model is currently experiencing high traffic. Please try again in a few moments.`);
};


export const predictHousePrice = async (
  size: number,
  bhk: number,
  location: string
): Promise<PredictionResult> => {
  try {
    // --- Step 1: Validate location using Google Maps grounding ---
    const validationPrompt = `Using Google Maps, validate if the following location is a real, specific place suitable for residential housing: "${location}".
    Produce a JSON object string (and nothing else) with the keys: "isValid" (boolean), "reason" (string), "correctedLocation" (string).
    If the location is valid, "reason" should be an empty string, and "correctedLocation" should be the full, canonical name of the location.
    If the location is invalid, provide a brief reason. If a correction is obvious, provide it in "correctedLocation".`;

    const validationResponse = await generateContentWithRetry({
        model: "gemini-2.5-flash",
        contents: validationPrompt,
        config: {
            tools: [{googleMaps: {}}],
        },
    });

    let validationResult: LocationValidationResult;
    try {
        // The response from a model with grounding is just text, so we need to parse it.
        const jsonText = validationResponse.text.trim().replace(/^```json\n?/, '').replace(/```$/, '');
        validationResult = JSON.parse(jsonText);
    } catch (e) {
        console.error("Failed to parse location validation JSON:", validationResponse.text);
        throw new Error("Could not confirm the location. The AI's response was not in the expected format.");
    }

    if (!validationResult.isValid) {
        let errorMessage = validationResult.reason || `Location "${location}" could not be validated.`;
        if (validationResult.correctedLocation) {
            errorMessage += ` Did you mean "${validationResult.correctedLocation}"?`;
        }
        throw new Error(errorMessage);
    }

    const validLocation = validationResult.correctedLocation || location;

    // --- Step 2: Get price prediction for the validated location ---
    
    const systemInstruction = `You are an expert real estate appraiser specializing in the Karnataka, India property market.
    
    CRITICAL INSTRUCTION:
    You must incorporate insights from the "Revised Guidelines Value" by the Department of Stamps and Registration, Karnataka (https://igr.karnataka.gov.in/page/Revised+Guidelines+Value/en).
    While actual market rates often exceed these government guidance values, you must use this official source as a critical baseline to ensure your valuation is grounded in local reality.
    
    When predicting:
    1. Consider the guidance value for the specific area in "${validLocation}".
    2. Adjust for market demand, property features (Size, BHK), and current trends.
    3. Provide a realistic reasoning based on this data.`;

    const predictionPrompt = `
        Provide a house price prediction in INR based on the following features:
        - Size: ${size} sq. ft.
        - BHK: ${bhk}
        - Location: "${validLocation}"
      `;


    const predictionResponse = await generateContentWithRetry({
        model: "gemini-2.5-flash",
        contents: predictionPrompt,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
          responseSchema: predictionSchema,
          temperature: 0.2,
        },
    });

    const jsonText = predictionResponse.text.trim();
    if (!jsonText) {
      throw new Error("Received an empty response from the AI model for the price prediction.");
    }

    const result = JSON.parse(jsonText);

    // Basic validation
    if (typeof result.predictedPrice !== 'number' || typeof result.reasoning !== 'string') {
        throw new Error("AI price prediction response is not in the expected format.");
    }

    return result as PredictionResult;

  } catch (error) {
    console.error("Error in prediction process:", error);
    if (error instanceof Error) {
        // Re-throw specific errors from the validation/prediction logic
        throw error;
    }
    throw new Error("Failed to get prediction from AI. Please check your inputs or try again later.");
  }
};