
import { useMediaQuery } from './use-media-query';

/**
 * Custom hook to determine if current viewport is mobile-sized
 * Uses Material Design breakpoint standard
 * 
 * @returns Boolean indicating if viewport is mobile-sized
 */
export function useIsMobile() {
  // Consider devices below 600px (Material Design's sm breakpoint) as mobile
  return useMediaQuery('(max-width: 599px)');
}
