
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MacroDistributionPie } from './MacroDistributionPie';
import { useIsMobile } from '@/hooks/use-mobile';
import { HorizontalChartScroll } from '@/components/ui/chart-scroll/HorizontalChartScroll';

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
    <div className="w-full mx-auto space-y-4">
      <HorizontalChartScroll 
        slidesPerView={1}
        spaceBetween={16}
      >
        <Card className="border border-slate-200 w-full mb-3">
          <CardContent className={`flex flex-col items-center justify-center ${isMobile ? "p-2 py-3" : "p-4"}`}>
            <MacroDistributionPie 
              data={recipeMacros}
              title="Recipe Macro Breakdown"
              height={isMobile ? 180 : 220}
            />
          </CardContent>
        </Card>
        
        <Card className="border border-slate-200 w-full mb-3">
          <CardContent className={`flex flex-col items-center justify-center ${isMobile ? "p-2 py-3" : "p-4"}`}>
            <MacroDistributionPie 
              data={targetMacros}
              title="Your Target Macro Breakdown"
              height={isMobile ? 180 : 220}
            />
          </CardContent>
        </Card>
      </HorizontalChartScroll>
    </div>
  );
}
