
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type NutriGrade = 'A' | 'B' | 'C' | 'D' | 'E' | string;

interface NutriScoreDetailProps {
  score: number | null;
  grade: NutriGrade | null;
  positive: {
    total: number | null;
    protein: number | null;
    fiber: number | null;
    fruit_veg_nuts: number | null;
  };
  negative: {
    total: number | null;
    energy: number | null;
    sugars: number | null;
    saturated_fat: number | null;
    sodium: number | null;
  };
}

export function NutriScoreDetail({
  score,
  grade,
  positive,
  negative
}: NutriScoreDetailProps) {
  // Handle null values
  const safeScore = score !== null ? score : '-';
  const safeGrade = grade || '?';

  // Get the grade-specific color class
  const getGradeColorClass = (grade: string): string => {
    switch (grade) {
      case 'A': return 'bg-green-500 border-green-600';
      case 'B': return 'bg-green-400 border-green-500';
      case 'C': return 'bg-yellow-400 border-yellow-500';
      case 'D': return 'bg-orange-400 border-orange-500';
      case 'E': return 'bg-red-500 border-red-600';
      default: return 'bg-gray-400 border-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          Nutri-Score
          <div 
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold border-2",
              getGradeColorClass(safeGrade as string)
            )}
          >
            {safeGrade}
          </div>
        </CardTitle>
        <CardDescription>
          Nutritional quality score: {safeScore}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-green-600">Positive Points</p>
            <ul className="text-xs space-y-1">
              <li className="flex justify-between">
                <span>Protein:</span> <span>{positive.protein ?? '-'}</span>
              </li>
              <li className="flex justify-between">
                <span>Fiber:</span> <span>{positive.fiber ?? '-'}</span>
              </li>
              <li className="flex justify-between">
                <span>Fruit/Veg/Nuts:</span> <span>{positive.fruit_veg_nuts ?? '-'}</span>
              </li>
              <li className="flex justify-between font-medium border-t pt-1">
                <span>Total:</span> <span>{positive.total ?? '-'}</span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-red-600">Negative Points</p>
            <ul className="text-xs space-y-1">
              <li className="flex justify-between">
                <span>Energy:</span> <span>{negative.energy ?? '-'}</span>
              </li>
              <li className="flex justify-between">
                <span>Sugars:</span> <span>{negative.sugars ?? '-'}</span>
              </li>
              <li className="flex justify-between">
                <span>Saturated Fat:</span> <span>{negative.saturated_fat ?? '-'}</span>
              </li>
              <li className="flex justify-between">
                <span>Sodium:</span> <span>{negative.sodium ?? '-'}</span>
              </li>
              <li className="flex justify-between font-medium border-t pt-1">
                <span>Total:</span> <span>{negative.total ?? '-'}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-3 text-xs text-gray-500">
          <p>Nutri-Score ranges from A (healthiest) to E (least healthy) based on nutritional content.</p>
        </div>
      </CardContent>
    </Card>
  );
}
