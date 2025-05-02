
import React, { forwardRef } from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import * as RadixSelect from '@radix-ui/react-select';
import * as RadixDropdownMenu from '@radix-ui/react-dropdown-menu';

// Utility function to create a forwardRef wrapper for Radix components
export function createForwardRef<T, P>(
  Component: React.ComponentType<P>
) {
  return forwardRef<T, P>((props, ref) => {
    return <Component {...props} ref={ref as React.Ref<HTMLElement>} />;
  });
}

// Example usage: Dialog component with forwardRef
export const DialogContent = createForwardRef<
  HTMLDivElement,
  RadixDialog.DialogContentProps
>(RadixDialog.Content);

// Utility function to wrap Radix components with TypeScript safety
export function wrapRadixComponent<T, P>(
  Component: React.ComponentType<P>
) {
  return Component as unknown as React.FC<P & { ref?: React.RefObject<T> }>;
}
