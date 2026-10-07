import { Heading, Text } from '@/shared/components/typography';
import { Card } from '@/shared/components/ui/card';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/shared/components/ui/table';
import { formatReportCurrency } from '../utils/report-currency';
import type { ReportsProfessionalsProps } from '../types/reports-props.types';

export function ReportsProfessionals({ professionals, currency = 'UYU' }: ReportsProfessionalsProps) {
  return (
    <Card as="section" aria-labelledby="reports-professionals-heading" className="min-w-0">
      <Heading as="h2" id="reports-professionals-heading" className="font-display text-xl md:text-2xl font-semibold text-gray-900">
        Rendimiento por profesional
      </Heading>
      <Text className="mt-1 font-sans text-base leading-relaxed tracking-normal font-normal text-gray-600">
        Citas completadas e ingresos generados
      </Text>
      <Table className="min-w-[460px]" containerClassName="mt-5" aria-labelledby="reports-professionals-heading">
        <Thead>
          <Tr>
            <Th scope="col">Profesional</Th>
            <Th scope="col" className="text-right">
              Citas completadas
            </Th>
            <Th scope="col" className="text-right">
              Ingresos
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {professionals.length === 0 && <Tr><Td colSpan={3}>No hay citas para los filtros seleccionados.</Td></Tr>}
          {professionals.map((item) => (
            <Tr key={item.id}>
              <Td className="font-medium">{item.name}</Td>
              <Td className="text-right">{item.completed}</Td>
              <Td className="text-right">{formatReportCurrency(item.revenue, currency)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Card>
  );
}
