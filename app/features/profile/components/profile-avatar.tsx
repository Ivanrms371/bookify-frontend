import { useRef } from 'react';
import { CameraIcon, TrashIcon } from '@heroicons/react/24/outline';
import { cn } from '@/shared/utils';

interface ProfileAvatarProps {
  name: string;
  preview: string | null;
  onChange: (file: File) => void;
  onRemove: () => void;
}

const getInitials = (name: string) => {
  return name.substring(0, 2).toUpperCase();
};

export const ProfileAvatar = ({ name, preview, onChange, onRemove }: ProfileAvatarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <div
        className={cn(
          'size-24 md:size-28 shrink-0 rounded-full border-4 border-white bg-white shadow-md overflow-hidden relative group/logo',
          !preview && 'cursor-pointer hover:shadow-lg transition-all',
        )}
        onClick={() => {
          if (!preview) inputRef.current?.click();
        }}
      >
        {preview ? (
          <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-50 flex items-center justify-center">
            <div className="text-2xl text-gray-800 font-bold group-hover/logo:opacity-0 transition-opacity duration-300">
              {getInitials(name)}
            </div>
          </div>
        )}

        <div className="absolute inset-0 opacity-0 group-hover/logo:opacity-100 transition-all duration-300 flex items-center justify-center">
          {!preview ? (
            <div className="flex flex-col items-center justify-center text-gray-800 bg-white/60 w-full h-full">
              <CameraIcon className="size-6" />
            </div>
          ) : (
            <div className="flex gap-2 items-center bg-black/40 w-full h-full justify-center">
              <button
                type="button"
                className="p-2 bg-white/90 rounded-full hover:bg-white text-gray-800 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  inputRef.current?.click();
                }}
                title="Cambiar"
              >
                <CameraIcon className="size-4" />
              </button>
              <button
                type="button"
                className="p-2 bg-white/90 rounded-full hover:bg-red-50 text-red-600 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                title="Eliminar"
              >
                <TrashIcon className="size-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onChange(file);
        }}
      />
    </>
  );
};
