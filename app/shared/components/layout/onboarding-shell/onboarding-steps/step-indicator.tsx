import { cn } from '@/shared/utils/cn';

interface Props {
  state: 'completed' | 'active' | 'pending';
}

export const StepIndicator = ({ state }: Props) => {
  if (state === 'completed') {
    return (
      <span className={cn('relative z-10 flex shrink-0 items-center justify-center rounded-full bg-indigo-500 size-6')}>
        <span className="size-2 rounded-full bg-white" />
      </span>
    );
  }

  if (state === 'active') {
    return (
      <span
        className={cn(
          'relative z-10 flex shrink-0 items-center justify-center rounded-full border border-indigo-500 bg-white ring-2 ring-indigo-200 size-6',
        )}
      >
        <span className="size-2 rounded-full bg-indigo-500" />
      </span>
    );
  }

  return (
    <span className={cn('relative z-10 flex shrink-0 items-center justify-center rounded-full bg-white ring-2 ring-mist-200 size-6')}>
      <span className="size-2 rounded-full bg-mist-200" />
    </span>
  );
};
