import { GoogleGenAI, Type } from "@google/genai";
import { LocationData, CrowdLevel } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const CROWD_LEVELS: CrowdLevel[] = ['low', 'medium', 'high', 'very_high', 'overcrowded', 'closed'];

export async function analyzeLocation(location: string, time: string): Promise<LocationData> {
  const prompt = `You are an intelligent crowd analysis system.
  
  Input:
  Location: ${location}
  Time: ${time} (current local time)
  
  Task:
  1. Identify location type (college, tourist place, railway station, airport, etc.)
  2. Generate 5-8 relevant sub-locations/zones (like library, gate, platform, parking, security, etc.)
  3. Assign realistic crowd levels based on the time and location type.
  4. Provide X and Y coordinates (0-100 scale) for each zone to be plotted on a map.
  5. Provide a brief summary of the overall atmosphere.
  6. Provide 'detailedGraphs' data containing 4 arrays:
     - timeLabels: 5 strings representing time periods (e.g. ['T-2h', 'T-1h', 'Now', 'T+1h', 'T+2h']) based on the input Time.
     - crowdDensity: 5 numbers (0-100) representing crowd density at those times.
     - movementSpeed: 5 numbers (0-100) representing average movement speed at those times.
     - riskFactor: 5 numbers (0-100) representing risk factor at those times.
  
  Realistic behavior:
  - India Gate (Evening) -> High/Very High
  - College (Morning) -> Medium/High (Academic zones)
  - Railway Station -> Always medium/high
  - Park (Morning) -> Low/Medium
  - Airport (Holiday/Evening) -> Very High
  
  Output MUST be strictly JSON.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          location: { type: Type.STRING },
          type: { type: Type.STRING },
          time: { type: Type.STRING },
          summary: { type: Type.STRING },
          zones: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                crowd: { 
                    type: Type.STRING,
                    enum: CROWD_LEVELS
                },
                description: { type: Type.STRING },
                x: { type: Type.NUMBER },
                y: { type: Type.NUMBER }
              },
              required: ["id", "name", "crowd", "x", "y"]
            }
          },
          detailedGraphs: {
            type: Type.OBJECT,
            properties: {
              timeLabels: { type: Type.ARRAY, items: { type: Type.STRING } },
              crowdDensity: { type: Type.ARRAY, items: { type: Type.NUMBER } },
              movementSpeed: { type: Type.ARRAY, items: { type: Type.NUMBER } },
              riskFactor: { type: Type.ARRAY, items: { type: Type.NUMBER } }
            }
          }
        },
        required: ["location", "type", "time", "summary", "zones"]
      }
    }
  });

  try {
    const data = JSON.parse(response.text || "{}");
    return data as LocationData;
  } catch (e) {
    console.error("Failed to parse Gemini response:", e);
    throw new Error("Invalid response from AI");
  }
}
