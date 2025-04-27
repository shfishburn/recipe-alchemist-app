
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
    // First try to parse the response as a JSON string
    let parsedResponse: any;
    try {
      parsedResponse = JSON.parse(response);
      console.log('Successfully parsed initial JSON response:', parsedResponse);
    } catch (e) {
      console.error('Failed to parse initial JSON, attempting to parse nested response:', e);
      // If the first parse fails, the response might be double stringified
      try {
        parsedResponse = JSON.parse(JSON.parse(response));
        console.log('Successfully parsed nested JSON response:', parsedResponse);
      } catch (innerE) {
        console.error('Failed to parse nested JSON, falling back to text:', innerE);
        // If both parsing attempts fail, treat it as plain text
        return {
          textResponse: response,
          followUpQuestions: [],
          changes: null
        };
      }
    }

    // Validate and extract the fields we need
    const result: AIResponseData = {
      textResponse: typeof parsedResponse.textResponse === 'string' 
        ? parsedResponse.textResponse 
        : response,
      followUpQuestions: Array.isArray(parsedResponse.followUpQuestions)
        ? parsedResponse.followUpQuestions.filter(q => typeof q === 'string')
        : [],
      changes: parsedResponse.changes || null
    };

    console.log('Final parsed response:', result);
    return result;
  } catch (e) {
    console.error("Error in parseAIResponse:", e);
    // Fallback to treating the entire response as text
    return {
      textResponse: response,
      followUpQuestions: [],
      changes: null
    };
  }
}
