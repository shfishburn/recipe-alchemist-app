
import React, { Suspense, lazy } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { MacroChart } from './MacroChart';
import { MacroDetailsPanel } from './MacroDetailsPanel';
import { SimplifiedMicronutrientsDisplay } from './SimplifiedMicronutrientsDisplay';

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
    showMicronutrients?: boolean;
    micronutrientsData?: any;
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
  // Create an accessible summary of the chart data for screen readers
  const accessibleSummary = item.data.map(d => `${d.name}: ${d.value}%`).join(', ');
  
  // Sample micronutrients data structure
  const sampleMicronutrientsData = {
    vitamins: {
      title: "Vitamins",
      items: [
        { name: "Vitamin A", value: "2.6 lb", percentage: "133%", color: "#A5C8FF" },
        { name: "Vitamin C", value: "10g", percentage: "11%", color: "#FFF8A5" },
        { name: "Vitamin D", value: "75g", percentage: "375%", color: "#A5C8FF" }
      ]
    },
    minerals: {
      title: "Minerals",
      items: [
        { name: "Calcium", value: "150mg", percentage: "12%", color: "#FFF8A5" },
        { name: "Iron", value: "5mg", percentage: "28%", color: "#FFF8A5" },
        { name: "Potassium", value: "800mg", percentage: "17%", color: "#FFF8A5" }
      ]
    },
    others: {
      title: "Other Nutrients",
      items: [
        { name: "Sodium", value: "1.2 g", percentage: "52%", color: "#B5FFD9" },
        { name: "Fiber", value: "3g", percentage: "11%", color: "#FFF8A5" },
        { name: "Sugar", value: "2g", percentage: "4%", color: "#FFB5B5" }
      ]
    }
  };
  
  return (
    <div className="w-full px-2 sm:px-4 pt-1 pb-2 flex flex-col items-center" aria-label={`Nutrition chart for ${item.title}`}>
      <h3 className="text-center text-lg sm:text-xl font-semibold text-recipe-purple mb-2 sm:mb-3" id={`chart-title-${item.title.replace(/\s+/g, '-').toLowerCase()}`}>
        {item.title}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
        <div className="flex flex-col items-center justify-center">
          <div className="w-full max-w-[240px] mx-auto overflow-visible -mt-1">
            <Suspense fallback={
              <div className="h-[180px] w-full mx-auto flex items-center justify-center">
                <Skeleton className="h-[160px] w-[160px] rounded-full" />
              </div>
            }>
              <figure>
                <MacroChart 
                  data={item.data}
                  height={180}
                  showTooltip 
                  titleId={`chart-title-${item.title.replace(/\s+/g, '-').toLowerCase()}`}
                />
                <figcaption className="sr-only">
                  {item.title} - {accessibleSummary}
                </figcaption>
                <div className="text-xs text-center text-gray-500 mt-1">
                  <p className="italic">*Protein and carbs: 4 cal/g, fat: 9 cal/g</p>
                </div>
              </figure>
            </Suspense>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center">
          {item.showMicronutrients ? (
            <SimplifiedMicronutrientsDisplay 
              data={item.micronutrientsData || sampleMicronutrientsData}
              className="w-full"
            />
          ) : item.special ? (
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
