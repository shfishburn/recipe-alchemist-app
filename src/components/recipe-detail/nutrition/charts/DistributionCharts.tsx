
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
    <div className="w-full mx-auto space-y-4 md:space-y-6">
      <HorizontalChartScroll 
        slidesPerView={isMobile ? 1 : 2}
        spaceBetween={16}
      >
        <Card className="border border-slate-200 w-full min-w-[260px]">
          <CardContent className={`flex flex-col items-center justify-center ${isMobile ? "p-3" : "p-4"}`}>
            <MacroDistributionPie 
              data={recipeMacros}
              title="Recipe Macro Breakdown"
              height={isMobile ? 180 : 220}
            />
          </CardContent>
        </Card>
        
        <Card className="border border-slate-200 w-full min-w-[260px]">
          <CardContent className={`flex flex-col items-center justify-center ${isMobile ? "p-3" : "p-4"}`}>
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
