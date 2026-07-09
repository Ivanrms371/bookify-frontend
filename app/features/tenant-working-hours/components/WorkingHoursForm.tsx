import { DAYS_OF_WEEK } from '@/shared/constants/week-days';
import { WorkDaysSelector } from './WorkDaysSelector';
import { DayScheduleRow } from './DayScheduleRow';
import { useWorkingHours } from '../hooks/useWorkingHours';

interface Props {
  onSuccess?: () => void;
  children?: React.ReactNode;
  tenantId: string;
}

export const WorkingHoursForm = ({ onSuccess, children, tenantId }: Props) => {
  const {
    copyToAll,
    onToggleDay,
    onActivateDay,
    onDeactivateDay,
    onAddInterval,
    onRemoveInterval,
    onIntervalChange,
    weeklySchedule,
    onSubmit,
  } = useWorkingHours({
    onSuccessAction: onSuccess,
    tenantId,
  });

  return (
    <>
      <WorkDaysSelector onDayToggle={onToggleDay} weeklySchedule={weeklySchedule} />
      <form className="mt-6" onSubmit={onSubmit}>
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
        {children}
      </form>
    </>
  );
};
