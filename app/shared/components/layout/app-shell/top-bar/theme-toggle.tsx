import { twMerge } from 'tailwind-merge';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useThemeStore } from '@/shared/store/useThemeStore';

export const ThemeToggle = () => {
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="h-9 w-15 rounded-full bg-gray-200 dark:bg-gray-900/50  transition flex justify-center items-center gap-7 relative cursor-pointer"
    >
      <div
        className={twMerge(
          'absolute top-0.5 left-0.5 size-8 rounded-full transition-all duration-300 z-0 flex justify-center items-center',
          isDark() ? 'translate-x-5.5 bg-gray-800/50' : 'translate-x-0 bg-white',
        )}
      >
        {isDark() ? (
          <MoonIcon className={twMerge('size-4 z-10 transiion-all duration-300')} />
        ) : (
          <SunIcon className={twMerge('size-4 z-10 transition-all duration-300')} />
        )}
      </div>
    </button>
  );
};
