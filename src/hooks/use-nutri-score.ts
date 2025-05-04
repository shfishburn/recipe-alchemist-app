
import { useMemo } from 'react';
import type { Recipe } from '@/types/recipe';

type NutriScoreGrade = 'A' | 'B' | 'C' | 'D' | 'E' | null;

interface NutriScoreData {
  score: number | null;
  grade: NutriScoreGrade;
  positives: Array<{
    name: string;
    type: 'positive';
    icon?: string;
    value?: string | number;
  }>;
  negatives: Array<{
    name: string;
    type: 'negative';
    icon?: string;
    value?: string | number;
  }>;
  servingSize?: number;
  healthScore?: 'low' | 'medium' | 'high' | null;
  hasData: boolean;
}

export function useNutriScore(recipe: Recipe | undefined): NutriScoreData {
  return useMemo(() => {
    // Default empty state
    const defaultData: NutriScoreData = {
      score: null,
      grade: null,
      positives: [],
      negatives: [],
      healthScore: null,
      hasData: false,
    };

    if (!recipe) return defaultData;

    // Check if we have nutri_score data
    const nutriScoreData = recipe.nutri_score;
    if (!nutriScoreData) return defaultData;

    // Extract the grade and score
    const score = nutriScoreData.score;
    const grade = nutriScoreData.grade as NutriScoreGrade;

    // Get serving size if available
    const servingSize = recipe.nutrition?.serving_size_g || undefined;

    // Extract health score
    let healthScore: 'low' | 'medium' | 'high' | null = null;
    
    // We can derive health score from Nutri-Score grade or nutrition scores
    if (grade) {
      if (grade === 'A' || grade === 'B') healthScore = 'high';
      else if (grade === 'C') healthScore = 'medium';
      else healthScore = 'low';
    }

    // Generate positives and negatives
    const positives: NutriScoreData['positives'] = [];
    const negatives: NutriScoreData['negatives'] = [];

    // Check for nutrition facts to determine positives and negatives
    if (recipe.nutrition) {
      const nutrition = recipe.nutrition;
      
      // Positives
      if (nutrition.protein > 10) {
        positives.push({
          name: 'Protein',
          type: 'positive',
          value: `${Math.round(nutrition.protein)}g`,
        });
      }
      
      if (nutrition.fiber > 3) {
        positives.push({
          name: 'Fiber',
          type: 'positive',
          value: `${Math.round(nutrition.fiber)}g`,
        });
      }
      
      // Negatives
      if (nutrition.fat > 10) {
        negatives.push({
          name: 'Saturated fat',
          type: 'negative',
          value: `${Math.round(nutrition.fat * 0.3)}g`, // Estimate saturated fat as 30% of total fat
        });
      }
      
      if (nutrition.sugar > 10) {
        negatives.push({
          name: 'Sugar',
          type: 'negative',
          value: `${Math.round(nutrition.sugar)}g`,
        });
      }
      
      if (nutrition.sodium > 400) {
        negatives.push({
          name: 'Sodium',
          type: 'negative',
          value: `${Math.round(nutrition.sodium)}mg`,
        });
      }
      
      if (nutrition.calories > 400) {
        negatives.push({
          name: 'Calories',
          type: 'negative',
          value: `${Math.round(nutrition.calories)} kcal`,
        });
      }
    }

    // If we have a nutri_score but no derived positives/negatives,
    // add defaults based on the grade
    if (grade && positives.length === 0 && negatives.length === 0) {
      if (grade === 'A' || grade === 'B') {
        positives.push({ name: 'Protein', type: 'positive' });
        positives.push({ name: 'Fiber', type: 'positive' });
      } else if (grade === 'D' || grade === 'E') {
        negatives.push({ name: 'Saturated fat', type: 'negative' });
        negatives.push({ name: 'Sugar', type: 'negative' });
      }
    }

    return {
      score,
      grade,
      positives,
      negatives,
      servingSize,
      healthScore,
      hasData: true,
    };
  }, [recipe]);
}
