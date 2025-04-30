
import React from 'react';
import { format, addDays } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { generateMATADORSchedule } from '@/utils/body-composition';

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
  const scheduleDays = 90; // Show next 90 days
  const startDate = phaseStartDate ? new Date(phaseStartDate) : new Date();
  
  const schedule = React.useMemo(() => {
    return generateMATADORSchedule(scheduleDays, {
      dietPhaseLength,
      breakPhaseLength,
      startWithDiet: currentPhase === 'diet'
    });
  }, [dietPhaseLength, breakPhaseLength, currentPhase, scheduleDays]);

  const groupedSchedule = React.useMemo(() => {
    const groupedByWeek: Record<number, typeof schedule> = {};
    
    schedule.forEach(day => {
      if (!groupedByWeek[day.weekNumber]) {
        groupedByWeek[day.weekNumber] = [];
      }
      groupedByWeek[day.weekNumber].push(day);
    });
    
    return Object.values(groupedByWeek);
  }, [schedule]);

  return (
    <div className="space-y-4">
      <h3 className="font-medium">MATADOR Protocol Schedule</h3>
      
      <div className="overflow-auto">
        <div className="min-w-max">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>
          
          {groupedSchedule.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-1 mb-1">
              {week.map(day => {
                const date = addDays(startDate, day.day);
                const isToday = format(new Date(), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
                
                return (
                  <div 
                    key={day.day} 
                    className={`
                      p-1 text-center rounded-md text-xs
                      ${day.isDeficitDay ? 'bg-orange-100 border border-orange-200' : 'bg-green-100 border border-green-200'}
                      ${isToday ? 'ring-2 ring-blue-500' : ''}
                    `}
                  >
                    <div className="font-medium">{format(date, 'd')}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {day.isDeficitDay ? 'Deficit' : 'Maintenance'}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-orange-100 border border-orange-200"></div>
          <span>Deficit Phase</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-green-100 border border-green-200"></div>
          <span>Maintenance Phase</span>
        </div>
      </div>
      
      <Card className="bg-blue-50">
        <CardContent className="p-4 text-sm">
          <p className="font-medium mb-2">Upcoming Schedule</p>
          <div className="space-y-1">
            {schedule.slice(0, 5).map((day, index) => {
              if (index === 0 || day.phaseType !== schedule[index - 1].phaseType) {
                const date = addDays(startDate, day.day);
                return (
                  <div key={day.day} className="flex justify-between">
                    <span>
                      {day.phaseType === 'deficit' ? '🔻 Deficit phase' : '🟢 Maintenance phase'} starts
                    </span>
                    <span className="font-medium">{format(date, 'MMM d')}</span>
                  </div>
                );
              }
              return null;
            }).filter(Boolean)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
