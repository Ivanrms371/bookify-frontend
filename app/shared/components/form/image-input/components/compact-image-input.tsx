import React from 'react';
import type { ImageInputProps } from '../image-input.types';
import { useImageInput } from '../hooks/use-image-input';
import { cn } from '@/shared/utils/cn';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { Alert } from '@/shared/components/feedback/Alert';
import { ACCEPT } from '../constants';

export const CompactImageInput = (props: ImageInputProps) => {
  const { handleDragLeave, handleDragOver, handleDrop, handleInputChange, isDragging, openPicker, previewUrl, fileInputRef } =
    useImageInput(props);

  const { className, previewClassName, id, errorMessage } = props;

  return (
    <div className="space-y-2">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'flex items-center gap-3 rounded-xl border bg-white p-3 transition-[border-color,box-shadow,background-color] duration-300 ease-out',
          'border-mist-200 border-dashed dark:border-mist-800 dark:bg-mist-950/50 dark:hover:bg-mist-900/50',
          isDragging && 'border-mist-400 bg-mist-50 dark:border-mist-600 dark:bg-mist-900/60',
          className,
        )}
      >
        <div
          className={cn(
            'relative size-14 shrink-0 overflow-hidden rounded-lg border border-dashed border-mist-200 dark:border-mist-800',
            !previewUrl && 'flex items-center justify-center bg-mist-50 dark:bg-mist-900/50',
            previewClassName,
          )}
        >
          {previewUrl ? (
            <img src={previewUrl!} alt="" className="size-full object-cover" />
          ) : (
            <PhotoIcon className="size-6 text-mist-400 dark:text-mist-500" strokeWidth={1.25} />
          )}
        </div>

        <button type="button" onClick={openPicker} className="border border-mist-200 hover:bg-mist-50 text-sm px-2 py-1.5 rounded-md">
          {previewUrl ? 'Cambiar' : 'Subir'}
        </button>

        <input id={id} ref={fileInputRef} type="file" accept={ACCEPT} className="sr-only" onChange={handleInputChange} />
      </div>

      {errorMessage && <Alert message={errorMessage} variant="error" />}
    </div>
  );
};
