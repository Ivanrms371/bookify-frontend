import { DAYS_OF_WEEK } from '@/shared/constants/week-days';
import { DayScheduleRow } from './day-schedule-row';
import { useWorkingHoursForm } from '../hooks/use-working-hours-form';

interface Props {
  onSuccess?: () => void;
  children?: React.ReactNode;
  tenantId: string;
}

export const WorkingHoursForm = ({ onSuccess, children, tenantId }: Props) => {
  const { copyToAll, onActivateDay, onDeactivateDay, onAddInterval, onRemoveInterval, onIntervalChange, weeklySchedule } =
    useWorkingHoursForm();

  return (
    <>
      <div className="@container overflow-y-auto pl-0.5 pr-2 space-y-5 overflow-x-hidden custom-scrollbar">
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
