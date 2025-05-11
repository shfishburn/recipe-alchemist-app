
/**
 * @file cors.ts
 * @version 1.1.0
 * @description Centralized CORS header configuration for Supabase Edge Functions.
 */

// Common constants for CORS header values
type HeadersMap = Record<string, string>;

const ALLOW_HEADERS = 'authorization, x-client-info, apikey, content-type, x-debug-info, Origin, X-Requested-With, Accept';
const ALLOW_METHODS = 'GET, POST, PUT, DELETE, OPTIONS, PATCH';
const MAX_AGE = '86400';

/**
 * Default CORS headers for public endpoints (no credentials).
 */
export const corsHeaders: HeadersMap = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': ALLOW_HEADERS,
  'Access-Control-Allow-Methods': ALLOW_METHODS,
  'Access-Control-Max-Age': MAX_AGE,
};

/**
 * Generate CORS headers echoing back the request Origin and enabling credentials support.
 * Use this in handlers that require cookie/auth credential forwarding.
 *
 * @param req - The incoming Request object
 * @returns Headers map with credentials and dynamic origin
 */
export function getCorsHeadersWithOrigin(req: Request): HeadersMap {
  const origin = req.headers.get('Origin') ?? '*';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': ALLOW_HEADERS,
    'Access-Control-Allow-Methods': ALLOW_METHODS,
    'Access-Control-Max-Age': MAX_AGE,
  };
}
