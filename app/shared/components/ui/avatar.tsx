import { COLORS } from '@/shared/constants';
import { cn } from '@/shared/utils/cn';
import { getInitials } from '@/shared/utils/string';
// import { useDarkModeStore } from "@/shared/store/useThemeStore"

interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: string;
}

export const Avatar = ({ src, name, size = 'md', className, color }: AvatarProps) => {
  const initials = getInitials(name);

  if (src) {
    return (
      <img
        src={src}
        alt={name ?? 'Profile'}
        className={cn(
          'rounded-full object-cover border border-mist-300 ',
          size === 'lg' && 'size-11',
          size === 'md' && 'size-10',
          size === 'sm' && 'size-9',
          className,
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        'flex justify-center items-center rounded-full font-semibold font-mono bg-mist-200 text-mist-800',
        size === 'lg' && 'size-11',
        size === 'md' && 'size-10',
        size === 'sm' && 'size-9 text-sm',
        className,
      )}
    >
      {initials}
    </div>
  );
};
