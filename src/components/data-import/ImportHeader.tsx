
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';
import { Info, Database } from 'lucide-react';

const ImportHeader: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>USDA Data Import | NutriSynth</title>
      </Helmet>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">USDA Data Import</h1>
        <p className="text-muted-foreground mb-6">
          Import USDA FoodData Central data to enhance nutrition analysis
        </p>

        <Card className="bg-muted/40 mb-6">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Info className="h-6 w-6 text-blue-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">About USDA Data Integration</h3>
                <p className="mb-3">
                  Enhance the app's nutrition analysis by importing official USDA FoodData Central data. 
                  This data integration enables:
                </p>
                <ul className="list-disc pl-5 space-y-1 mb-3">
                  <li>More accurate ingredient matching from recipe descriptions</li>
                  <li>Precise household unit conversions (cups, tablespoons, etc. to grams)</li>
                  <li>Cooking yield adjustments based on different preparation methods</li>
                </ul>
                <p className="text-sm text-muted-foreground">
                  <Database className="inline h-4 w-4 mr-1" />
                  Download data files from the <a href="https://fdc.nal.usda.gov/download-datasets.html" target="_blank" rel="noopener noreferrer" className="text-primary underline">USDA FoodData Central</a> website.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ImportHeader;
