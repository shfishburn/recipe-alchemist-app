
import React, { useState } from 'react';
import { formatReactionName } from '@/hooks/use-recipe-science';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Filter, Beaker, RefreshCw } from 'lucide-react';
import type { StepReaction } from '@/hooks/use-recipe-science';

interface ReactionsListProps {
  stepReactions: StepReaction[];
  onRegenerateClick?: () => void;
}

export function ReactionsList({ stepReactions, onRegenerateClick }: ReactionsListProps) {
  const [filter, setFilter] = useState<string | null>(null);
  
  // Early return if no reactions
  if (!stepReactions || stepReactions.length === 0) {
    return (
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
          <Beaker className="h-5 w-5 mr-2 text-recipe-blue" />
          Step-by-Step Reaction Analysis
        </h3>
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 text-center">
          <p className="scientific-content mb-3">Analysis data is being generated...</p>
          {onRegenerateClick && (
            <Button 
              onClick={onRegenerateClick}
              variant="outline"
              size="sm"
              className="mx-auto"
            >
              <RefreshCw className="h-4 w-4 mr-2" /> Refresh Analysis
            </Button>
          )}
        </div>
      </div>
    );
  }
  
  // Extract unique reaction types across all steps
  const allReactionTypes = new Set<string>();
  stepReactions.forEach(reaction => {
    if (Array.isArray(reaction.reactions)) {
      reaction.reactions.forEach(r => {
        if (r !== 'basic_cooking' && r !== 'unknown') {
          allReactionTypes.add(r);
        }
      });
    }
  });
  
  // Filter steps if a filter is active
  const filteredReactions = filter 
    ? stepReactions.filter(reaction => 
        Array.isArray(reaction.reactions) && reaction.reactions.includes(filter)
      ) 
    : stepReactions;
  
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
        <Beaker className="h-5 w-5 mr-2 text-recipe-blue" />
        Step-by-Step Reaction Analysis
        {onRegenerateClick && (
          <Button 
            onClick={onRegenerateClick}
            variant="ghost"
            size="sm"
            className="ml-auto"
          >
            <RefreshCw className="h-4 w-4 mr-1" /> Refresh
          </Button>
        )}
      </h3>
      
      {/* Filter by reaction type */}
      {allReactionTypes.size > 0 && (
        <div className="mb-4">
          <div className="flex items-center text-sm text-slate-600 mb-2">
            <Filter className="h-4 w-4 mr-1" />
            <span>Filter by reaction type:</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {Array.from(allReactionTypes).map(type => (
              <Button
                key={type}
                variant={filter === type ? "default" : "outline"}
                size="sm"
                className={filter === type ? "bg-recipe-blue text-white" : "text-slate-700"}
                onClick={() => setFilter(filter === type ? null : type)}
              >
                {formatReactionName(type)}
              </Button>
            ))}
            
            {filter && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilter(null)}
              >
                Clear filter
              </Button>
            )}
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        {filteredReactions.map((reaction, index) => (
          <StepReactionItem 
            key={`reaction-${reaction.step_index}`}
            reaction={reaction}
            index={reaction.step_index}
          />
        ))}
        
        {filter && filteredReactions.length === 0 && (
          <p className="scientific-content italic">
            No steps found with the selected reaction type.
          </p>
        )}
      </div>
    </div>
  );
}

