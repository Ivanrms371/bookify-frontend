import { twMerge } from 'tailwind-merge';
import { fieldErrorBorderClassName } from './field-error-styles';

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  hasError?: boolean;
};

export const Textarea = ({ className, hasError, ...props }: Props) => {
  return <textarea {...props} className={twMerge('h-28 resize-none input', hasError && fieldErrorBorderClassName, className)} />;
};
