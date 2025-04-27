
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
    <div className="grid grid-cols-1 gap-4">
      <Card>
        <CardContent className={isMobile ? "p-1" : "p-2"}>
          <MacroDistributionPie 
            data={recipeMacros}
            title="Recipe Macro Breakdown"
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className={isMobile ? "p-1" : "p-2"}>
          <MacroDistributionPie 
            data={targetMacros}
            title="Your Target Macro Breakdown"
          />
        </CardContent>
      </Card>
    </div>
  );
}
