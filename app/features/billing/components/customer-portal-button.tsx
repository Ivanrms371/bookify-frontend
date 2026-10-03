import { Button } from '@/shared/components/ui';
import { useCustomerPortal } from '../hooks/use-customer-portal';
import type { CustomerPortalButtonProps } from '../types/portal.types';

export function CustomerPortalButton({ label, variant = 'secondary' }: CustomerPortalButtonProps) {
  const portal = useCustomerPortal();
  return (
    <div>
      <Button
        variant={variant}
        size="sm"
        disabled={portal.isPending}
        onClick={() => portal.mutate(undefined, { onSuccess: (url) => window.location.assign(url) })}
      >
        {portal.isPending ? 'Abriendo portal…' : portal.isError ? 'Reintentar' : label}
      </Button>
      {portal.isError && (
        <p role="alert" className="mt-2 max-w-sm text-sm text-red-700">
          No pudimos abrir el portal de facturación. Inténtalo de nuevo.
        </p>
      )}
    </div>
  );
}
