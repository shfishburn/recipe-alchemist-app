
import { useCallback } from 'react';
import React from 'react';

export function useRadixWrapper() {
  /**
   * Helper function to ensure a component is wrapped with ButtonWrapper when using asChild
   * @param component React component that might use asChild
   * @param props Component props including asChild
   * @returns Boolean indicating if component needs wrapping
   */
  const needsWrapper = useCallback((props: any) => {
    return props?.asChild === true;
  }, []);

  /**
   * Helper function to safely wrap a child in a component that expects a single child
   * @param children React node(s) to be wrapped
   * @returns React.ReactElement
   */
  const wrapSingleChild = useCallback((children: React.ReactNode) => {
    // Ensure we pass only a single React element to components that expect one
    // This helps prevent "React.Children.only expected to receive a single React element child" errors
    const childArray = React.Children.toArray(children);
    if (childArray.length === 0) {
      return <span />;
    }
    return childArray[0] as React.ReactElement;
  }, []);

  return { needsWrapper, wrapSingleChild };
}
