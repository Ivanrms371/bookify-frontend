import { Alert } from '@/shared/components/feedback/Alert';
import { fieldErrorBorderClassName } from '@/shared/components/form/field-error-styles';
import { cn } from '@/shared/utils/cn';
import { ArrowUpTrayIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { useEffect, useId, useRef, useState } from 'react';

interface Props {
  id?: string;
  value?: File | null;
  onChange?: (image: File | null) => void;
  previewClassName?: string;
  errorMessage?: string;
  className?: string;
}

const ACCEPT = 'image/png,image/jpeg,image/jpg,image/webp,image/avif';

const actionButtonClassName =
  'rounded-md border border-white/30 bg-white/95 px-2 py-0.5 text-[10px] font-semibold text-gray-800 shadow-sm backdrop-blur-sm transition-colors hover:bg-white';

export const LogoInput = ({ value = null, onChange, previewClassName, errorMessage, className, id }: Props) => {
  const fallbackId = useId();
  const inputId = id ?? fallbackId;
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!value) {
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      return;
    }

    const url = URL.createObjectURL(value);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });

    return () => URL.revokeObjectURL(url);
  }, [value]);

  const setFile = (file: File | null) => {
    onChange?.(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFile = (file: File | undefined) => {
    if (!file || !file.type.startsWith('image/')) return;
    setFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0]);
  };

  const openPicker = () => fileInputRef.current?.click();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const hasImage = Boolean(previewUrl);

  return (
    <div className={cn('space-y-2', className)}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => !hasImage && openPicker()}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !hasImage) {
            e.preventDefault();
            openPicker();
          }
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'group flex w-full items-center gap-3 rounded-xl border border-dashed p-3 transition-all duration-300 ease-out',
          'bg-gray-50/80 dark:bg-gray-950/40',
          !hasImage &&
            'cursor-pointer border-gray-300 hover:border-gray-500 hover:bg-gray-100/80 dark:hover:border-gray-600 dark:hover:bg-gray-900/50',
          hasImage && 'border-solid border-gray-200 bg-white dark:border-gray-800',
          isDragging && 'border-indigo-400 bg-indigo-50/50 ring-2 ring-indigo-200/60 dark:border-indigo-500 dark:bg-indigo-950/30',
          errorMessage && fieldErrorBorderClassName,
        )}
        aria-label={hasImage ? 'Logo cargado' : 'Subir logo'}
      >
        <div
          className={cn(
            'relative size-16 shrink-0 overflow-hidden rounded-full border border-dashed transition-colors',
            !hasImage && 'border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900',
            hasImage && 'border-gray-200 dark:border-gray-700',
            isDragging && 'border-indigo-400',
            previewClassName,
          )}
        >
          {hasImage ? (
            <>
              <img src={previewUrl!} alt="" className="size-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center gap-0.5 bg-gray-900/0 opacity-0 transition-all duration-200 group-hover:bg-gray-900/55 group-hover:opacity-100 group-focus-within:bg-gray-900/55 group-focus-within:opacity-100">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openPicker();
                  }}
                  className={actionButtonClassName}
                >
                  Cambiar
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  className={cn(actionButtonClassName, 'text-red-700 hover:bg-red-50')}
                >
                  Quitar
                </button>
              </div>
            </>
          ) : (
            <div className="flex size-full flex-col items-center justify-center">
              {isDragging ? (
                <ArrowUpTrayIcon className="size-5 text-indigo-600" strokeWidth={1.5} />
              ) : (
                <PhotoIcon className="size-5 text-gray-400 dark:text-gray-500" strokeWidth={1.25} />
              )}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 text-left">
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
            {isDragging ? 'Soltá el logo acá' : hasImage ? 'Logo listo' : 'Subí el logo de tu negocio'}
          </p>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            {hasImage ? 'Pasá el mouse sobre la imagen para cambiarla o quitarla' : 'Arrastrá y soltá o hacé clic para elegir un archivo'}
          </p>
        </div>

        <input id={inputId} ref={fileInputRef} type="file" accept={ACCEPT} className="sr-only" onChange={handleInputChange} />
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400">PNG o WebP · Recomendado 200 × 200 px</p>

      {errorMessage && <Alert message={errorMessage} variant="error" />}
    </div>
  );
};
