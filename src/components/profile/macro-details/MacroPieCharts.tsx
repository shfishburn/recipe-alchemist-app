
import React from 'react';
import { PieChart, Pie, Cell, Legend } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
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
  
  const renderChart = (data: any[], title: string) => (
    <div className="flex-1 min-w-0">
      <h3 className="text-xs font-medium text-center">{title}</h3>
      <div className="max-w-[180px] mx-auto">
        <ChartContainer 
          config={{
            [data[0].name]: { color: data[0].color },
            [data[1].name]: { color: data[1].color },
          }} 
          className="h-[90px] w-full"
        >
          <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <Pie 
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={isMobile ? 30 : 35}
              fill="#8884d8"
              dataKey="value"
              label={({ name, value }) => `${value}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend 
              layout="horizontal"
              verticalAlign="bottom" 
              align="center"
              wrapperStyle={{ 
                fontSize: '8px',
                width: '100%',
                margin: '0 auto'
              }}
            />
          </PieChart>
        </ChartContainer>
      </div>
    </div>
  );
  
  return (
    <div className="w-full flex flex-row gap-1 justify-center items-start">
      {renderChart(carbsData, "Carbs Distribution")}
      {renderChart(fatsData, "Fat Distribution")}
    </div>
  );
};

export default MacroPieCharts;
