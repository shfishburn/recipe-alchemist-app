
import React from 'react';
import { Globe, Scale, Zap, LineChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface GlobalAnalysisProps {
  globalAnalysis?: {
    cascade_effects?: string;
    energy_systems?: string;
    scaling_considerations?: string; 
    process_flow_optimization?: string;
    equipment_integration?: string;
  };
}

export function GlobalAnalysis({ globalAnalysis }: GlobalAnalysisProps) {
  if (!globalAnalysis) return null;

  // Check if we have any content to display
  const hasContent = globalAnalysis.cascade_effects || 
                    globalAnalysis.scaling_considerations || 
                    globalAnalysis.energy_systems || 
                    globalAnalysis.process_flow_optimization ||
                    globalAnalysis.equipment_integration;
                    
  if (!hasContent) return null;
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Globe className="h-5 w-5 text-recipe-blue" />
          Global Recipe Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {/* Cascade Effects */}
        {globalAnalysis.cascade_effects && (
          <div>
            <h3 className="text-sm font-medium text-slate-800 mb-1 flex items-center gap-1">
              <LineChart className="h-4 w-4 text-recipe-blue" />
              Step Interactions
            </h3>
            <p className="scientific-content text-sm">
              {globalAnalysis.cascade_effects}
            </p>
          </div>
        )}
        
        {/* Scaling Considerations */}
        {globalAnalysis.scaling_considerations && (
          <div>
            <h3 className="text-sm font-medium text-slate-800 mb-1 flex items-center gap-1">
              <Scale className="h-4 w-4 text-amber-600" />
              Scaling Considerations
            </h3>
            <p className="scientific-content text-sm">
              {globalAnalysis.scaling_considerations}
            </p>
          </div>
        )}
        
        {/* Energy Efficiency */}
        {globalAnalysis.energy_systems && (
          <div>
            <h3 className="text-sm font-medium text-slate-800 mb-1 flex items-center gap-1">
              <Zap className="h-4 w-4 text-green-600" />
              Energy Efficiency
            </h3>
            <p className="scientific-content text-sm">
              {globalAnalysis.energy_systems}
            </p>
          </div>
        )}
        
        {/* Process Optimization */}
        {globalAnalysis.process_flow_optimization && (
          <div>
            <h3 className="text-sm font-medium text-slate-800 mb-1">Process Optimization</h3>
            <p className="scientific-content text-sm">
              {globalAnalysis.process_flow_optimization}
            </p>
          </div>
        )}
        
        {/* Equipment Integration */}
        {globalAnalysis.equipment_integration && (
          <div>
            <h3 className="text-sm font-medium text-slate-800 mb-1">Equipment Guidance</h3>
            <p className="scientific-content text-sm">
              {globalAnalysis.equipment_integration}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
