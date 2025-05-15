
/**
 * Generates CORS headers based on the origin of the request.
 * This allows for proper cross-origin resource sharing with dynamic origin detection.
 * 
 * @param req - The incoming request
 * @returns Headers object containing appropriate CORS headers
 */
export function getCorsHeadersWithOrigin(req: Request): HeadersInit {
  const origin = req.headers.get('origin') || '*';
  
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-debug-info',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Credentials': 'true',
  };
}
