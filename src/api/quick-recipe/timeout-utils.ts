
/**
 * @locked
 * DO NOT MODIFY WITHOUT APPROVAL — S. Fishburn, 2025-05-12
 * Reason: Critical timeout handling utility used in recipe generation to prevent
 * indefinite loading states. Carefully tuned for user experience.
 */
export const createTimeoutPromise = (duration: number = 90000): Promise<never> => {
  return new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error("Recipe generation timed out. Please try again.")), duration);
  });
};
