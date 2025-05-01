
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
    const { text } = await req.json();
    
    if (!text) {
      return new Response(
        JSON.stringify({ error: 'Text input is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Generate embedding using OpenAI API
    const embedding = await generateEmbedding(text);
    
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
 * Generate text embedding using OpenAI API
 */
async function generateEmbedding(text: string): Promise<number[]> {
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable not set');
  }
  
  try {
    // Clean and normalize the input text
    const cleanedText = text.trim().toLowerCase();
    
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
