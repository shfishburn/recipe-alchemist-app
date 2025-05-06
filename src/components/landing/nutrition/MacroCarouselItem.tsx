
import React, { Suspense, lazy } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { MacroChart } from './MacroChart';
import { MacroDetailsPanel } from './MacroDetailsPanel';
import { NutriScoreDisplay } from '@/components/recipe-detail/nutrition/nutri-score/NutriScoreDisplay';
import { NutriScoreInfoCard } from '@/components/recipe-detail/nutrition/charts/NutriScoreInfoCard';

// Use React's lazy loading for the MacroPieCharts component
const MacroPieCharts = lazy(() => import('@/components/profile/macro-details/MacroPieCharts'));

interface MacroCarouselItemProps {
  item: {
    title: string;
    description: string;
    data?: Array<{
      name: string;
      value: number;
      color: string;
    }>;
    special?: boolean;
    nutriScore?: {
      grade: "A" | "B" | "C" | "D" | "E";
      score: number;
    };
  };
  carbsData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  fatsData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  nutriScoreExample?: boolean;
}

export function MacroCarouselItem({ item, carbsData, fatsData, nutriScoreExample = false }: MacroCarouselItemProps) {
  return (
    <div className="px-1 md:px-4 py-1 flex flex-col items-center w-full">
      <h3 className="text-center text-lg font-semibold text-recipe-purple mb-1">{item.title}</h3>
      
      <div className="flex flex-col gap-2 w-full max-w-3xl mx-auto">
        {nutriScoreExample && item.nutriScore ? (
          <div className="flex flex-col items-center">
            <div className="w-full max-w-[320px] mx-auto">
              <NutriScoreInfoCard nutriScore={item.nutriScore} />
              <div className="text-xs text-center text-gray-500 mt-2">
                <p>{item.description}</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center">
              <div className="w-full max-w-[240px] mx-auto">
                <Suspense fallback={
                  <div className="h-32 flex items-center justify-center">
                    <Skeleton className="h-24 w-24 rounded-full" />
                  </div>
                }>
                  {item.data && (
                    <>
                      <MacroChart 
                        data={item.data}
                        height={150}
                        showTooltip 
                      />
                      <div className="text-xs text-center text-gray-500 mt-0.5">
                        <p className="italic">*Protein and carbs: 4 cal/g, fat: 9 cal/g</p>
                      </div>
                    </>
                  )}
                </Suspense>
              </div>
            </div>
            
            {item.special ? (
              <div className="flex flex-col items-center w-full">
                <Suspense fallback={
                  <div className="h-32 w-full flex items-center justify-center">
                    <Skeleton className="h-24 w-full" />
                  </div>
                }>
                  <MacroPieCharts carbsData={carbsData} fatsData={fatsData} />
                </Suspense>
              </div>
            ) : (
              <div className="flex flex-col items-center w-full">
                {item.data && (
                  <MacroDetailsPanel 
                    title={item.title}
                    description={item.description}
                    data={item.data}
                  />
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
