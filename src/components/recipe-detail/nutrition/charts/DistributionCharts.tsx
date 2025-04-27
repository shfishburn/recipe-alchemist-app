
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MacroDistributionPie } from './MacroDistributionPie';

interface MacroChartData {
  name: string;
  value: number;
  fill: string;
}

interface DistributionChartsProps {
  recipeMacros: MacroChartData[];
  targetMacros: MacroChartData[];
  colors: string[];
}

export function DistributionCharts({ recipeMacros, targetMacros, colors }: DistributionChartsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardContent className="p-2">
          <p className="text-xs text-muted-foreground mb-2 text-center">
            Recipe Macro Breakdown
          </p>
          <div className="h-40">
            <MacroDistributionPie data={recipeMacros} colors={colors} />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-2">
          <p className="text-xs text-muted-foreground mb-2 text-center">
            Your Target Macro Breakdown
          </p>
          <div className="h-40">
            <MacroDistributionPie data={targetMacros} colors={colors} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
