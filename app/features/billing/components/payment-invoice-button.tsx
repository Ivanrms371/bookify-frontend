import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { ApiError } from '@/core/error/api-error';
import { Button } from '@/shared/components/ui';
import { usePaymentInvoice } from '../hooks/use-billing-payments';
import type { BillingPayment } from '../types/payment.types';

export function PaymentInvoiceButton({ payment }: { payment: BillingPayment }) {
  const invoice = usePaymentInvoice();
  const unavailable = invoice.error instanceof ApiError && invoice.error.status === 404;
  if (!payment.invoiceAvailable || unavailable) {
    return <span className="text-sm text-gray-500">No disponible</span>;
  }
  return (
    <div>
      <Button
        variant="ghost"
        size="sm"
        disabled={invoice.isPending}
        aria-label={`${invoice.isError ? 'Reintentar factura' : 'Ver factura'} ${payment.referenceCode}`}
        onClick={() => invoice.mutate(payment.id, { onSuccess: (url) => window.location.assign(url) })}
      >
        <DocumentTextIcon className="mr-2 size-4" />
        {invoice.isPending ? 'Abriendo…' : invoice.isError ? 'Reintentar factura' : 'Ver factura'}
      </Button>
      {invoice.isError && (
        <p role="alert" className="mt-1 whitespace-normal text-xs text-red-700">
          No pudimos abrir la factura. Inténtalo de nuevo.
        </p>
      )}
    </div>
  );
}
