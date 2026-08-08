import { Alert } from '@/shared/components/feedback/Alert';
import { fieldErrorBorderClassName } from '@/shared/components/form/field-error-styles';
import { cn } from '@/shared/utils/cn';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';

const ACCEPT = 'image/png,image/jpeg,image/jpg,image/webp,image/avif';

const actionButtonClassName =
  'shrink-0 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300 dark:hover:bg-gray-900/50';

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
          'border-gray-200 border-dashed hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950/50 dark:hover:bg-gray-900/50',
          isDragging && 'border-gray-400 bg-gray-50 dark:border-gray-600 dark:bg-gray-900/60',
          errorMessage && fieldErrorBorderClassName,
          className,
        )}
      >
        <div
          className={cn(
            'relative size-14 shrink-0 overflow-hidden rounded-lg border border-dashed border-gray-200 dark:border-gray-800',
            !hasImage && 'flex items-center justify-center bg-gray-50 dark:bg-gray-900/50',
            previewClassName,
          )}
        >
          {hasImage ? (
            <img src={previewUrl!} alt="" className="size-full object-cover" />
          ) : (
            <PhotoIcon className="size-6 text-gray-400 dark:text-gray-500" strokeWidth={1.25} />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">Seleccionar imagen</p>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">Haz click o arrastrá una imagen</p>
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
