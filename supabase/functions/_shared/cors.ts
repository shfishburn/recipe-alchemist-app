
// Helper function to get CORS headers with origin support
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

// Get CORS headers with origin if available
export function getCorsHeadersWithOrigin(req: Request): Record<string, string> {
  const origin = req.headers.get('origin');
  return {
    ...corsHeaders,
    'Access-Control-Allow-Origin': origin || '*',
  };
}
