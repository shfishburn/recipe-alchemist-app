
import React from 'react';
import nutritionDistributionImage from './nutrition-distribution.png';
import { cn } from '@/lib/utils';

interface SimplifiedDistributionPreviewProps {
  className?: string;
  alt?: string;
  macroData?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

export function SimplifiedDistributionPreview({ 
  className, 
  alt = "Nutrition distribution visualization",
  macroData
}: SimplifiedDistributionPreviewProps) {
  return (
    <div className={cn("rounded-lg overflow-hidden bg-white", className)}>
      <img 
        src={nutritionDistributionImage} 
        alt={alt}
        className="w-full h-auto max-h-[180px] object-contain"
        loading="lazy"
      />
      
      {macroData && (
        <div className="p-4 bg-white">
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {macroData.map((item, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="h-3 w-3 rounded-full mr-2" 
                  style={{ backgroundColor: item.color }}
                  aria-hidden="true"
                />
                <span className="text-sm font-medium mr-1">{item.name}:</span>
                <span className="text-sm font-semibold">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
