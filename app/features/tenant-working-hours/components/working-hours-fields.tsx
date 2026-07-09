import { DAYS_OF_WEEK } from '@/shared/constants/week-days';
import { WorkDaysSelector } from './work-days-selector';
import { DayScheduleRow } from './day-schedule-row';
import { useWorkingHours } from '../hooks/use-working-hours';
import { BackButton, NextButton, StepNavigation } from '@/features/onboarding/components/step-navigation';

interface Props {
  useWorkingHours: ReturnType<typeof useWorkingHours>;
}

export const WorkingHoursFields = ({ useWorkingHours }: Props) => {
  const { copyToAll, onToggleDay, onActivateDay, onDeactivateDay, onAddInterval, onRemoveInterval, onIntervalChange, weeklySchedule } =
    useWorkingHours;

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(weeklySchedule);
  };

  return (
    <>
      <WorkDaysSelector onDayToggle={onToggleDay} weeklySchedule={weeklySchedule} />
      <div className="overflow-y-auto pl-0.5 pr-2 space-y-2 overflow-x-hidden custom-scrollbar">
        {DAYS_OF_WEEK.map((day) => {
          const schedule = weeklySchedule[day];

          return (
            <DayScheduleRow
              key={day}
              day={day}
              onActivateDay={onActivateDay}
              onDeactivateDay={onDeactivateDay}
              isActive={schedule.isActive}
              intervals={schedule.intervals}
              onCopyToAll={copyToAll}
              onAddInterval={onAddInterval}
              onRemoveInterval={onRemoveInterval}
              onIntervalChange={onIntervalChange}
            />
          );
        })}
      </div>
    </>
  );
};
