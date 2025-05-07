
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MacroDistributionPie } from './MacroDistributionPie';
import { useIsMobile } from '@/hooks/use-mobile';

interface MacroChartData {
  name: string;
  value: number;
  fill: string;
}

interface DistributionChartsProps {
  recipeMacros: MacroChartData[];
  targetMacros: MacroChartData[];
}

export function DistributionCharts({ recipeMacros, targetMacros }: DistributionChartsProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className="w-full mx-auto space-y-4 md:space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Card className="border border-slate-200 w-full">
          <CardContent className={`flex flex-col items-center justify-center ${isMobile ? "p-3" : "p-4"}`}>
            <MacroDistributionPie 
              data={recipeMacros}
              title="Recipe Macro Breakdown"
              height={isMobile ? 180 : 220}
            />
          </CardContent>
        </Card>
        
        <Card className="border border-slate-200 w-full">
          <CardContent className={`flex flex-col items-center justify-center ${isMobile ? "p-3" : "p-4"}`}>
            <MacroDistributionPie 
              data={targetMacros}
              title="Your Target Macro Breakdown"
              height={isMobile ? 180 : 220}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
