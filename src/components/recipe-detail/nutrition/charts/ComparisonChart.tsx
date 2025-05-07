
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { formatNutrientWithUnit } from '@/utils/unit-conversion';

interface ComparisonDataItem {
  name: string;
  Recipe: number;
  Target: number;
  percentage: number;
  fill: string;
}

interface ComparisonChartProps {
  compareData: ComparisonDataItem[];
  unitSystem?: 'metric' | 'imperial';
}

export function ComparisonChart({ compareData, unitSystem = 'metric' }: ComparisonChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      
      let formattedRecipe: string;
      let formattedTarget: string;
      
      if (label === 'Calories') {
        formattedRecipe = `${Math.round(dataPoint.Recipe)} kcal`;
        formattedTarget = `${Math.round(dataPoint.Target)} kcal`;
      } else {
        formattedRecipe = formatNutrientWithUnit(dataPoint.Recipe, 'g', unitSystem);
        formattedTarget = formatNutrientWithUnit(dataPoint.Target, 'g', unitSystem);
      }
      
      return (
        <div className="custom-tooltip bg-white p-2 shadow border rounded text-xs">
          <p className="label font-medium">{`${label}`}</p>
          <p className="value">{`Recipe: ${formattedRecipe}`}</p>
          <p className="value">{`Target: ${formattedTarget}`}</p>
          <p className="percentage">{`${dataPoint.percentage}% of daily target`}</p>
        </div>
      );
    }
  
    return null;
  };

  // Function to format values with the correct unit
  const formatYAxis = (value: number) => {
    // Since this function is used for the Y-axis which shows grams, use 'g' as the unit
    if (value === 0) return '0';
    
    const formatted = formatNutrientWithUnit(value, 'g', unitSystem);
    // Remove the unit for the axis labels for cleaner display
    return formatted.replace(' g', '').replace(' oz', '');
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={compareData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis tickFormatter={formatYAxis} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="Recipe" fill="#8884d8" name="Recipe" />
        <Bar dataKey="Target" fill="#82ca9d" name="Daily Target" />
        {compareData.map((item, index) => (
          <ReferenceLine
            key={`ref-upper-${index}`}
            y={item.Target * 1.2}
            stroke="#ff7300"
            strokeDasharray="3 3"
            label={{ value: '+20%', position: 'insideTopRight', fill: '#ff7300', fontSize: 10 }}
          />
        ))}
        {compareData.map((item, index) => (
          <ReferenceLine
            key={`ref-lower-${index}`}
            y={item.Target * 0.8}
            stroke="#ff7300"
            strokeDasharray="3 3"
            label={{ value: '-20%', position: 'insideBottomRight', fill: '#ff7300', fontSize: 10 }}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
