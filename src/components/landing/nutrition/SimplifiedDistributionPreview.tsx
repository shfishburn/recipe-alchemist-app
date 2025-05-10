
import React from 'react';
import { SimplifiedMacroChart } from './SimplifiedMacroChart';
import { SimplifiedMacroLegend } from './SimplifiedMacroLegend';
import Image from './nutrition-distribution.png';
import { useIsMobile } from '@/hooks/use-mobile';

interface SimplifiedDistributionPreviewProps {
  macroData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

export function SimplifiedDistributionPreview({ macroData }: SimplifiedDistributionPreviewProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className="w-full flex flex-col md:flex-row gap-6 md:gap-10 items-center justify-center">
      <div className="w-full md:w-1/2 max-w-[300px] flex flex-col items-center">
        <h3 className="text-center text-sm font-medium mb-2 text-gray-700">
          Macro Distribution
        </h3>
        <SimplifiedMacroChart data={macroData} height={isMobile ? 150 : 180} />
        <SimplifiedMacroLegend data={macroData} />
      </div>
      
      <div className="w-full md:w-1/2 max-w-[400px] bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
        <h3 className="text-center text-sm font-medium mb-2 text-gray-700">
          Key Nutrition Insights
        </h3>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-recipe-purple font-bold">•</span>
            <span className="text-sm">
              <strong>Balanced macros</strong> optimize energy, muscle growth, and metabolic health
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-recipe-green font-bold">•</span>
            <span className="text-sm">
              <strong>Protein timing</strong> throughout the day improves muscle synthesis
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-recipe-blue font-bold">•</span>
            <span className="text-sm">
              <strong>Quality carbs</strong> provide sustained energy and better recovery
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
