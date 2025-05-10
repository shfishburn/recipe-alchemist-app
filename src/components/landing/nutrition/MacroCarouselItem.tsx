
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
    <Card className="h-full overflow-hidden border border-slate-100 shadow-sm relative w-full">
      {item.special && (
        <div className="absolute top-0 right-0 z-10">
          <Badge className="m-2 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600">
            Premium
          </Badge>
        </div>
      )}
      
      <CardHeader className="p-2 sm:p-4 pb-0">
        <div className="flex justify-between items-start flex-wrap gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm sm:text-lg truncate">{item.title}</CardTitle>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
          </div>
          {item.nutriScore && (
            <div className="flex-shrink-0">
              <SimplifiedNutriScore grade={item.nutriScore} />
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-2 sm:p-4">
        <Tabs defaultValue="chart" className="w-full">
          <TabsList className="w-full mb-2 grid grid-cols-2">
            <TabsTrigger value="chart" className="text-xs">Distribution</TabsTrigger>
            <TabsTrigger value="details" className="text-xs">Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chart" className="h-40 sm:h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={isMobile ? { top: 0, right: 0, bottom: 0, left: 0 } : { top: 5, right: 30, bottom: 5, left: 5 }}>
                <Pie
                  data={item.data}
                  cx="50%"
                  cy="50%"
                  innerRadius={isMobile ? 30 : 50}
                  outerRadius={isMobile ? 45 : 75}
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
                  wrapperStyle={isMobile ? { fontSize: '10px', paddingBottom: '10px' } : { fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="details" className="overflow-x-auto">
            <div className="space-y-3 text-xs sm:text-sm">
              {/* Nutri-Score details if available */}
              {item.nutriScore && (
                <div className="mb-2">
                  <h4 className="font-medium mb-1">Nutri-Score: {item.nutriScore}</h4>
                  <p className="text-xs text-muted-foreground">
                    Our simple A to E rating for nutrition quality
                  </p>
                </div>
              )}
              
              {/* Detailed breakdown of macros */}
              <div>
                <h4 className="font-medium mb-2">Macronutrient Details</h4>
                <div className="w-full overflow-x-auto -mx-1 px-1">
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Nutrient</TableHead>
                        <TableHead>% of Total</TableHead>
                        <TableHead className="text-right">Calories</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="text-xs">
                      {item.data.map((macro) => (
                        <TableRow key={macro.name}>
                          <TableCell className="font-medium">{macro.name}</TableCell>
                          <TableCell>{macro.value}%</TableCell>
                          <TableCell className="text-right">{Math.round(macro.value * 20)} kcal</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              {/* Micronutrients if available */}
              {item.showMicronutrients && item.micronutrientsData && (
                <div className="mt-2">
                  <SimpleMicronutrientList micronutrientsData={item.micronutrientsData} />
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
