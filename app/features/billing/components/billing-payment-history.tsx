import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { Button } from '@/shared/components/ui';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/shared/components/ui/table/table';
import { billingPreview } from '../data/billing-preview';
import { formatBillingMoney } from '../utils/billing-format';

export function BillingPaymentHistory() {
  return (
    <section aria-labelledby="payments" className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="p-6 sm:px-8">
        <h2 id="payments" className="text-lg font-semibold text-gray-900">
          Historial de pagos
        </h2>
        <p className="mt-1 text-sm text-amber-700">Vista previa · pagos de ejemplo, no corresponden a tu cuenta.</p>
      </div>
      <Table containerClassName="rounded-none shadow-none" className="min-w-145">
        <Thead className="bg-gray-50">
          <Tr>
            <Th>Fecha</Th>
            <Th>Concepto</Th>
            <Th>Importe</Th>
            <Th>Estado</Th>
            <Th className="text-right">Factura</Th>
          </Tr>
        </Thead>
        <Tbody>
          {billingPreview.payments.map((payment) => (
            <Tr key={payment.id}>
              <Td>{payment.date}</Td>
              <Td>
                {payment.concept}
                <span className="mt-1 block text-xs text-gray-400">{payment.id}</span>
              </Td>
              <Td>{formatBillingMoney(payment.amount, billingPreview.currency)}</Td>
              <Td>{payment.status}</Td>
              <Td className="text-right">
                <Button variant="ghost" size="sm" disabled title="Facturas pendientes de conexión">
                  <DocumentTextIcon className="mr-2 size-4" />
                  Ver factura
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </section>
  );
}
