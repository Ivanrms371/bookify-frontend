import { PhotoIcon } from '@heroicons/react/24/outline';
import { cn } from '@/shared/utils/cn';

export function ServiceThumbnail({ imageUrl, className }: { imageUrl?: string | null; className?: string }) {
  return (
    <div className={cn('flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100', className)}>
      {imageUrl ? <img src={imageUrl} loading="lazy" className="size-full object-cover" /> : <PhotoIcon className="size-6 text-gray-400" />}
    </div>
  );
}
