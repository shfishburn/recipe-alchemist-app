
export function saveModificationRequest(request: string, immediate: boolean): void {
  if (request) {
    localStorage.setItem('recipe_modification_request', request);
    localStorage.setItem('recipe_modification_page', window.location.pathname);
    localStorage.setItem('recipe_modification_immediate', String(immediate));
  }
}

export function getStoredModificationRequest(): {request: string, immediate: boolean} | null {
  const request = localStorage.getItem('recipe_modification_request');
  if (!request) return null;
  
  const immediate = localStorage.getItem('recipe_modification_immediate') === 'true';
  
  // Clean up storage
  localStorage.removeItem('recipe_modification_request');
  localStorage.removeItem('recipe_modification_page');
  localStorage.removeItem('recipe_modification_immediate');
  
  return { request, immediate };
}
