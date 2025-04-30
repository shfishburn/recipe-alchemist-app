
import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UsdaTableType } from '@/utils/usda-data-import';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from 'lucide-react';

interface TableSelectionProps {
  selectedTable: UsdaTableType;
  onSelectTable: (table: UsdaTableType) => void;
}

const TableSelection: React.FC<TableSelectionProps> = ({ selectedTable, onSelectTable }) => {
  return (
    <Tabs defaultValue={selectedTable} className="mb-6">
      <TabsList className="mb-2">
        <TabsTrigger 
          value="standard"
          onClick={() => {}}
          className="font-semibold"
        >
          Standard Tables
        </TabsTrigger>
        <TabsTrigger 
          value="usda_raw"
          onClick={() => {}}
          className="font-semibold"
        >
          USDA Raw
        </TabsTrigger>
      </TabsList>

      <TabsContent value="standard">
        <Tabs defaultValue={selectedTable} className="mt-2">
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
              <p className="text-sm mb-2">
                This table stores nutritional information for various food items including calories,
                macronutrients, and micronutrients. Additional fields like cholesterol, portion weights
                (GmWt_1, GmWt_2) and descriptions (GmWt_Desc1, GmWt_Desc2) are also supported.
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Note: If food_category is not provided, it will be automatically derived from food_name.
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
      </TabsContent>

      <TabsContent value="usda_raw">
        <Tabs defaultValue={selectedTable} className="mt-2">
          <TabsList>
            <TabsTrigger 
              value={UsdaTableType.RAW_FOOD} 
              onClick={() => onSelectTable(UsdaTableType.RAW_FOOD)}
            >
              Food
            </TabsTrigger>
            <TabsTrigger 
              value={UsdaTableType.RAW_MEASURE_UNIT} 
              onClick={() => onSelectTable(UsdaTableType.RAW_MEASURE_UNIT)}
            >
              Measure Unit
            </TabsTrigger>
            <TabsTrigger 
              value={UsdaTableType.RAW_FOOD_PORTIONS} 
              onClick={() => onSelectTable(UsdaTableType.RAW_FOOD_PORTIONS)}
            >
              Food Portions
            </TabsTrigger>
            <TabsTrigger 
              value={UsdaTableType.RAW_YIELD_FACTORS} 
              onClick={() => onSelectTable(UsdaTableType.RAW_YIELD_FACTORS)}
            >
              Yield Factors
            </TabsTrigger>
          </TabsList>

          <Alert className="mt-4">
            <Info className="h-4 w-4" />
            <AlertTitle>USDA Raw Data Import</AlertTitle>
            <AlertDescription>
              These tables are for importing raw USDA data directly from the FoodData Central CSV files.
              The system will detect and map standard USDA files automatically.
            </AlertDescription>
          </Alert>

          <TabsContent value={UsdaTableType.RAW_FOOD} className="mt-4">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-2">USDA Raw Food Table</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Required columns: fdc_id, description
              </p>
              <p className="text-sm mb-4">
                This table stores the raw food descriptions from the USDA Food.csv file.
                Import this file first before importing other related files.
              </p>
            </Card>
          </TabsContent>

          <TabsContent value={UsdaTableType.RAW_MEASURE_UNIT} className="mt-4">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-2">USDA Measure Unit Table</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Required columns: id, name
              </p>
              <p className="text-sm mb-4">
                This table stores measurement unit information from the USDA MeasureUnit.csv file.
              </p>
            </Card>
          </TabsContent>

          <TabsContent value={UsdaTableType.RAW_FOOD_PORTIONS} className="mt-4">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-2">USDA Food Portions Table</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Required columns: id, fdc_id, measure_unit_id, gram_weight
              </p>
              <p className="text-sm mb-4">
                This table stores portion information from the USDA FoodPortions.csv file,
                which maps foods to their weights in various measurement units.
              </p>
              <Alert className="mt-2">
                <Info className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  Before importing this file, make sure you've already imported Food.csv and MeasureUnit.csv
                  as this file has foreign key references to them.
                </AlertDescription>
              </Alert>
            </Card>
          </TabsContent>

          <TabsContent value={UsdaTableType.RAW_YIELD_FACTORS} className="mt-4">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-2">USDA Yield Factors Table</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Required columns: food_category, ingredient, cooking_method, yield_factor
              </p>
              <p className="text-sm mb-4">
                This table stores cooking yield factors from USDA handbook sources,
                accounting for weight changes of foods during different cooking methods.
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </TabsContent>
    </Tabs>
  );
};

export default TableSelection;
