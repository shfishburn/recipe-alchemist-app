
import React, { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { MacroChart } from './MacroChart';
import { MacroDetailsPanel } from './MacroDetailsPanel';
import dynamic from 'next/dynamic';

// Dynamically load the detailed charts component
const MacroPieCharts = dynamic(() => 
  import('@/components/profile/macro-details/MacroPieCharts').then(module => ({
    default: module.MacroPieCharts
  })),
  { ssr: false }
);

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
    <div className="space-y-4 px-4 md:px-8 py-4 flex flex-col items-center w-full">
      <h3 className="text-center text-xl font-semibold text-recipe-purple">{item.title}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mx-auto">
        <div className="flex flex-col items-center">
          <div className="w-full max-w-[280px]">
            <Suspense fallback={
              <div className="h-52 flex items-center justify-center">
                <Skeleton className="h-40 w-40 rounded-full" />
              </div>
            }>
              <MacroChart 
                data={item.data}
                height={220}
                showTooltip 
              />
              <div className="text-xs text-center text-gray-500 mt-1">
                <p className="italic">*Protein and carbs: 4 cal/g, fat: 9 cal/g</p>
              </div>
            </Suspense>
          </div>
        </div>
        
        {item.special ? (
          <div className="flex flex-col items-center">
            <Suspense fallback={
              <div className="h-52 flex items-center justify-center">
                <Skeleton className="h-40 w-40" />
              </div>
            }>
              <MacroPieCharts carbsData={carbsData} fatsData={fatsData} />
            </Suspense>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <MacroDetailsPanel 
              title={item.title}
              description={item.description}
              data={item.data}
            />
          </div>
        )}
      </div>
    </div>
  );
}
