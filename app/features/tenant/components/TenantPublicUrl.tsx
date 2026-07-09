// modules/tenant/components/TenantPublicUrl.tsx
import { useState } from 'react';
import { useTenantStore } from '@/core/tenant/useTenantStore';
import { cn } from '@/shared/utils/cn';
import { ClipboardDocumentCheckIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';

const BASE_URL = 'bookify.com/b';

export function TenantPublicUrl() {
  const slug = useTenantStore((s) => s.activeTenant?.slug);
  const [copied, setCopied] = useState(false);

  if (!slug) return null;

  const publicUrl = `${BASE_URL}/${slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        'hidden h-10 items-center justify-between gap-2 rounded-xl px-3 py-2.5 md:flex',
        'text-xs font-medium sm:text-sm',
        'w-full max-w-sm cursor-pointer border transition-all duration-300',
        copied
          ? ['border-green-200 bg-green-50 text-green-600', 'dark:border-green-800 dark:bg-green-950 dark:text-green-400']
          : ['border-mist-200 text-mist-500 dark:border-mist-800 dark:text-mist-300', 'hover:bg-mist-200/50 dark:hover:bg-mist-900/50'],
      )}
      onClick={handleCopy}
    >
      <p className="truncate">{publicUrl}</p>

      {copied ? (
        <ClipboardDocumentCheckIcon className={cn('size-3.5 shrink-0 sm:size-4', 'text-green-600 dark:text-green-400')} />
      ) : (
        <ClipboardDocumentIcon className={cn('size-3.5 shrink-0 sm:size-4', 'text-mist-400 dark:text-mist-500')} />
      )}
    </div>
  );
}
