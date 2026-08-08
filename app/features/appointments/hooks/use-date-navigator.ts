import { addDays, startOfDay } from 'date-fns';

export interface UseDateNavigatorReturn {
  onNext: () => void;
  onPrevious: () => void;
  onToday: () => void;
}

export const useDateNavigator = (
  selectedDate: Date,
  setSelectedDate: (date: Date) => void,
  mode: 'day' | 'week' = 'day'
): UseDateNavigatorReturn => {
  const getStep = () => {
    return mode === 'week' ? 7 : 1;
  };

  const onNext = (): void => {
    setSelectedDate(addDays(selectedDate, getStep()));
  };

  const onPrevious = (): void => {
    setSelectedDate(addDays(selectedDate, -getStep()));
  };

  const onToday = (): void => {
    setSelectedDate(startOfDay(new Date()));
  };

  return {
    onNext,
    onPrevious,
    onToday,
  };
};
export { useDateNavigator as useDateNavigation };
