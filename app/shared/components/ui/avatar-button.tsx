import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Avatar } from './avatar';

interface AvatarButtonProps {
  src?: string;
  name?: string;
  onClick: () => void;
}

export const AvatarButton = ({ src, name, onClick }: AvatarButtonProps) => {
  return (
    <button type="button" onClick={onClick} className="flex items-center gap-2 cursor-pointer">
      <Avatar src={src} name={name} size="sm" />
    </button>
  );
};
