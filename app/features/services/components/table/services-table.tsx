import { ServiceThumbnail } from '../service-thumbnail';
import { Table, Tbody, Td, Th, Thead, Tr } from '@/shared/components/ui/table';
import { Badge } from '@/shared/components/ui/badge';
import { formatCurrency } from '@/shared/utils/currency';
import { formatDurationMinutesSmall } from '../../constants/service-duration';
import { ServiceActions } from '../grid/service-actions';
import type { Service } from '../../types/services.types';

export function ServicesTable({ services }: { services: Service[] }) {
  return (
    <Table className="min-w-[750px]">
      <Thead>
        <Tr>
          <Th>Servicio</Th>
          <Th>Duración</Th>
          <Th>Precio</Th>
          <Th>Descuento</Th>
          <Th>Estado</Th>
          <Th className="text-right">Acciones</Th>
        </Tr>
      </Thead>
      <Tbody>
        {services.map((service) => (
          <Tr key={service.id} className="hover:bg-gray-50">
            <Td>
              <div className="flex items-center gap-3">
                <ServiceThumbnail imageUrl={service.imageUrl} />
                <div className="min-w-0">
                  <div className="font-medium text-gray-900">{service.name}</div>
                  <p className="max-w-sm truncate text-sm text-gray-500">{service.description}</p>
                </div>
              </div>
            </Td>
            <Td>{formatDurationMinutesSmall(service.durationMinutes)}</Td>
            <Td>{formatCurrency(service.price)}</Td>
            <Td>
              {service.discountPercentage > 0 ? (
                `${service.discountPercentage}%`
              ) : service.discountFixed > 0 ? (
                formatCurrency(service.discountFixed)
              ) : (
                <span className="text-gray-400">Sin descuento</span>
              )}
            </Td>
            <Td>
              <Badge variant={service.isActive ? 'green' : 'gray'}>{service.isActive ? 'Activo' : 'Inactivo'}</Badge>
            </Td>
            <Td>
              <div className="flex justify-end">
                <ServiceActions service={service} />
              </div>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
