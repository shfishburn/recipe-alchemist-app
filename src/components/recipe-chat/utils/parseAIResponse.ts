
export interface AIResponseData {
  textResponse: string;
  followUpQuestions: string[];
  changes?: {
    title?: string;
    ingredients?: {
      mode: 'add' | 'replace' | 'none';
      items: Array<{
        qty: number;
        unit: string;
        item: string;
        notes?: string;
      }>;
    };
    instructions?: Array<{
      action: string;
      explanation?: string;
    }>;
  };
}

export function parseAIResponse(response: string): AIResponseData {
  try {
    const parsedResponse = JSON.parse(response);
    return {
      textResponse: parsedResponse.textResponse || response,
      followUpQuestions: Array.isArray(parsedResponse.followUpQuestions) 
        ? parsedResponse.followUpQuestions 
        : [],
      changes: parsedResponse.changes || null,
    };
  } catch (e) {
    console.error("Error parsing AI response:", e);
    return {
      textResponse: response,
      followUpQuestions: [],
      changes: null,
    };
  }
}
