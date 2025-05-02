
import React, { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load the chart components
const MacroChart = React.lazy(() => 
  import('@/components/profile/nutrition/MacroChart').then(module => ({
    default: module.MacroChart
  }))
);

const MacroPieCharts = React.lazy(() => 
  import('@/components/profile/macro-details/MacroPieCharts').then(module => ({
    default: module.MacroPieCharts
  }))
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
    <div className="space-y-4 px-4 md:px-8 py-4 flex flex-col items-center">
      <h3 className="text-center text-xl font-semibold text-recipe-purple">{item.title}</h3>
      
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full">
        <div className="w-full max-w-xs flex justify-center">
          <Suspense fallback={
            <div className="h-52 flex items-center justify-center">
              <Skeleton className="h-40 w-40 rounded-full" />
            </div>
          }>
            <MacroChart chartData={item.data} />
          </Suspense>
        </div>
        
        {item.special ? (
          <div className="w-full max-w-xs flex justify-center">
            <Suspense fallback={
              <div className="h-52 flex items-center justify-center">
                <Skeleton className="h-40 w-40" />
              </div>
            }>
              <MacroPieCharts carbsData={carbsData} fatsData={fatsData} />
            </Suspense>
          </div>
        ) : (
          <div className="w-full max-w-xs space-y-3 flex flex-col items-center">
            <p className="text-center text-sm md:text-base">
              {item.description}
            </p>
            
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg w-full">
              <ul className="space-y-2 w-full">
                {item.data.map((macro, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: macro.color }}></span>
                      <span className="text-sm">{macro.name}</span>
                    </div>
                    <span className="font-semibold text-sm">{macro.value}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
