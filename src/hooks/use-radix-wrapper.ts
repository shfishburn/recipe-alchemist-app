
import { useCallback } from 'react';

export function useRadixWrapper() {
  /**
   * Helper function to ensure a component is wrapped with RadixWrapper when using asChild
   * @param component React component that might use asChild
   * @param props Component props including asChild
   * @returns Boolean indicating if component needs wrapping
   */
  const needsWrapper = useCallback((props: any) => {
    return props?.asChild === true;
  }, []);

  return { needsWrapper };
}
