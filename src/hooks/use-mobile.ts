
import { useMediaQuery } from './use-media-query';

/**
 * Hook to detect if the device is a mobile device based on screen width
 * Uses a media query for "small" viewport sizes (640px is the Tailwind sm breakpoint)
 * @returns boolean true if the device is mobile-sized
 */
export function useIsMobile() {
  const isSmallViewport = useMediaQuery('(max-width: 640px)');
  return isSmallViewport;
}
