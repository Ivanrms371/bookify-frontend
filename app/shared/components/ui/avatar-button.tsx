import { Avatar } from './avatar';

interface AvatarButtonProps {
  src?: string | null;
  name?: string;
  onClick: () => void;
}

export const AvatarButton = ({ src, name, onClick }: AvatarButtonProps) => {
  return (
    <button type="button" onClick={onClick} aria-label={name || 'Perfil'} title={name} className="flex items-center gap-3 cursor-pointer">
      <span className="text-base font-medium text-gray-800">{name}</span>
      <Avatar
        src={src}
        name={name}
        size="lg"
        className="border border-gray-300 bg-gray-50 text-gray-800 font-display text-base leading-0"
      />
    </button>
  );
};
