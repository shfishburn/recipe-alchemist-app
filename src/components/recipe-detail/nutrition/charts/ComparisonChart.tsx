
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';
import { ChartTooltip } from './ChartTooltip';
import { useIsMobile } from '@/hooks/use-mobile';

interface ComparisonChartProps {
  compareData: Array<{
    name: string;
    Recipe: number;
    Target: number;
    percentage: number;
    fill: string;
  }>;
}

export function ComparisonChart({ compareData }: ComparisonChartProps) {
  const isMobile = useIsMobile();
  
  return (
    <Card>
      <CardContent className="p-2">
        <p className="text-xs text-muted-foreground mb-2 text-center">
          Recipe vs. Daily Targets (g)
        </p>
        <ChartContainer config={{
          protein: { color: '#4f46e5' },
          carbs: { color: '#0ea5e9' },
          fat: { color: '#22c55e' },
        }} className={`${isMobile ? 'h-52' : 'h-64'} w-full`}>
          <BarChart data={compareData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" fontSize={isMobile ? 10 : 12} />
            <YAxis fontSize={isMobile ? 10 : 12} />
            <Tooltip content={props => <ChartTooltip {...props} />} />
            <Legend wrapperStyle={isMobile ? { fontSize: '10px' } : undefined} />
            <Bar dataKey="Recipe" fill="#4f46e5" name="Recipe" />
            <Bar dataKey="Target" fill="#94a3b8" name="Daily Target" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
