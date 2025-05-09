
import React, { useState } from 'react';
import { formatReactionName } from '@/hooks/use-recipe-science';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Thermometer, Timer } from 'lucide-react';
import type { StepReaction } from '@/hooks/use-recipe-science';

interface StepReactionItemProps {
  reaction: StepReaction;
  index: number;
}

export function StepReactionItem({ reaction, index }: StepReactionItemProps) {
  const [expanded, setExpanded] = useState<boolean>(false);
  
  if (!reaction.step_text) return null;

  // Get reaction details
  const reactionDetails = Array.isArray(reaction.reaction_details) && reaction.reaction_details.length > 0 
    ? reaction.reaction_details[0] 
    : '';
  
  // Check if we have enhanced data
  const hasEnhancedData = reaction.chemical_systems || 
                          reaction.thermal_engineering || 
                          reaction.process_parameters ||
                          reaction.troubleshooting_matrix;
  
  // Temperature data from either enhanced or legacy format
  const temperatureC = reaction.temperature_celsius || 
    (reaction.thermal_engineering?.temperature_profile?.core ||
     reaction.thermal_engineering?.temperature_profile?.surface);
  
  const temperatureF = temperatureC ? Math.round(temperatureC * 9/5 + 32) : undefined;
  
  // Duration data
  const duration = reaction.duration_minutes || 
    (reaction.process_parameters?.critical_times?.optimal);
  
  // Cooking method with fallback
  const cookingMethod = reaction.cooking_method || 
    reaction.thermal_engineering?.heat_transfer_mode || '';
    
  return (
    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 shadow-sm">
      <div className="flex items-start gap-3 mb-2">
        <div className="flex-1">
          {/* Updated styling as requested */}
          <p className="mt-1 font-bold text-slate-800">Step {index + 1}: {reaction.step_text}</p>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {cookingMethod && (
              <span className="text-xs px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full">
                {cookingMethod.charAt(0).toUpperCase() + cookingMethod.slice(1)}
              </span>
            )}
            
            {temperatureC && (
              <span className="text-xs px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full flex items-center gap-1">
                <Thermometer className="h-3 w-3" />
                {temperatureC}°C / {temperatureF}°F
              </span>
            )}
            
            {duration && (
              <span className="text-xs px-2.5 py-1 bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                <Timer className="h-3 w-3" />
                {duration} min
              </span>
            )}
          </div>
          
          {reactionDetails && (
            <p className="text-sm text-slate-600 mt-2">{reactionDetails}</p>
          )}
        </div>
      </div>
      
      {reaction.reactions.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-blue-200">
          {reaction.reactions.map((type, i) => (
            <span 
              key={`${index}-${i}`} 
              className="text-xs px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full"
            >
              {formatReactionName(type)}
            </span>
          ))}
        </div>
      )}
      
      {hasEnhancedData && (
        <>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setExpanded(!expanded)}
            className="mt-3 text-blue-600 hover:text-blue-800 p-0 h-auto"
          >
            {expanded ? (
              <><ChevronUp className="h-4 w-4 mr-1" /> Hide Scientific Details</>
            ) : (
              <><ChevronDown className="h-4 w-4 mr-1" /> View Scientific Details</>
            )}
          </Button>
          
          {expanded && (
            <div className="mt-3 pt-3 border-t border-blue-200 text-sm space-y-4">
              {/* Chemical Systems Section */}
              {reaction.chemical_systems && (
                <div>
                  <h4 className="font-medium text-slate-800 mb-1">Chemical Systems</h4>
                  
                  {reaction.chemical_systems.primary_reactions && reaction.chemical_systems.primary_reactions.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs text-slate-500">Primary Reactions:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {reaction.chemical_systems.primary_reactions.map((r, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded">
                            {formatReactionName(r)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {reaction.chemical_systems.reaction_mechanisms && (
                    <div className="mb-2">
                      <p className="text-xs text-slate-500">Reaction Mechanism:</p>
                      <p className="text-xs text-slate-700">{reaction.chemical_systems.reaction_mechanisms}</p>
                    </div>
                  )}
                  
                  {reaction.chemical_systems.ph_effects?.impact && (
                    <div className="mb-2">
                      <p className="text-xs text-slate-500">pH Impact:</p>
                      <p className="text-xs text-slate-700">
                        {reaction.chemical_systems.ph_effects.range && `Range: ${reaction.chemical_systems.ph_effects.range}. `}
                        {reaction.chemical_systems.ph_effects.impact}
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Thermal Engineering Section */}
              {reaction.thermal_engineering && (
                <div>
                  <h4 className="font-medium text-slate-800 mb-1">Thermal Properties</h4>
                  
                  {reaction.thermal_engineering.heat_transfer_mode && (
                    <div className="mb-2">
                      <p className="text-xs text-slate-500">Heat Transfer Mode:</p>
                      <p className="text-xs text-slate-700">{reaction.thermal_engineering.heat_transfer_mode}</p>
                    </div>
                  )}
                  
                  {reaction.thermal_engineering.thermal_gradient && (
                    <div className="mb-2">
                      <p className="text-xs text-slate-500">Thermal Gradient:</p>
                      <p className="text-xs text-slate-700">{reaction.thermal_engineering.thermal_gradient}</p>
                    </div>
                  )}
                  
                  {reaction.thermal_engineering.heat_capacity_considerations && (
                    <div className="mb-2">
                      <p className="text-xs text-slate-500">Heat Capacity Considerations:</p>
                      <p className="text-xs text-slate-700">{reaction.thermal_engineering.heat_capacity_considerations}</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Process Parameters Section */}
              {reaction.process_parameters && (
                <div>
                  <h4 className="font-medium text-slate-800 mb-1">Process Parameters</h4>
                  
                  {reaction.process_parameters.critical_times && (
                    <div className="mb-2">
                      <p className="text-xs text-slate-500">Critical Times:</p>
                      <p className="text-xs text-slate-700">
                        {reaction.process_parameters.critical_times.minimum && `Min: ${reaction.process_parameters.critical_times.minimum} ${reaction.process_parameters.critical_times.unit || 'min'}, `}
                        {reaction.process_parameters.critical_times.optimal && `Optimal: ${reaction.process_parameters.critical_times.optimal} ${reaction.process_parameters.critical_times.unit || 'min'}, `}
                        {reaction.process_parameters.critical_times.maximum && `Max: ${reaction.process_parameters.critical_times.maximum} ${reaction.process_parameters.critical_times.unit || 'min'}`}
                      </p>
                    </div>
                  )}
                  
                  {reaction.process_parameters.tolerance_windows && (
                    <div className="mb-2">
                      <p className="text-xs text-slate-500">Tolerances:</p>
                      <p className="text-xs text-slate-700">
                        {reaction.process_parameters.tolerance_windows.temperature && `Temp: ${reaction.process_parameters.tolerance_windows.temperature}, `}
                        {reaction.process_parameters.tolerance_windows.time && `Time: ${reaction.process_parameters.tolerance_windows.time}, `}
                        {reaction.process_parameters.tolerance_windows.humidity && `Humidity: ${reaction.process_parameters.tolerance_windows.humidity}`}
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Troubleshooting Matrix */}
              {reaction.troubleshooting_matrix && reaction.troubleshooting_matrix.length > 0 && (
                <div>
                  <h4 className="font-medium text-slate-800 mb-1">Troubleshooting</h4>
                  
                  {reaction.troubleshooting_matrix.map((issue, i) => (
                    <div key={i} className="mb-2 p-2 bg-blue-100/50 rounded">
                      {issue.problem && (
                        <p className="text-xs font-medium text-slate-700">{formatReactionName(issue.problem)}</p>
                      )}
                      
                      {issue.corrections && issue.corrections.length > 0 && (
                        <div className="mt-1">
                          <p className="text-xs text-slate-500">Solutions:</p>
                          <ul className="text-xs text-slate-700 list-disc pl-4">
                            {issue.corrections.map((correction, j) => (
                              <li key={j}>{correction}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Safety Protocols */}
              {reaction.safety_protocols && (
                <div>
                  <h4 className="font-medium text-slate-800 mb-1">Safety Notes</h4>
                  
                  {reaction.safety_protocols.critical_limits && (
                    <div className="mb-2">
                      <p className="text-xs text-slate-500">Critical Limits:</p>
                      <p className="text-xs text-slate-700">{reaction.safety_protocols.critical_limits}</p>
                    </div>
                  )}
                  
                  {reaction.safety_protocols.allergen_concerns && (
                    <div className="mb-2">
                      <p className="text-xs text-slate-500">Allergen Concerns:</p>
                      <p className="text-xs text-slate-700">{reaction.safety_protocols.allergen_concerns}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
