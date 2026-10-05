import { useState } from 'react';
import { CameraIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useImageInput } from '@/shared/components/form/image-input/hooks/use-image-input';
import { ACCEPT } from '@/shared/components/form/image-input/constants';

interface Props {
  name: string;
  file: File | null;
  imageUrl?: string | null;
  disabled: boolean;
  onChange: (file: File | null) => void;
}

export function ProfessionalPhotoInput({ name, file, imageUrl, disabled, onChange }: Props) {
  const [error, setError] = useState<string | null>(null);
  const changeFile = (next: File | null) => {
    if (disabled) return;
    if (next && (!ACCEPT.split(',').includes(next.type) || next.size > 2 * 1024 * 1024)) {
      setError('Elegí una imagen JPG, PNG, WebP o AVIF de hasta 2 MB.');
      return;
    }
    setError(null);
    onChange(next);
  };
  const { previewUrl, fileInputRef, handleInputChange, openPicker } = useImageInput({
    variant: 'avatar',
    value: file,
    onChange: changeFile,
  });
  const preview = previewUrl || imageUrl;

  return (
    <div className="flex shrink-0 flex-col items-center gap-2">
      <div className="group relative size-20 shrink-0 overflow-hidden rounded-full border-4 border-white bg-white shadow-md transition-shadow hover:shadow-lg focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2">
        {preview ? (
          <img src={preview} alt="Foto del profesional" className="size-full object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center bg-gray-50 text-xl font-bold text-gray-800">
            {name.trim() ? name.trim().substring(0, 2).toUpperCase() : <CameraIcon className="size-6" />}
          </div>
        )}
        <div
          className={`absolute inset-0 flex items-center justify-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100 ${preview ? 'bg-black/40' : 'bg-white/60'}`}
        >
          <button
            type="button"
            onClick={openPicker}
            disabled={disabled}
            aria-label={preview ? 'Cambiar foto del profesional' : 'Agregar foto del profesional'}
            title={preview ? 'Cambiar foto' : 'Agregar foto'}
            className={`bg-white/90 p-2 text-gray-800 transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-indigo-500 disabled:opacity-60 ${preview ? 'rounded-full' : 'flex size-full items-center justify-center rounded-full bg-transparent hover:bg-transparent'}`}
          >
            <CameraIcon className="size-4" />
          </button>
          {preview && (
            <button
              type="button"
              disabled={disabled}
              onClick={() => changeFile(null)}
              aria-label="Quitar foto del profesional"
              title="Quitar foto"
              className="rounded-full bg-white/90 p-2 text-red-600 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-red-500 disabled:opacity-60"
            >
              <TrashIcon className="size-4" />
            </button>
          )}
        </div>
      </div>
      <input ref={fileInputRef} type="file" accept={ACCEPT} onChange={handleInputChange} disabled={disabled} className="hidden" />
      {error && (
        <p role="alert" className="max-w-40 text-center text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
