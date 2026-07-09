import { Alert } from '@/shared/components/feedback/Alert';
import { fieldErrorBorderClassName } from '@/shared/components/form/field-error-styles';
import { cn } from '@/shared/utils/cn';
import { ArrowUpTrayIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { useId } from 'react';
import { ACCEPT, actionButtonClassName } from '../constants';
import { useImageInput } from '../hooks/use-image-input';
import type { ImageInputProps } from '../image-input.types';

export const CardImageInput = (props: ImageInputProps) => {
  const fallbackId = useId();
  const inputId = props.id ?? fallbackId;
  const { className, previewClassName, errorMessage } = props;

  const { handleDragLeave, handleDragOver, handleDrop, handleInputChange, isDragging, openPicker, previewUrl, fileInputRef, setFile } =
    useImageInput(props);

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
          'bg-mist-50/80 ',
          !hasImage && 'cursor-pointer border-mist-300 hover:border-mist-500 hover:bg-mist-100/80',
          hasImage && 'border-solid border-mist-200 bg-white ',
          isDragging && 'border-indigo-400 bg-indigo-50/50 ring-2 ring-indigo-200/60 ',
          errorMessage && fieldErrorBorderClassName,
        )}
        aria-label={hasImage ? 'Imagen cargada' : 'Subir imagen'}
      >
        <div
          className={cn(
            'relative size-16 shrink-0 overflow-hidden rounded-lg border border-dashed transition-colors',
            !hasImage && 'border-mist-300 bg-white ',
            hasImage && 'border-mist-200 ',
            isDragging && 'border-indigo-400',
            previewClassName,
          )}
        >
          {hasImage ? (
            <>
              <img src={previewUrl!} alt="" className="size-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center gap-0.5 bg-mist-900/0 opacity-0 transition-all duration-200 group-hover:bg-mist-900/55 group-hover:opacity-100 group-focus-within:bg-mist-900/55 group-focus-within:opacity-100">
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
                <PhotoIcon className="size-5 text-mist-400 " strokeWidth={1.25} />
              )}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 text-left">
          <p className="text-sm font-semibold text-mist-800 d">
            {isDragging ? 'Soltá la imagen acá' : hasImage ? 'Imagen lista' : 'Seleccionar imagen'}
          </p>
          <p className="mt-0.5 text-xs text-mist-500 ">
            {hasImage ? 'Pasá el mouse sobre la imagen para cambiarla o quitarla' : 'Arrastrá y soltá o hacé clic para elegir un archivo'}
          </p>
        </div>

        <input id={inputId} ref={fileInputRef} type="file" accept={ACCEPT} className="sr-only" onChange={handleInputChange} />
      </div>

      {errorMessage && <Alert message={errorMessage} variant="error" />}
    </div>
  );
};
