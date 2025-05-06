
import React from 'react';
import { PieChart, Pie, Cell, Legend } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
import { HorizontalChartScroll } from '@/components/ui/chart-scroll/HorizontalChartScroll';
import { useIsMobile } from '@/hooks/use-mobile';

interface MacroPieChartsProps {
  carbsData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  fatsData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

const MacroPieCharts = ({ carbsData, fatsData }: MacroPieChartsProps) => {
  const isMobile = useIsMobile();
  const chartHeight = isMobile ? 40 : 40;
  
  const renderChart = (data: any[], title: string) => (
    <div className="w-full">
      <h3 className="text-lg font-medium mb-4 text-center">{title}</h3>
      <ChartContainer config={{
        [data[0].name]: { color: data[0].color },
        [data[1].name]: { color: data[1].color },
      }} className={`h-${chartHeight} w-full`}>
        <PieChart>
          <Pie 
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={70}
            fill="#8884d8"
            dataKey="value"
            label={({ name, value }) => `${name}: ${value}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </ChartContainer>
    </div>
  );
  
  return (
    <div className="w-full space-y-4">
      {renderChart(carbsData, "Carbohydrate Distribution")}
      {renderChart(fatsData, "Fat Distribution")}
    </div>
  );
};

export default MacroPieCharts;
