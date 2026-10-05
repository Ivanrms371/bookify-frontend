import { cn } from '@/shared/utils/cn';

export const AGENDA_COLORS = [
  'bg-red-300',
  'bg-orange-300',
  'bg-amber-300',
  'bg-lime-300',
  'bg-emerald-300',
  'bg-teal-300',
  'bg-cyan-300',
  'bg-blue-300',
  'bg-indigo-300',
  'bg-violet-300',
  'bg-purple-300',
  'bg-pink-300',
];

interface ColorPickerProps {
  value?: string;
  onChange: (color: string) => void;
}

export const ColorPicker = ({ value, onChange }: ColorPickerProps) => {
  return (
    <div className="flex flex-wrap gap-4">
      {AGENDA_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          className={cn(
            'size-8 rounded-full cursor-pointer transition-transform hover:scale-110',
            color,
            value === color ? 'ring-1 ring-offset-2 ring-indigo-500' : '',
          )}
          aria-pressed={value === color}
          aria-label={`Seleccionar color ${color}`}
        />
      ))}
    </div>
  );
};
