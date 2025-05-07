
import { getCuisineCategoryByValue, CuisineCategory } from '@/config/cuisine-config';

/**
 * Returns the appropriate cuisine category for a given cuisine string
 * This function ensures database compatibility by mapping any cuisine value
 * to a valid category in our database schema
 * 
 * @param cuisine The cuisine string to categorize
 * @returns A valid cuisine category that matches database enum constraints
 */
export const getCuisineCategory = (cuisine: string | null | undefined): CuisineCategory => {
  if (!cuisine || cuisine.trim() === '') {
    return "Global";
  }
  
  return getCuisineCategoryByValue(cuisine);
};
