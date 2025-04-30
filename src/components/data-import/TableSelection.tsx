
import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UsdaTableType } from '@/utils/usda-data-import';

interface TableSelectionProps {
  selectedTable: UsdaTableType;
  onSelectTable: (table: UsdaTableType) => void;
}

const TableSelection: React.FC<TableSelectionProps> = ({ selectedTable, onSelectTable }) => {
  return (
    <Tabs defaultValue={selectedTable} className="mb-6">
      <TabsList>
        <TabsTrigger 
          value={UsdaTableType.USDA_FOODS} 
          onClick={() => onSelectTable(UsdaTableType.USDA_FOODS)}
        >
          USDA Foods
        </TabsTrigger>
        <TabsTrigger 
          value={UsdaTableType.UNIT_CONVERSIONS} 
          onClick={() => onSelectTable(UsdaTableType.UNIT_CONVERSIONS)}
        >
          Unit Conversions
        </TabsTrigger>
        <TabsTrigger 
          value={UsdaTableType.YIELD_FACTORS} 
          onClick={() => onSelectTable(UsdaTableType.YIELD_FACTORS)}
        >
          Yield Factors
        </TabsTrigger>
      </TabsList>

      <TabsContent value={UsdaTableType.USDA_FOODS} className="mt-4">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-2">USDA Foods Table</h2>
          <p className="text-sm text-muted-foreground mb-2">
            Standard format required columns: food_code, food_name
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            SR28 format required columns: food_code, food_name, calories, protein_(g), fat_g
          </p>
          <p className="text-sm mb-4">
            This table stores nutritional information for various food items including calories,
            macronutrients, and micronutrients. Additional fields like cholesterol, portion weights
            (GmWt_1, GmWt_2) and descriptions (GmWt_Desc1, GmWt_Desc2) are also supported.
          </p>
        </Card>
      </TabsContent>

      <TabsContent value={UsdaTableType.UNIT_CONVERSIONS} className="mt-4">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-2">Unit Conversions Table</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Required columns: food_category, from_unit, to_unit, conversion_factor
          </p>
          <p className="text-sm mb-4">
            This table stores conversion factors between different units of measurement for
            various food categories.
          </p>
        </Card>
      </TabsContent>

      <TabsContent value={UsdaTableType.YIELD_FACTORS} className="mt-4">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-2">Yield Factors Table</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Required columns: food_category, cooking_method, yield_factor
          </p>
          <p className="text-sm mb-4">
            This table stores yield factors that account for weight changes during different
            cooking methods for various food categories.
          </p>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default TableSelection;
