import { cn } from '@/shared/utils/cn';

type Props = React.LabelHTMLAttributes<HTMLLabelElement>;

export const Label = ({ children, ...props }: Props) => {
  return (
    <label {...props} className={cn('label', props.className)}>
      {children}
    </label>
  );
};
