import { Button } from '@/shared/components/ui/button';
import { Text } from '@/shared/components/typography';
import { cn } from '@/shared/utils/cn';

interface Props {
  isDirty: boolean;
  isSubmitting?: boolean;
  onReset: () => void;
  message?: string;
  discardText?: string;
  saveText?: string;
}

export const FloatingSaveBar = ({
  isDirty,
  isSubmitting = false,
  onReset,
  message = 'Tienes cambios sin guardar',
  discardText = 'Descartar',
  saveText = 'Guardar Cambios',
}: Props) => {
  return (
    <div
      className={cn(
        'fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out-expo',
        isDirty ? 'translate-y-0 opacity-100 visible' : 'translate-y-10 opacity-0 invisible'
      )}
    >
      <div className="bg-gray-950/90 backdrop-blur-xl text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-6 border border-white/10">
        <Text className="text-sm font-medium text-gray-300">{message}</Text>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            className="rounded-full text-gray-300 hover:text-white hover:bg-gray-800"
            onClick={onReset}
            disabled={isSubmitting}
          >
            {discardText}
          </Button>
          <Button type="submit" variant="primary" isSubmitting={isSubmitting} className="rounded-full">
            {saveText}
          </Button>
        </div>
      </div>
    </div>
  );
};
