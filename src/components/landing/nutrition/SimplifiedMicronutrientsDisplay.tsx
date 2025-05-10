
import React from 'react';
import { Card } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface NutrientItem {
  name: string;
  value: string;
  percentage: string;
  color: string;
}

interface CategoryData {
  title: string;
  items: NutrientItem[];
}

interface SimplifiedMicronutrientsDisplayProps {
  data: {
    vitamins: CategoryData;
    minerals: CategoryData;
    others: CategoryData;
  };
  className?: string;
}

export function SimplifiedMicronutrientsDisplay({ data, className }: SimplifiedMicronutrientsDisplayProps) {
  const renderNutrientItem = (item: NutrientItem) => (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium">{item.name}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3 w-3 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-xs">Essential nutrient for overall health</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="text-right">
          <span className="text-sm mr-1">{item.value}</span>
          <span className="text-xs text-muted-foreground">({item.percentage} DV)</span>
        </div>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-1.5">
        <div 
          className="h-1.5 rounded-full" 
          style={{ 
            width: `${Math.min(parseInt(item.percentage.replace('%', '')), 100)}%`,
            backgroundColor: item.color 
          }}
          aria-hidden="true"
        ></div>
      </div>
    </div>
  );

  return (
    <Card className={`p-4 ${className}`}>
      <h3 className="text-base font-medium mb-4">Micronutrients</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h4 className="text-sm font-semibold mb-3">{data.vitamins.title}</h4>
          {data.vitamins.items.map((item, index) => (
            <div key={`vitamin-${index}`}>{renderNutrientItem(item)}</div>
          ))}
        </div>
        
        <div>
          <h4 className="text-sm font-semibold mb-3">{data.minerals.title}</h4>
          {data.minerals.items.map((item, index) => (
            <div key={`mineral-${index}`}>{renderNutrientItem(item)}</div>
          ))}
        </div>
        
        <div>
          <h4 className="text-sm font-semibold mb-3">{data.others.title}</h4>
          {data.others.items.map((item, index) => (
            <div key={`other-${index}`}>{renderNutrientItem(item)}</div>
          ))}
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground mt-4 italic">
        DV = Daily Value, based on recommended daily intakes for adults. Your personal needs may vary based on age, gender, and health status. (US units)
      </p>
    </Card>
  );
}
