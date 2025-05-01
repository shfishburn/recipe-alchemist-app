
import { useState, useEffect } from 'react';

// Define the breakpoint once as a constant
const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    // Safe initial value based on window width if available
    typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false
  );
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    
    // Add event listener for window resize with debounce
    let timeout: number | null = null;
    const handleResize = () => {
      if (timeout) {
        window.clearTimeout(timeout);
      }
      timeout = window.setTimeout(checkIfMobile, 100);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Call once to set initial value
    checkIfMobile();
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      if (timeout) {
        window.clearTimeout(timeout);
      }
    };
  }, []);
  
  return isMobile;
}
