
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SimplifiedNutriScore } from './SimplifiedNutriScore';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { SimpleMicronutrientList } from './SimpleMicronutrientList';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

  return (
    <Card className="h-full overflow-hidden border border-slate-100 shadow-sm relative">
      {item.special && (
        <div className="absolute top-0 right-0 z-10">
          <Badge className="m-2 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600">
            Premium
          </Badge>
        </div>
      )}
      
      <CardHeader className="p-3 sm:p-4 pb-0">
        <div className="flex justify-between items-start flex-wrap gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base sm:text-lg truncate">{item.title}</CardTitle>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
          </div>
          {item.nutriScore && (
            <div className="flex-shrink-0">
              <SimplifiedNutriScore grade={item.nutriScore} />
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-3 sm:p-4">
        <Tabs defaultValue="chart" className="w-full">
          <TabsList className="w-full mb-3 grid grid-cols-2">
            <TabsTrigger value="chart" className="text-xs sm:text-sm">Distribution</TabsTrigger>
            <TabsTrigger value="details" className="text-xs sm:text-sm">Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chart" className="h-48 sm:h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={isMobile ? { top: 0, right: 0, bottom: 0, left: 0 } : { top: 5, right: 30, bottom: 5, left: 5 }}>
                <Pie
                  data={item.data}
                  cx="50%"
                  cy="50%"
                  innerRadius={isMobile ? 40 : 60}
                  outerRadius={isMobile ? 60 : 90}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                  label={isMobile ? undefined : ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {item.data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend 
                  layout={isMobile ? "horizontal" : "vertical"} 
                  verticalAlign={isMobile ? "bottom" : "middle"} 
                  align={isMobile ? "center" : "right"}
                  wrapperStyle={isMobile ? { fontSize: '10px' } : { fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="details">
            <div className="space-y-3 text-xs sm:text-sm overflow-x-hidden">
              {/* Nutri-Score details if available */}
              {item.nutriScore && (
                <div className="mb-3">
                  <h4 className="text-xs font-medium mb-1">Nutri-Score Details</h4>
                  <div className="overflow-x-auto -mx-3 sm:mx-0">
                    <Table className="text-xs w-full">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="py-1 px-2">Category</TableHead>
                          <TableHead className="py-1 px-2">Points</TableHead>
                          <TableHead className="py-1 px-2">Impact</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="py-1 px-2">Energy</TableCell>
                          <TableCell className="py-1 px-2">2</TableCell>
                          <TableCell className="text-red-600 py-1 px-2">Negative</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="py-1 px-2">Sugars</TableCell>
                          <TableCell className="py-1 px-2">1</TableCell>
                          <TableCell className="text-red-600 py-1 px-2">Negative</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="py-1 px-2">Fiber</TableCell>
                          <TableCell className="py-1 px-2">3</TableCell>
                          <TableCell className="text-green-600 py-1 px-2">Positive</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="py-1 px-2">Protein</TableCell>
                          <TableCell className="py-1 px-2">5</TableCell>
                          <TableCell className="text-green-600 py-1 px-2">Positive</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
              
              {/* Micronutrients data */}
              {item.showMicronutrients && item.micronutrientsData && (
                <div className="overflow-x-hidden">
                  <SimpleMicronutrientList data={item.micronutrientsData} />
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
