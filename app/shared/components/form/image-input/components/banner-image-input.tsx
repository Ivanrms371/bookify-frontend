import { Alert } from '@/shared/components/feedback/Alert';
import { fieldErrorBorderClassName } from '@/shared/components/form/field-error-styles';
import { cn } from '@/shared/utils/cn';
import { ArrowUpTrayIcon, PhotoIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useId } from 'react';
import { ACCEPT, actionButtonClassName } from '../constants';
import { useImageInput } from '../hooks/use-image-input';
import type { ImageInputProps } from '../image-input.types';

export const BannerImageInput = (props: ImageInputProps) => {
  const fallbackId = useId();
  const inputId = props.id ?? fallbackId;
  const { className, previewClassName, errorMessage } = props;

  const { handleDragLeave, handleDragOver, handleDrop, handleInputChange, isDragging, openPicker, previewUrl, fileInputRef, setFile } =
    useImageInput(props);

  const hasImage = Boolean(previewUrl);

  console.log(previewUrl);

  return (
    <div className={cn('space-y-2', className)}>
      <div
        role="button"
        tabIndex={0}
        onClick={openPicker}
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
          'group relative flex w-full items-center justify-center rounded-xl border transition-all duration-300 ease-out aspect-3/1 select-none outline-none p-3 overflow-hidden cursor-pointer',
          'bg-white',
          !hasImage && 'cursor-pointer border-dashed border-gray-300 hover:border-gray-500 hover:bg-gray-100/50',
          hasImage && 'border-solid border-gray-200 bg-white',
          isDragging && !hasImage && 'border-indigo-400 bg-indigo-50/50 ring-2 ring-indigo-200/60',
          errorMessage && fieldErrorBorderClassName,
        )}
        aria-label={hasImage ? 'Banner cargado' : 'Subir banner'}
      >
        {hasImage ? (
          <>
            <img src={previewUrl!} alt="Banner preview" className={cn('absolute inset-0 size-full object-cover', previewClassName)} />
            {/* Subtle photorealistic gradient overlay matching avatar styling hover overlay */}
            <div className="absolute inset-0 bg-gray-900/0 opacity-0 transition-all duration-200 group-hover:bg-gray-900/40 group-hover:opacity-100 group-focus-within:bg-gray-900/40 group-focus-within:opacity-100 pointer-events-none" />

            {/* Floating Action Bar - Mobile-first: always visible on mobile, fades in on hover on desktop */}
            <div className="absolute right-3 top-3 flex items-center gap-2 z-10 transition-all duration-300 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openPicker();
                }}
                className={cn(actionButtonClassName, 'flex items-center gap-1 px-2.5 py-1 text-[10px] cursor-pointer')}
                title="Cambiar portada"
              >
                <ArrowUpTrayIcon className="size-3 text-gray-600 " strokeWidth={2} />
                <span>Cambiar</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
                className={cn(
                  actionButtonClassName,
                  'flex items-center gap-1 px-2.5 py-1 text-[10px] text-red-700 hover:bg-red-50 cursor-pointer',
                )}
                title="Quitar portada"
              >
                <TrashIcon className="size-3 text-red-600" strokeWidth={2} />
                <span>Quitar</span>
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center size-full py-8 px-4">
            <PhotoIcon className="size-7 text-gray-400 " strokeWidth={1} />

            <h3 className="mt-2 text-base font-semibold text-gray-800">Subí tu imagen de portada</h3>

            <p className="mt-1 max-w-xs text-sm font-medium text-gray-500 leading-normal">
              Arrastrá y soltá tu imagen aquí, o hacé clic para explorar
            </p>
          </div>
        )}

        {/* Drag overlay on top of existing image */}
        {isDragging && hasImage && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-indigo-600/90 dark:bg-indigo-950/90 text-white backdrop-blur-sm transition-all duration-300">
            <ArrowUpTrayIcon className="size-10 animate-bounce" strokeWidth={1.5} />
            <h3 className="mt-3 text-sm font-semibold">Soltá la imagen acá para cambiarla</h3>
          </div>
        )}

        <input id={inputId} ref={fileInputRef} type="file" accept={ACCEPT} className="sr-only" onChange={handleInputChange} />
      </div>

      {errorMessage && <Alert message={errorMessage} variant="error" />}
    </div>
  );
};
