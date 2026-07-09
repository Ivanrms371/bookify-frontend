import { twMerge } from 'tailwind-merge';
import { fieldErrorBorderClassName } from './field-error-styles';

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  hasError?: boolean;
};

export const Textarea = ({ className, hasError, ...props }: Props) => {
  return (
    <textarea
      {...props}
      className={twMerge(
        'h-28 resize-none rounded-xl border border-mist-200 bg-white px-4 py-3 text-sm font-medium outline-none transition-[border-color,box-shadow] duration-300 ease-out placeholder:text-mist-400 focus:border-mist-500 focus:ring-2 focus:ring-mist-200 dark:border-mist-800 dark:bg-mist-950 dark:focus:ring-mist-800',
        hasError && fieldErrorBorderClassName,
        className,
      )}
    />
  );
};
