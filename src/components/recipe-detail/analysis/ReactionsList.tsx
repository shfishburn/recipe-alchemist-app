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
          <p className="scientific-content mb-3">No reaction analysis data available for this recipe.</p>
          {onRegenerateClick && (
            <Button 
              onClick={onRegenerateClick}
              variant="outline"
              size="sm"
              className="mx-auto"
            >
              <RefreshCw className="h-4 w-4 mr-2" /> Generate Analysis
            </Button>
          )}
        </div>
      </div>
    );
  }
  
  // Check if all reactions are fallback data
  const allFallbackData = stepReactions.every(
    reaction => reaction.metadata?.generatedByFallback || 
                (reaction.reactions.length === 1 && reaction.reactions[0] === 'basic_cooking')
  );
  
  if (allFallbackData) {
    return (
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
          <Beaker className="h-5 w-5 mr-2 text-recipe-blue" />
          Step-by-Step Reaction Analysis
        </h3>
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 text-center">
          <p className="scientific-content mb-3">Automatic fallback analysis generated. For more detailed analysis, please try regenerating.</p>
          {onRegenerateClick && (
            <Button 
              onClick={onRegenerateClick}
              variant="outline"
              size="sm"
              className="mx-auto"
            >
              <RefreshCw className="h-4 w-4 mr-2" /> Regenerate Analysis
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
            <RefreshCw className="h-4 w-4 mr-1" /> Regenerate
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

  // Handle potential fallback data
  const isFallbackData = reaction.metadata?.generatedByFallback || 
                         (reaction.reactions.length === 1 && reaction.reactions[0] === 'basic_cooking');

  // Get reaction details
  const reactionDetails = Array.isArray(reaction.reaction_details) && reaction.reaction_details.length > 0 
    ? reaction.reaction_details[0] 
    : '';
  
  // Check if we have enhanced data
  const hasEnhancedData = !isFallbackData && (
    reaction.chemical_systems || 
    reaction.thermal_engineering || 
    reaction.process_parameters ||
    reaction.troubleshooting_matrix
  );
  
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
          
          {!isFallbackData && (
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
          )}
          
          {reactionDetails && !isFallbackData && (
            <p className="scientific-content mt-2">{reactionDetails}</p>
          )}
          
          {isFallbackData && (
            <p className="scientific-content italic mt-2">
              Automatic fallback analysis
            </p>
          )}
        </div>
      </div>
      
      {reaction.reactions && reaction.reactions.length > 0 && !isFallbackData && (
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
              {/* Enhanced data sections */}
              {reaction.chemical_systems && (
                <div>
                  <h4 className="font-medium text-slate-700">Chemical Systems</h4>
                  {reaction.chemical_systems.primary_reactions && (
                    <div>
                      <h5 className="font-medium text-slate-600">Primary Reactions</h5>
                      <ul className="list-disc list-inside">
                        {reaction.chemical_systems.primary_reactions.map((reaction, i) => (
                          <li key={`primary-${i}`} className="scientific-content">{reaction}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {reaction.chemical_systems.secondary_reactions && (
                    <div>
                      <h5 className="font-medium text-slate-600">Secondary Reactions</h5>
                      <ul className="list-disc list-inside">
                        {reaction.chemical_systems.secondary_reactions.map((reaction, i) => (
                          <li key={`secondary-${i}`} className="scientific-content">{reaction}</li>
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
                  {reaction.chemical_systems.critical_compounds && (
                    <div>
                      <h5 className="font-medium text-slate-600">Critical Compounds</h5>
                      <ul className="list-disc list-inside">
                        {reaction.chemical_systems.critical_compounds.map((compound, i) => (
                          <li key={`compound-${i}`} className="scientific-content">{compound}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {reaction.chemical_systems.ph_effects && (
                    <div>
                      <h5 className="font-medium text-slate-600">pH Effects</h5>
                      {reaction.chemical_systems.ph_effects.range && (
                        <p className="scientific-content">
                          <strong>Range:</strong> {reaction.chemical_systems.ph_effects.range}
                        </p>
                      )}
                      {reaction.chemical_systems.ph_effects.impact && (
                        <p className="scientific-content">
                          <strong>Impact:</strong> {reaction.chemical_systems.ph_effects.impact}
                        </p>
                      )}
                    </div>
                  )}
                  {reaction.chemical_systems.water_activity && (
                    <div>
                      <h5 className="font-medium text-slate-600">Water Activity</h5>
                      {reaction.chemical_systems.water_activity.value !== undefined && (
                        <p className="scientific-content">
                          <strong>Value:</strong> {reaction.chemical_systems.water_activity.value}
                        </p>
                      )}
                      {reaction.chemical_systems.water_activity.significance && (
                        <p className="scientific-content">
                          <strong>Significance:</strong> {reaction.chemical_systems.water_activity.significance}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {reaction.thermal_engineering && (
                <div>
                  <h4 className="font-medium text-slate-700">Thermal Engineering</h4>
                  {reaction.thermal_engineering.heat_transfer_mode && (
                    <p className="scientific-content">
                      <strong>Heat Transfer Mode:</strong> {reaction.thermal_engineering.heat_transfer_mode}
                    </p>
                  )}
                  {reaction.thermal_engineering.thermal_gradient && (
                    <p className="scientific-content">
                      <strong>Thermal Gradient:</strong> {reaction.thermal_engineering.thermal_gradient}
                    </p>
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
                  {reaction.thermal_engineering.heat_capacity_considerations && (
                    <p className="scientific-content">
                      <strong>Heat Capacity Considerations:</strong> {reaction.thermal_engineering.heat_capacity_considerations}
                    </p>
                  )}
                </div>
              )}
              
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
                  {reaction.process_parameters.tolerance_windows && (
                    <div>
                      <h5 className="font-medium text-slate-600">Tolerance Windows</h5>
                      {reaction.process_parameters.tolerance_windows.temperature && (
                        <p className="scientific-content">
                          <strong>Temperature:</strong> {reaction.process_parameters.tolerance_windows.temperature}
                        </p>
                      )}
                      {reaction.process_parameters.tolerance_windows.time && (
                        <p className="scientific-content">
                          <strong>Time:</strong> {reaction.process_parameters.tolerance_windows.time}
                        </p>
                      )}
                      {reaction.process_parameters.tolerance_windows.humidity && (
                        <p className="scientific-content">
                          <strong>Humidity:</strong> {reaction.process_parameters.tolerance_windows.humidity}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {reaction.troubleshooting_matrix && reaction.troubleshooting_matrix.length > 0 && (
                <div>
                  <h4 className="font-medium text-slate-700">Troubleshooting Matrix</h4>
                  {reaction.troubleshooting_matrix.map((issue, i) => (
                    <div key={`issue-${i}`} className="mb-3">
                      <h5 className="font-medium text-slate-600">Problem: {issue.problem || 'N/A'}</h5>
                      {issue.diagnostic_tests && (
                        <div>
                          <h6 className="font-medium text-slate-500">Diagnostic Tests</h6>
                          <ul className="list-disc list-inside">
                            {issue.diagnostic_tests.map((test, j) => (
                              <li key={`test-${j}`} className="scientific-content">{test}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {issue.corrections && (
                        <div>
                          <h6 className="font-medium text-slate-500">Corrections</h6>
                          <ul className="list-disc list-inside">
                            {issue.corrections.map((correction, k) => (
                              <li key={`correction-${k}`} className="scientific-content">{correction}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {issue.prevention && (
                        <div>
                          <h6 className="font-medium text-slate-500">Prevention</h6>
                          <ul className="list-disc list-inside">
                            {issue.prevention.map((prevention, l) => (
                              <li key={`prevention-${l}`} className="scientific-content">{prevention}</li>
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
