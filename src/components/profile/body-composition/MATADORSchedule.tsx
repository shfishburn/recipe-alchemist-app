
import React from 'react';
import { addDays, format, differenceInDays } from 'date-fns';

interface MATADORScheduleProps {
  dietPhaseLength: number;
  breakPhaseLength: number;
  currentPhase: 'diet' | 'break';
  phaseStartDate: string;
}

export function MATADORSchedule({ 
  dietPhaseLength, 
  breakPhaseLength, 
  currentPhase,
  phaseStartDate 
}: MATADORScheduleProps) {
  const today = new Date();
  const startDate = new Date(phaseStartDate);
  
  const generateSchedule = () => {
    const schedule = [];
    let phaseStart = new Date(startDate);
    let currentPhaseName = currentPhase;
    let phaseIndex = 0;
    
    // Generate 6 phases
    for (let i = 0; i < 6; i++) {
      const isCurrentPhase = i === 0;
      const phaseDuration = currentPhaseName === 'diet' ? dietPhaseLength : breakPhaseLength;
      const phaseEnd = addDays(phaseStart, phaseDuration - 1);
      const isActive = today >= phaseStart && today <= phaseEnd;
      
      schedule.push({
        id: phaseIndex++,
        type: currentPhaseName,
        startDate: phaseStart,
        endDate: phaseEnd,
        isActive,
      });
      
      // Set up for next phase
      currentPhaseName = currentPhaseName === 'diet' ? 'break' : 'diet';
      phaseStart = addDays(phaseEnd, 1);
    }
    
    return schedule;
  };

  const schedule = generateSchedule();
  const currentScheduleItem = schedule.find(item => item.isActive);
  const daysRemaining = currentScheduleItem 
    ? differenceInDays(currentScheduleItem.endDate, today)
    : 0;
  
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-md">
        <h3 className="font-medium mb-2">Current MATADOR Schedule</h3>
        
        {currentScheduleItem ? (
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium">
                {currentScheduleItem.type === 'diet' ? '🍎 Diet Phase' : '🍔 Break Phase'}
              </p>
              <p className="text-xs text-muted-foreground">
                {format(currentScheduleItem.startDate, 'MMM d')} - {format(currentScheduleItem.endDate, 'MMM d, yyyy')}
              </p>
            </div>
            
            <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`absolute top-0 left-0 h-full ${currentScheduleItem.type === 'diet' ? 'bg-blue-500' : 'bg-green-500'}`}
                style={{ width: `${100 - (daysRemaining * 100 / (currentScheduleItem.type === 'diet' ? dietPhaseLength : breakPhaseLength))}%` }}
              ></div>
            </div>
            
            <p className="text-xs text-center font-medium">
              {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining in current phase
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No active phase found. The schedule may need to be updated.
          </p>
        )}
      </div>
      
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Upcoming Schedule</h4>
        <div className="space-y-2">
          {schedule.slice(0, 4).map((phase) => (
            <div 
              key={phase.id} 
              className={`p-2 rounded-md border text-xs ${
                phase.isActive 
                  ? phase.type === 'diet' 
                    ? 'bg-blue-50 border-blue-200' 
                    : 'bg-green-50 border-green-200'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium">
                    {phase.type === 'diet' ? '🍎 Diet Phase' : '🍔 Break Phase'}
                    {phase.isActive ? ' (Current)' : ''}
                  </span>
                </div>
                <div className="text-muted-foreground">
                  {format(phase.startDate, 'MMM d')} - {format(phase.endDate, 'MMM d')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