function StepReactionItem({ reaction, index }: { reaction: StepReaction, index: number }) {
  const [expanded, setExpanded] = useState<boolean>(false);
  
  // Skip steps with no text
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
          <p className="font-semibold text-slate-800">Step {index + 1}: {reaction.step_text}</p>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {cookingMethod && (
              <span className="text-xs px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full">
                {cookingMethod.charAt(0).toUpperCase() + cookingMethod.slice(1)}
              </span>
            )}
            
            {temperatureC && (
              <span className="text-xs px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full flex items-center gap-1">
                {temperatureC}°C / {temperatureF}°F
              </span>
            )}
            
            {duration && (
              <span className="text-xs px-2.5 py-1 bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                {duration} min
              </span>
            )}
          </div>
          
          {reactionDetails && (
            <p className="scientific-content mt-2">{reactionDetails}</p>
          )}
        </div>
      </div>
      
      {reaction.reactions && reaction.reactions.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-blue-200">
          {reaction.reactions
            .filter(type => type !== 'basic_cooking' && type !== 'unknown')
            .map((type, i) => (
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
                  <h4 className="font-medium text-slate-700">Chemical Systems</h4>
                  {reaction.chemical_systems.primary_reactions && reaction.chemical_systems.primary_reactions.length > 0 && (
                    <div>
                      <h5 className="font-medium text-slate-600">Primary Reactions</h5>
                      <ul className="list-disc list-inside">
                        {reaction.chemical_systems.primary_reactions.map((r, i) => (
                          <li key={`primary-${i}`} className="scientific-content">{formatReactionName(r)}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {reaction.chemical_systems.secondary_reactions && reaction.chemical_systems.secondary_reactions.length > 0 && (
                    <div>
                      <h5 className="font-medium text-slate-600">Secondary Reactions</h5>
                      <ul className="list-disc list-inside">
                        {reaction.chemical_systems.secondary_reactions.map((r, i) => (
                          <li key={`secondary-${i}`} className="scientific-content">{formatReactionName(r)}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {reaction.chemical_systems.reaction_mechanisms && (
                    <div>
                      <h5 className="font-medium text-slate-600">Reaction Mechanisms</h5>
                      <p className="scientific-content">{reaction.chemical_systems.reaction_mechanisms}</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Thermal Engineering Section */}
              {reaction.thermal_engineering && (
                <div>
                  <h4 className="font-medium text-slate-700">Thermal Properties</h4>
                  
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
                  
                  {reaction.thermal_engineering.temperature_profile && (
                    <div>
                      <h5 className="font-medium text-slate-600">Temperature Profile</h5>
                      {reaction.thermal_engineering.temperature_profile.surface !== undefined && (
                        <p className="scientific-content">
                          <strong>Surface:</strong> {reaction.thermal_engineering.temperature_profile.surface}
                          {reaction.thermal_engineering.temperature_profile.unit || '°C'}
                        </p>
                      )}
                      {reaction.thermal_engineering.temperature_profile.core !== undefined && (
                        <p className="scientific-content">
                          <strong>Core:</strong> {reaction.thermal_engineering.temperature_profile.core}
                          {reaction.thermal_engineering.temperature_profile.unit || '°C'}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {/* Process Parameters Section */}
              {reaction.process_parameters && (
                <div>
                  <h4 className="font-medium text-slate-700">Process Parameters</h4>
                  {reaction.process_parameters.critical_times && (
                    <div>
                      <h5 className="font-medium text-slate-600">Critical Times</h5>
                      {reaction.process_parameters.critical_times.minimum !== undefined && (
                        <p className="scientific-content">
                          <strong>Minimum:</strong> {reaction.process_parameters.critical_times.minimum}
                          {reaction.process_parameters.critical_times.unit || ' minutes'}
                        </p>
                      )}
                      {reaction.process_parameters.critical_times.optimal !== undefined && (
                        <p className="scientific-content">
                          <strong>Optimal:</strong> {reaction.process_parameters.critical_times.optimal}
                          {reaction.process_parameters.critical_times.unit || ' minutes'}
                        </p>
                      )}
                      {reaction.process_parameters.critical_times.maximum !== undefined && (
                        <p className="scientific-content">
                          <strong>Maximum:</strong> {reaction.process_parameters.critical_times.maximum}
                          {reaction.process_parameters.critical_times.unit || ' minutes'}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {/* Troubleshooting Matrix */}
              {reaction.troubleshooting_matrix && reaction.troubleshooting_matrix.length > 0 && (
                <div>
                  <h4 className="font-medium text-slate-700">Troubleshooting</h4>
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
            </div>
          )}
        </>
      )}
    </div>
  );
}
