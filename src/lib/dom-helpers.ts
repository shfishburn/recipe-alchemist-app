
/**
 * Utility function to handle click outside events for dropdowns
 */
export function setupClickOutsideHandler(
  dropdownId: string,
  toggleButtonId: string
) {
  const handleClickOutside = (event: MouseEvent) => {
    const dropdown = document.getElementById(dropdownId);
    const toggleButton = document.getElementById(toggleButtonId);
    
    // If clicking outside both the dropdown and toggle button, hide dropdown
    if (
      dropdown && 
      toggleButton && 
      !dropdown.contains(event.target as Node) &&
      !toggleButton.contains(event.target as Node)
    ) {
      dropdown.classList.add('hidden');
    }
  };

  // Add event listener
  document.addEventListener('mousedown', handleClickOutside);
  
  // Return cleanup function
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}

/**
 * Utility to toggle element visibility
 */
export function toggleElementVisibility(elementId: string) {
  const element = document.getElementById(elementId);
  if (element) {
    element.classList.toggle('hidden');
  }
}

/**
 * Setup Material Design ripple effect for a button
 */
export function setupRippleEffect(buttonElement: HTMLElement) {
  buttonElement.addEventListener('mousedown', (event) => {
    const ripple = document.createElement('span');
    const rect = buttonElement.getBoundingClientRect();
    
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x - size/2}px`;
    ripple.style.top = `${y - size/2}px`;
    ripple.classList.add('ripple-effect');
    
    buttonElement.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600); // Match animation duration
  });
}
