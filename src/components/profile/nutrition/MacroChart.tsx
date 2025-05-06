
import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
import { NUTRITION_COLORS } from '@/constants/nutrition';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from "@/lib/utils"; // Added the missing import

interface MacroChartProps {
  chartData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

export function MacroChart({ chartData }: MacroChartProps) {
  const isMobile = useIsMobile();
  
  // Use consistent colors from our nutrition color palette
  const enhancedChartData = chartData.map(item => ({
    ...item,
    // If the item has a color from the original data, use it. Otherwise, use our standard colors
    color: item.color || getColorForMacro(item.name),
    tooltip: getTooltipForMacro(item.name)
  }));

  // Custom tooltip for better information display
  const customTooltip = ({ active, payload }: any) => {
    if (!active || !payload || payload.length === 0) return null;
    
    const data = payload[0].payload;
    
    return (
      <div className="bg-white p-3 border rounded-md shadow-md text-xs">
        <p className="font-medium mb-1" style={{ color: data.color }}>{data.name}</p>
        <p><span className="font-semibold">{data.value}%</span> of daily intake</p>
        {data.tooltip && (
          <p className="mt-1 text-gray-500 text-xs">{data.tooltip}</p>
        )}
        {data.name.toLowerCase().includes('protein') && (
          <p className="mt-1 text-xs text-gray-500">4 calories per gram</p>
        )}
        {data.name.toLowerCase().includes('carb') && (
          <p className="mt-1 text-xs text-gray-500">4 calories per gram</p>
        )}
        {data.name.toLowerCase().includes('fat') && (
          <p className="mt-1 text-xs text-gray-500">9 calories per gram</p>
        )}
      </div>
    );
  };

  // Custom legend formatter for better readability
  const customLegendFormatter = (value: string, entry: any) => {
    return <span className={isMobile ? "text-[10px]" : "text-xs"}>{value}: <strong>{entry.payload.value}%</strong></span>;
  };
  
  // Render custom labels inside the chart - responsive for mobile
  const renderCustomizedLabel = ({ name, value, cx, cy, midAngle, innerRadius, outerRadius }: any) => {
    // Only show labels on desktop or for values ≥ 15%
    if (isMobile && value < 15) return null;
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const fontSize = isMobile ? 10 : 12;

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        fontSize={fontSize}
        fontWeight="bold"
      >
        {`${value}%`}
      </text>
    );
  };

  // Helper functions for colors and tooltips
  function getColorForMacro(name: string): string {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('protein')) return NUTRITION_COLORS.protein;
    if (lowerName.includes('carb')) return NUTRITION_COLORS.carbs;
    if (lowerName.includes('fat')) return NUTRITION_COLORS.fat;
    return '#8E9196'; // Default gray
  }
  
  function getTooltipForMacro(name: string): string {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('protein')) return 'Important for muscle maintenance and growth (4 cal/g)';
    if (lowerName.includes('carb')) return 'Primary energy source for your body (4 cal/g)';
    if (lowerName.includes('fat')) return 'Essential for hormone production and absorption (9 cal/g)';
    return '';
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <ChartContainer config={{
        protein: { color: NUTRITION_COLORS.protein },
        carbs: { color: NUTRITION_COLORS.carbs },
        fat: { color: NUTRITION_COLORS.fat },
      }} className={isMobile ? "h-56 w-full" : "h-64 w-full"}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie 
              data={enhancedChartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={isMobile ? 65 : 80}
              innerRadius={isMobile ? 35 : 50}
              dataKey="value"
              label={renderCustomizedLabel}
              strokeWidth={1}
              stroke="#ffffff"
              paddingAngle={2}
            >
              {enhancedChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={customTooltip} />
            <Legend 
              formatter={customLegendFormatter} 
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              iconSize={isMobile ? 8 : 10}
              wrapperStyle={isMobile ? { fontSize: '10px' } : undefined}
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
      <div className={cn(
        "text-center text-gray-500 mt-2",
        isMobile ? "text-[10px]" : "text-xs"
      )}>
        <p className="italic">*Protein and carbs provide 4 calories per gram, fat provides 9 calories per gram</p>
      </div>
    </div>
  );
}
