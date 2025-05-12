
// Utility functions for handling timeouts in API requests

// Set a timeout for the request to prevent indefinite loading
export const createTimeoutPromise = (duration: number = 90000): Promise<never> => {
  return new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error("Recipe generation timed out. Please try again.")), duration);
  });
};
