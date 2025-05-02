
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
    <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
      <Card className="border border-slate-200">
        <CardContent className={isMobile ? "p-3" : "p-4"}>
          <MacroDistributionPie 
            data={recipeMacros}
            title="Recipe Macro Breakdown"
            height={isMobile ? 180 : 220}
          />
        </CardContent>
      </Card>
      
      <Card className="border border-slate-200">
        <CardContent className={isMobile ? "p-3" : "p-4"}>
          <MacroDistributionPie 
            data={targetMacros}
            title="Your Target Macro Breakdown"
            height={isMobile ? 180 : 220}
          />
        </CardContent>
      </Card>
    </div>
  );
}
