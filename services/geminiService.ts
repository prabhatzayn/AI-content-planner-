import { GoogleGenAI, Type } from '@google/genai';
import { SocialLinks, ContentEntry } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const calendarSchema = {
  type: Type.OBJECT,
  properties: {
    contentPlan: {
      type: Type.ARRAY,
      description: "A 30-day content plan.",
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.NUMBER, description: "Day of the month (1-30)." },
          platform: { type: Type.STRING, description: "Target social media platform (e.g., Instagram, LinkedIn, X)." },
          contentType: { type: Type.STRING, description: "Type of content (e.g., Reel, Post, Carousel)." },
          idea: { type: Type.STRING, description: "The core idea, hook, or title for the content." },
          caption: { type: Type.STRING, description: "A detailed, engaging caption for the post, written in the user's voice." },
          hashtags: { type: Type.STRING, description: "A string of relevant hashtags, separated by spaces." }
        },
        required: ["day", "platform", "contentType", "idea", "caption", "hashtags"]
      }
    }
  },
  required: ["contentPlan"]
};

export const scriptSchema = {
  type: Type.OBJECT,
  properties: {
    script: {
      type: Type.STRING,
      description: "A complete, ready-to-use video script including scene descriptions, dialogue, and calls to action."
    }
  },
  required: ["script"]
};


export const getInitialPrompt = (
  niche: string,
  socialLinks: SocialLinks,
  previousContent: string,
  referenceMaterials: string,
  styleAndVoice: string
): string => {
  return `
    You are an expert social media strategist and content creator. Your task is to generate a comprehensive 30-day content calendar that **perfectly mimics the user's unique style and voice**.

    **Analysis Context:**
    - **Niche:** ${niche}
    - **Social Media Presence (for style reference):** ${JSON.stringify(socialLinks, null, 2)}
    - **Previous Content Calendar (for performance analysis). This may include CSV/text content, or links to videos/documents for analysis:**
      \`\`\`
      ${previousContent}
      \`\`\`
    ${referenceMaterials ? `
    - **Brain - Reference & Guidance (Learn from these materials for strategy, hooks, and viral techniques). This may include file contents, raw text, or links to external resources like videos or articles.:**
      \`\`\`
      ${referenceMaterials}
      \`\`\`
    ` : ''}
    ${styleAndVoice ? `
    - **My Style & Voice - Mimicry (Adopt this tone, voice, and personality). This may include file contents, raw text, or links to your past content.:**
      \`\`\`
      ${styleAndVoice}
      \`\`\`
    ` : ''}

    **Instructions:**
    1.  **Mimicry is KEY:** Your primary goal is to generate content that sounds like it was written by the user. Absorb the user's style from the "My Style & Voice" section. Pay attention to vocabulary, sentence structure, humor, and overall tone when writing captions and ideas.
    2.  **Strategic Insights:** Use the "Brain" section to inform your content strategy. Incorporate proven formulas, scriptwriting techniques, and viral concepts from the provided reference materials.
    3.  Analyze the provided niche and previous content calendar for topic ideas and performance insights.
    4.  Create a new, diverse 30-day content plan.
    5.  The plan should include a mix of content types: Reels, static Posts, and Carousels. Tailor content types to the most appropriate platforms (e.g., Reels for Instagram, text-heavy posts for LinkedIn).
    6.  Prioritize content ideas that are relatively easy to create but have high engagement potential (e.g., Q&A, behind-the-scenes, tips, tutorials).
    7.  Incorporate at least one multi-part series (e.g., a 3-part tutorial or a weekly theme).
    8.  Ensure the output is a valid JSON object matching the provided schema.
    9.  For hashtags, provide a string of space-separated hashtags, like "#socialmedia #contentcreation #digitalmarketing".
  `;
};

export const getVideoScriptPrompt = (
  niche: string,
  videoIdea: string,
  videoDescription: string,
  videoAudience: string,
  referenceMaterials: string,
  styleAndVoice: string
): string => {
  return `
    You are an expert viral video scriptwriter and social media strategist. Your task is to write a complete, engaging video script that **perfectly mimics the user's unique style and voice**.

    **Analysis Context:**
    - **Niche:** ${niche}
    - **Target Audience:** ${videoAudience}
    - **Core Video Idea/Prompt:** ${videoIdea}
    - **Detailed Description/Key Points:** ${videoDescription}

    ${referenceMaterials ? `
    - **Brain - Reference & Guidance (Learn from these materials for strategy, hooks, and viral techniques). This may include file contents, raw text, or links to external resources like videos or articles.:**
      \`\`\`
      ${referenceMaterials}
      \`\`\`
    ` : ''}
    ${styleAndVoice ? `
    - **My Style & Voice - Mimicry (Adopt this tone, voice, and personality). This may include file contents, raw text, or links to your past content.:**
      \`\`\`
      ${styleAndVoice}
      \`\`\`
    ` : ''}

    **Instructions:**
    1.  **Mimicry is KEY:** Your primary goal is to write a script that sounds like it was created by the user. Absorb the user's style from the "My Style & Voice" section. Pay attention to vocabulary, sentence structure, humor, and overall tone.
    2.  **Strategic Insights:** Use the "Brain" section to inform your script structure. Incorporate proven formulas, storytelling techniques, and viral concepts from the provided reference materials.
    3.  **Hook Immediately:** Start the script with a powerful hook to grab the viewer's attention within the first 3 seconds.
    4.  **Structure:** The script should be well-structured, including:
        - An attention-grabbing hook.
        - The main body delivering value, information, or entertainment.
        - A clear Call To Action (CTA) at the end (e.g., "Follow for more," "Comment your thoughts," "Check the link in bio").
    5.  **Formatting:** Format the script for easy reading and production. Use clear indicators for visuals, on-screen text, voiceover, and actions. For example:
        - **VISUAL:** [Describe the visual scene]
        - **TEXT:** [On-screen text overlay]
        - **VO:** [Voiceover narration]
    6.  Ensure the output is a valid JSON object matching the provided schema, containing a single "script" key with the full script as its string value.
  `;
};

export const generateContentPlan = async (
  niche: string,
  socialLinks: SocialLinks,
  previousContent: string,
  referenceMaterials: string,
  styleAndVoice: string
): Promise<ContentEntry[]> => {
  const prompt = getInitialPrompt(niche, socialLinks, previousContent, referenceMaterials, styleAndVoice);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: calendarSchema,
        temperature: 0.8,
        topP: 0.95,
      }
    });
    
    const parsedJson = JSON.parse(response.text);
    return parsedJson.contentPlan as ContentEntry[];
  } catch (error) {
    console.error('Error generating content with Gemini:', error);
    throw new Error('Failed to generate or parse content from the AI model.');
  }
};

export const generateVideoScript = async (
  niche: string,
  videoIdea: string,
  videoDescription: string,
  videoAudience: string,
  referenceMaterials: string,
  styleAndVoice: string
): Promise<string> => {
  const prompt = getVideoScriptPrompt(niche, videoIdea, videoDescription, videoAudience, referenceMaterials, styleAndVoice);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: scriptSchema,
        temperature: 0.8,
        topP: 0.95,
      }
    });

    const parsedJson = JSON.parse(response.text);
    if (parsedJson.script && typeof parsedJson.script === 'string') {
        return parsedJson.script;
    }
    throw new Error('AI response did not contain a valid script.');
  } catch (error) {
    console.error('Error generating script with Gemini:', error);
    throw new Error('Failed to generate or parse script from the AI model.');
  }
};
