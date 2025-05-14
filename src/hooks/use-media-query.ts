
import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(
    () => window.matchMedia(query).matches
  );

  useEffect(() => {
    const media = window.matchMedia(query);
    
    const updateMatches = () => {
      setMatches(media.matches);
    };
    
    // Set initial value
    updateMatches();
    
    // Listen for changes
    media.addEventListener('change', updateMatches);
    
    // Clean up
    return () => {
      media.removeEventListener('change', updateMatches);
    };
  }, [query]);

  return matches;
}
