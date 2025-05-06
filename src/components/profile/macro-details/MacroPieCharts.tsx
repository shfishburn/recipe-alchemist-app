
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
    <div className="w-full mb-8">
      <h3 className="text-base font-medium mb-3 text-center">{title}</h3>
      <div className="max-w-[300px] mx-auto">
        <ChartContainer 
          config={{
            [data[0].name]: { color: data[0].color },
            [data[1].name]: { color: data[1].color },
          }} 
          className="h-[180px] w-full"
        >
          <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <Pie 
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={isMobile ? 50 : 60}
              fill="#8884d8"
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}%`}
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
                paddingTop: '8px',
                fontSize: '11px',
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
    <div className="w-full flex flex-col items-center">
      {renderChart(carbsData, "Carbohydrate Distribution")}
      {renderChart(fatsData, "Fat Distribution")}
    </div>
  );
};

export default MacroPieCharts;
