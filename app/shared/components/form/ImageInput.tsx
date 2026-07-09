import { Alert } from '@/shared/components/feedback/Alert';
import { fieldErrorBorderClassName } from '@/shared/components/form/field-error-styles';
import { cn } from '@/shared/utils/cn';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';

const ACCEPT = 'image/png,image/jpeg,image/jpg,image/webp,image/avif';

const actionButtonClassName =
  'shrink-0 rounded-lg border border-mist-200 bg-mist-50 px-3 py-1.5 text-xs font-medium text-mist-700 transition-colors hover:bg-mist-100 dark:border-mist-700 dark:bg-mist-950 dark:text-mist-300 dark:hover:bg-mist-900/50';

export const ImageInput = ({ value = null, onChange, previewClassName, errorMessage, className, id }: Props) => {
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
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const hasImage = Boolean(previewUrl);

  return (
    <div className="space-y-2">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'flex items-center gap-3 rounded-xl border bg-white p-3 transition-[border-color,box-shadow,background-color] duration-300 ease-out',
          'border-mist-200 border-dashed hover:bg-mist-50 dark:border-mist-800 dark:bg-mist-950/50 dark:hover:bg-mist-900/50',
          isDragging && 'border-mist-400 bg-mist-50 dark:border-mist-600 dark:bg-mist-900/60',
          errorMessage && fieldErrorBorderClassName,
          className,
        )}
      >
        <div
          className={cn(
            'relative size-14 shrink-0 overflow-hidden rounded-lg border border-dashed border-mist-200 dark:border-mist-800',
            !hasImage && 'flex items-center justify-center bg-mist-50 dark:bg-mist-900/50',
            previewClassName,
          )}
        >
          {hasImage ? (
            <img src={previewUrl!} alt="" className="size-full object-cover" />
          ) : (
            <PhotoIcon className="size-6 text-mist-400 dark:text-mist-500" strokeWidth={1.25} />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-mist-900 dark:text-mist-100">Seleccionar imagen</p>
          <p className="mt-0.5 text-sm text-mist-500 dark:text-mist-400">Haz click o arrastrá una imagen</p>
        </div>

        <button type="button" onClick={openPicker} className={actionButtonClassName}>
          {hasImage ? 'Cambiar' : 'Subir'}
        </button>

        <input id={id} ref={fileInputRef} type="file" accept={ACCEPT} className="sr-only" onChange={handleInputChange} />
      </div>

      {errorMessage && <Alert message={errorMessage} variant="error" />}
    </div>
  );
};
