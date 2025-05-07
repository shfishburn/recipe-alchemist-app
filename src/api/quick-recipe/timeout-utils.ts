
/**
 * Creates a promise that rejects after the specified timeout period
 * @param ms Timeout duration in milliseconds
 * @returns Promise that rejects with a timeout error after the specified duration
 */
export const createTimeoutPromise = (ms: number): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request timed out after ${ms}ms`));
    }, ms);
  });
};
