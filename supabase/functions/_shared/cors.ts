
// This file contains CORS headers for use across edge functions

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-debug-info',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
};

// Function to get CORS headers with appropriate origin
export const getCorsHeadersWithOrigin = (req: Request) => {
  const origin = req.headers.get('origin') || '*';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-debug-info',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
  };
};
