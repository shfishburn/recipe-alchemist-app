
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// OpenAI API key from environment variable
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

// Serve the HTTP requests
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const requestData = await req.json();
    
    // Check if we have text input
    if (!requestData.text) {
      return new Response(
        JSON.stringify({ error: 'Text input is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Extract main text and optional context
    const { text, context } = normalizeInput(requestData);
    
    // Generate embedding using OpenAI API
    const embedding = await generateEmbedding(text, context);
    
    // Return the embedding vector
    return new Response(
      JSON.stringify({ embedding }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-embedding function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

/**
 * Normalize input data from various request formats
 */
function normalizeInput(data: any): { text: string; context?: Record<string, any> } {
  // If data is a simple string or has only 'text' field
  if (typeof data === 'string') {
    return { text: data };
  }
  
  // If data includes text property
  if (typeof data.text === 'string') {
    const { text, ...context } = data;
    
    // Return the text and any additional fields as context
    return { 
      text,
      context: Object.keys(context).length > 0 ? context : undefined 
    };
  }
  
  // Handle incompatible input format
  throw new Error('Invalid input format. Provide text as a string or object with "text" property.');
}

/**
 * Generate text embedding using OpenAI API with optional context
 */
async function generateEmbedding(
  text: string, 
  context?: Record<string, any>
): Promise<number[]> {
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable not set');
  }
  
  try {
    // Clean and normalize the input text
    let cleanedText = text.trim().toLowerCase();
    
    // If we have context, enhance the prompt with relevant details
    if (context) {
      const contextParts = [];
      
      if (context.title) {
        contextParts.push(`Recipe: ${context.title}`);
      }
      
      if (context.cuisine) {
        contextParts.push(`Cuisine: ${context.cuisine}`);
      }
      
      if (context.cookingMethod) {
        contextParts.push(`Cooking Method: ${context.cookingMethod}`);
      }
      
      if (context.otherIngredients && Array.isArray(context.otherIngredients)) {
        contextParts.push(`Other Ingredients: ${context.otherIngredients.join(', ')}`);
      }
      
      if (contextParts.length > 0) {
        // Append context to the input text
        cleanedText = `${cleanedText} (${contextParts.join('; ')})`;
      }
    }
    
    // Call OpenAI's embedding API
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: cleanedText
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    
    // Return the embedding vector
    return data.data[0].embedding;
  } catch (error) {
    console.error('Embedding generation error:', error);
    throw error;
  }
}
