
import React, { Suspense, lazy } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { MacroChart } from './MacroChart';
import { MacroDetailsPanel } from './MacroDetailsPanel';
import { NutriScoreDisplay } from '@/components/recipe-detail/nutrition/nutri-score/NutriScoreDisplay';
import { NutriScoreInfoCard } from '@/components/recipe-detail/nutrition/charts/NutriScoreInfoCard';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col min-h-0 h-full w-full py-2">
      <h3 className="text-center text-base sm:text-lg font-semibold text-recipe-purple">
        {item.title}
      </h3>
      
      <div className={`flex flex-col flex-1 justify-center items-center w-full max-w-3xl mx-auto ${isMobile ? 'gap-1' : 'gap-2'}`}>
        {nutriScoreExample && item.nutriScore ? (
          <div className="flex flex-col items-center justify-center flex-1 max-h-full overflow-hidden">
            <div className="w-full max-w-[320px] mx-auto">
              <NutriScoreInfoCard nutriScore={item.nutriScore} />
              <div className="text-xs text-center text-gray-500 mt-1">
                <p>{item.description}</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {item.data && (
              <div className="flex-shrink-0 w-full max-w-[220px] mx-auto">
                <Suspense fallback={
                  <div className="flex items-center justify-center">
                    <Skeleton className="h-20 w-20 rounded-full" />
                  </div>
                }>
                  <MacroChart 
                    data={item.data}
                    height={isMobile ? 100 : 120}
                    showTooltip 
                  />
                  {!item.special && (
                    <div className="text-[9px] sm:text-xs text-center text-gray-500 mt-1">
                      <p className="italic">*Protein and carbs: 4 cal/g, fat: 9 cal/g</p>
                    </div>
                  )}
                </Suspense>
              </div>
            )}
            
            {item.special ? (
              <div className="flex flex-col items-center w-full flex-1 mt-1">
                <Suspense fallback={
                  <div className="flex items-center justify-center w-full">
                    <Skeleton className="h-16 w-full" />
                  </div>
                }>
                  <MacroPieCharts carbsData={carbsData} fatsData={fatsData} />
                </Suspense>
              </div>
            ) : (
              <div className="flex flex-col items-center w-full flex-1">
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
