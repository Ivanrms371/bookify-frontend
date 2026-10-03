import { useState } from 'react';
import { useParams } from 'react-router';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { ApiError } from '@/core/error/api-error';
import { Button, Card } from '@/shared/components/ui';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/shared/components/ui/table/table';
import { useBillingPayments } from '../hooks/use-billing-payments';
import { formatBillingDate, formatBillingMoney, paymentStatusLabel } from '../utils/billing-format';
import { PaymentInvoiceButton } from './payment-invoice-button';
import { Heading, Text } from '@/shared/components/typography';

export function BillingPaymentHistory() {
  const { slug } = useParams();
  const tenant = useAuthStore((state) => state.session?.activeTenant);
  if (!tenant || tenant.slug !== slug) return null;
  return <PaymentHistoryTable key={`${tenant.id}:${slug}`} />;
}

function PaymentHistoryTable() {
  const [page, setPage] = useState(1);
  const query = useBillingPayments({ page, pageSize: 10 });
  const forbidden = query.error instanceof ApiError && query.error.status === 403;
  const totalPages = query.data ? Math.max(1, Math.ceil(query.data.meta.total / query.data.meta.pageSize)) : 1;
  return (
    <Card as="section" aria-labelledby="payments" className="p-0">
      <div className="p-6 sm:px-8">
        <Heading id="payments" className="text-lg md:text-2xl font-semibold text-gray-900">
          Historial de pagos
        </Heading>
        <Text size="base" weight="medium" className="mt-1 text-gray-500">
          La fecha corresponde a la emisión de la factura.
        </Text>
      </div>
      {query.isPending ? (
        <p role="status" className="px-6 pb-6 text-sm text-gray-500">
          Cargando pagos…
        </p>
      ) : query.isError ? (
        <div role="alert" className="px-6 pb-6">
          <p className="mb-3 text-sm text-gray-700">
            {forbidden ? 'No tienes permiso para consultar los pagos de este negocio.' : 'No pudimos cargar tus pagos.'}
          </p>
          {!forbidden && (
            <Button variant="secondary" onClick={() => query.refetch()}>
              Reintentar
            </Button>
          )}
        </div>
      ) : (
        <>
          {query.data.items.length === 0 ? (
            <p role="status" className="px-6 pb-6 text-sm text-gray-500">
              {query.data.meta.total === 0 ? 'Todavía no tienes pagos.' : 'No hay pagos en esta página.'}
            </p>
          ) : (
            <Table containerClassName="rounded-none shadow-none" className="min-w-145" aria-label="Historial de pagos">
              <Thead className="bg-gray-50">
                <Tr>
                  <Th>Fecha</Th>
                  <Th>Referencia</Th>
                  <Th>Importe</Th>
                  <Th>Estado</Th>
                  <Th className="text-right">Factura</Th>
                </Tr>
              </Thead>
              <Tbody>
                {query.data.items.map((payment) => (
                  <Tr key={payment.id}>
                    <Td>
                      <time dateTime={payment.date}>{formatBillingDate(payment.date)}</time>
                    </Td>
                    <Td>{payment.referenceCode}</Td>
                    <Td>
                      {formatBillingMoney(payment.amount, payment.currency)}{' '}
                      <span className="text-xs text-gray-500">{payment.currency}</span>
                    </Td>
                    <Td>{paymentStatusLabel(payment.status)}</Td>
                    <Td className="text-right">
                      <PaymentInvoiceButton payment={payment} />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
          {(query.data.meta.total > 0 || page > 1) && (
            <nav
              aria-label="Páginas del historial de pagos"
              className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 px-6 py-4"
            >
              <p role="status" className="text-sm text-gray-500">
                Página {page} de {Math.max(page, totalPages)} · {query.data.meta.total} pagos
              </p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page === 1 || query.isFetching}
                  onClick={() => setPage((current) => current - 1)}
                >
                  Anterior
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page >= totalPages || query.isFetching}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Siguiente
                </Button>
              </div>
            </nav>
          )}
        </>
      )}
    </Card>
  );
}
