import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import { cn } from '@/shared/utils/cn';
import type { ThemeConfig } from '@/shared/constants/colors';

type ThemeBrowserPreviewProps = {
  theme: ThemeConfig;
};

function ThemeBrowserPreview({ theme }: ThemeBrowserPreviewProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-mist-200/90 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-mist-200 bg-mist-50 px-2.5 py-2">
        <div className="flex shrink-0 gap-1" aria-hidden>
          <span className="size-2 rounded-full bg-[#ff5f57]" />
          <span className="size-2 rounded-full bg-[#febc2e]" />
          <span className="size-2 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-1 rounded-md border border-mist-200 bg-white px-2 py-1">
          <LockClosedIcon className="size-2.5 shrink-0 text-mist-400" strokeWidth={2} />
          <span className="truncate text-[9px] text-mist-500">turnify.app/tu-negocio</span>
        </div>
      </div>

      <div className="p-2.5" style={{ backgroundColor: theme.accentMuted }}>
        <div className="mb-2 flex items-center gap-1.5">
          <div className="size-4 shrink-0 rounded-md bg-white/90 shadow-sm" />
          <div className="h-2 flex-1 rounded-full bg-white/70" />
        </div>

        <div className="mb-2 rounded-md border border-white/60 bg-white p-2 shadow-sm">
          <div className="mb-1.5 grid grid-cols-4 gap-1">
            {['Lun', 'Mar', 'Mié', 'Jue'].map((day, i) => (
              <div
                key={day}
                className={cn(
                  'flex flex-col items-center rounded px-0.5 py-1',
                  i === 1 ? 'text-white shadow-sm' : 'border border-mist-200 bg-white text-mist-600',
                )}
                style={i === 1 ? { backgroundColor: theme.accent } : undefined}
              >
                <span className="text-[6px] font-semibold opacity-90">{day}</span>
                <span className="text-[8px] font-bold">{10 + i}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-1">
            {['09:00', '09:45', '10:30'].map((time, i) => (
              <div
                key={time}
                className={cn(
                  'rounded py-0.5 text-center text-[7px] font-semibold',
                  i === 1 ? 'text-white' : 'border border-mist-200 bg-mist-50 text-mist-600',
                )}
                style={i === 1 ? { backgroundColor: theme.accent } : undefined}
              >
                {time}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-md py-1 text-center text-[8px] font-bold text-white shadow-sm" style={{ backgroundColor: theme.accent }}>
          Reservar turno
        </div>
      </div>
    </div>
  );
}

type ThemeCardProps = {
  theme: ThemeConfig;
  isSelected: boolean;
  onSelect: () => void;
};

export function ThemeCard({ theme, isSelected, onSelect }: ThemeCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isSelected}
      className={cn(
        'group relative flex w-full flex-col rounded-2xl border-2 bg-white p-3 text-left shadow transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        isSelected
          ? cn('border-transparent shadow-md ring-2 ring-offset-2', theme.ring, 'focus-visible:ring-offset-white')
          : cn('border-mist-200', theme.hover, 'hover:shadow-md'),
      )}
    >
      {theme.recommend && (
        <span
          className="absolute -top-2.5 right-3 z-10 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase"
          style={{ backgroundColor: theme.accent }}
        >
          Recomendado
        </span>
      )}

      {isSelected && <CheckCircleIcon className="absolute top-3 right-3 z-10 size-5" style={{ color: theme.accent }} aria-hidden />}

      <ThemeBrowserPreview theme={theme} />

      <div className="mt-3 flex items-center justify-between gap-2">
        <span className={cn('text-sm font-bold text-mist-900', theme.text)}>{theme.name}</span>
        <span className="size-4 shrink-0 rounded-full ring-2 ring-white" style={{ backgroundColor: theme.accent }} aria-hidden />
      </div>
    </button>
  );
}
