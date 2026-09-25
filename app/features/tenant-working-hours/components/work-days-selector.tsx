import { Heading, Text } from '@/shared/components/typography';
import { DAY_LABELS, DAYS_OF_WEEK, type DayOfWeek, type WeeklySchedule } from '@/shared/constants/week-days';
import { cn } from '@/shared/utils/cn';

interface Props {
  onDayToggle: (day: DayOfWeek) => void;
  weeklySchedule: WeeklySchedule;
}

export const WorkDaysSelector = ({ onDayToggle, weeklySchedule }: Props) => {
  return (
    <div className="my-6">
      <Text className="text-gray-800 mb-2">Días de atención</Text>

      <div className="mt-2 flex gap-2">
        {DAYS_OF_WEEK.map((day) => (
          <button
            type="button"
            key={day}
            className={cn(
              'w-11 h-10 cursor-pointer rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-100/50 ',
              weeklySchedule[day].isActive && 'bg-indigo-500 text-gray-50 hover:bg-indigo-600 dark:bg-indigo-600',
            )}
            onClick={() => onDayToggle(day)}
          >
            {DAY_LABELS[day].short}
          </button>
        ))}
      </div>
    </div>
  );
};
