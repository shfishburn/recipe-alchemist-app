
import React, { Suspense, lazy } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { MacroChart } from './MacroChart';
import { MacroDetailsPanel } from './MacroDetailsPanel';

// Use React's lazy loading for the MacroPieCharts component
const MacroPieCharts = lazy(() => import('@/components/profile/macro-details/MacroPieCharts'));

interface MacroCarouselItemProps {
  item: {
    title: string;
    description: string;
    data: Array<{
      name: string;
      value: number;
      color: string;
    }>;
    special?: boolean;
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
}

export function MacroCarouselItem({ item, carbsData, fatsData }: MacroCarouselItemProps) {
  return (
    <div className="w-full px-2 sm:px-4 py-4 flex flex-col items-center">
      <h3 className="text-center text-lg sm:text-xl font-semibold text-recipe-purple mb-3 sm:mb-4">
        {item.title}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
        <div className="flex flex-col items-center justify-center">
          <div className="w-full max-w-[240px] mx-auto">
            <Suspense fallback={
              <div className="h-[180px] w-full mx-auto flex items-center justify-center">
                <Skeleton className="h-[160px] w-[160px] rounded-full" />
              </div>
            }>
              <MacroChart 
                data={item.data}
                height={180}
                showTooltip 
              />
              <div className="text-xs text-center text-gray-500 mt-1">
                <p className="italic">*Protein and carbs: 4 cal/g, fat: 9 cal/g</p>
              </div>
            </Suspense>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center">
          {item.special ? (
            <Suspense fallback={
              <div className="h-[180px] w-full flex items-center justify-center">
                <Skeleton className="h-[160px] w-[180px]" />
              </div>
            }>
              <MacroPieCharts carbsData={carbsData} fatsData={fatsData} />
            </Suspense>
          ) : (
            <MacroDetailsPanel 
              title={item.title}
              description={item.description}
              data={item.data}
            />
          )}
        </div>
      </div>
    </div>
  );
}
