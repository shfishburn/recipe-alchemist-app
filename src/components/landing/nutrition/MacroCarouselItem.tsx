
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SimplifiedNutriScore } from './SimplifiedNutriScore';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { SimpleMicronutrientList } from './SimpleMicronutrientList';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MacroItem {
  title: string;
  description: string;
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  special?: boolean;
  nutriScore?: 'A' | 'B' | 'C' | 'D' | 'E';
  showMicronutrients?: boolean;
  micronutrientsData?: any;
}

interface MacroCarouselItemProps {
  item: MacroItem;
  carbsData: Array<{ name: string; value: number; color: string }>;
  fatsData: Array<{ name: string; value: number; color: string }>;
}

export function MacroCarouselItem({ item, carbsData, fatsData }: MacroCarouselItemProps) {
  return (
    <Card className="h-full overflow-hidden border border-slate-100 shadow-sm relative">
      {item.special && (
        <div className="absolute top-0 right-0 z-10">
          <Badge className="m-2 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600">
            Premium
          </Badge>
        </div>
      )}
      
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{item.title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
          </div>
          {item.nutriScore && (
            <SimplifiedNutriScore grade={item.nutriScore} />
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <Tabs defaultValue="chart">
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="chart" className="flex-1">Distribution Chart</TabsTrigger>
            <TabsTrigger value="details" className="flex-1">Nutrient Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chart" className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={item.data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {item.data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend layout="vertical" verticalAlign="middle" align="right" />
              </PieChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="details">
            <div className="space-y-4">
              {/* Nutri-Score details if available */}
              {item.nutriScore && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Nutri-Score Details</h4>
                  <Table className="text-xs">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="py-2">Category</TableHead>
                        <TableHead className="py-2">Points</TableHead>
                        <TableHead className="py-2">Impact</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Energy (kcal)</TableCell>
                        <TableCell>2</TableCell>
                        <TableCell className="text-red-600">Negative</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Sugars (g)</TableCell>
                        <TableCell>1</TableCell>
                        <TableCell className="text-red-600">Negative</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Fiber (g)</TableCell>
                        <TableCell>3</TableCell>
                        <TableCell className="text-green-600">Positive</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Protein (g)</TableCell>
                        <TableCell>5</TableCell>
                        <TableCell className="text-green-600">Positive</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              )}
              
              {/* Micronutrients data */}
              {item.showMicronutrients && item.micronutrientsData && (
                <SimpleMicronutrientList data={item.micronutrientsData} />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
