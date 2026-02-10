import { GoogleGenAI, Type } from '@google/genai';
import { ResumeProfile } from '../types';

// Initialize the API client
// We create it inside functions or lazily to ensure it catches the env var correctly if it changes
const getAIClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY as string });

// Define the exact schema we want the AI to return for a Resume Profile
const resumeSchema = {
  type: Type.OBJECT,
  properties: {
    fullName: { type: Type.STRING, description: "Full name of the person" },
    email: { type: Type.STRING },
    phone: { type: Type.STRING },
    location: { type: Type.STRING, description: "City and state/country" },
    summary: { type: Type.STRING, description: "Professional summary paragraph" },
    skills: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "List of professional skills"
    },
    experience: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          company: { type: Type.STRING },
          role: { type: Type.STRING },
          startDate: { type: Type.STRING, description: "e.g. Jan 2020" },
          endDate: { type: Type.STRING, description: "e.g. Present or Dec 2022" },
          description: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Bullet points describing responsibilities and achievements"
          }
        },
        propertyOrdering: ["company", "role", "startDate", "endDate", "description"]
      }
    },
    education: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          institution: { type: Type.STRING },
          degree: { type: Type.STRING },
          year: { type: Type.STRING, description: "Graduation year or range" }
        },
        propertyOrdering: ["institution", "degree", "year"]
      }
    }
  },
  required: ["fullName", "summary", "skills", "experience", "education"],
  propertyOrdering: ["fullName", "email", "phone", "location", "summary", "skills", "experience", "education"]
};

export const parseRawProfile = async (rawText: string): Promise<ResumeProfile> => {
  const ai = getAIClient();
  const prompt = `Extract standard resume fields from the following text. 
If some contact info is missing, leave it blank. 
Format the experience descriptions as clean bullet points.
  
Raw Text:
---
${rawText}
---`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: resumeSchema,
        temperature: 0.2, // Low temp for extraction
      }
    });

    if (!response.text) {
      throw new Error("Empty response from AI");
    }

    return JSON.parse(response.text) as ResumeProfile;
  } catch (error) {
    console.error("Error parsing profile:", error);
    throw error;
  }
};

export const tailorProfileForJob = async (baseProfile: ResumeProfile, targetJobTitle: string): Promise<ResumeProfile> => {
  const ai = getAIClient();
  const prompt = `Act as an expert career coach and resume writer.
I will provide a 'Base Profile' (JSON) and a 'Target Job Title'.
Your task is to tailor the Base Profile specifically for the Target Job Title to maximize the chances of getting an interview.

Rules:
1. Rewrite the 'summary' to highlight why the candidate is a perfect fit for a "${targetJobTitle}".
2. Rewrite and prioritize the 'experience.description' bullet points. Emphasize transferable skills, relevant achievements, and use strong action verbs related to the "${targetJobTitle}".
3. You may reorder or filter the 'skills' list to put the most relevant ones first.
4. DO NOT invent fake jobs, fake degrees, or entirely new experiences. Only reframe existing facts.
5. Keep contact info, company names, dates, and degree names unchanged.

Target Job Title: ${targetJobTitle}

Base Profile JSON:
---
${JSON.stringify(baseProfile, null, 2)}
---`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: resumeSchema,
        temperature: 0.7, // Slightly higher for creative rewriting
        systemInstruction: "You are an expert resume tailor. You strictly return valid JSON matching the requested schema without any markdown formatting."
      }
    });

    if (!response.text) {
      throw new Error("Empty response from AI");
    }

    return JSON.parse(response.text) as ResumeProfile;
  } catch (error) {
    console.error("Error tailoring profile:", error);
    throw error;
  }
};
