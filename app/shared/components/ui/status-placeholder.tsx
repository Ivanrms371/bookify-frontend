import { cn } from '@/shared/utils/cn';
import { Text } from '../typography';
import { Button } from './button';

interface Props {
  title?: string;
  description?: string;
  containerClassName?: string;
  action?: () => void;
  actionText?: string;
  icon: React.ReactNode;
}

export const StatusPlaceholder = ({ title, description, icon, containerClassName, action, actionText }: Props) => {
  return (
    <div className={cn('flex flex-col flex-1 text-center justify-center items-center p-4', containerClassName)}>
      <div className="p-4 rounded-full bg-gray-100 mb-2">{icon}</div>
      {title && <Text className="text-gray-800">{title}</Text>}
      {description && <Text className="text-sm text-gray-500 font-medium max-w-sm mb-2">{description}</Text>}

      {action && actionText && (
        <Button type="button" variant="primary" onClick={action}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
