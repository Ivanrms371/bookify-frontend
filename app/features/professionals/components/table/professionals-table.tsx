import { Table, Tbody, Td, Th, Thead, Tr } from '@/shared/components/ui/table';
import { formatPhoneForDisplay } from '@/shared/utils/format-phone';
import { ProfessionalAvatar } from '../professional-avatar';
import { Badge } from '@/shared/components/ui/badge';
import type { ProfessionalBasic } from '../../types/professional.types';
import type { Role } from '@/shared/types';
import { ProfessionalActions } from '../list/professional-actions';

export type ProfessionalTableRowType = ProfessionalBasic & {
  role?: Role | null;
};

interface Props {
  professionals: ProfessionalTableRowType[];
}

export const ProfessionalsTable = ({ professionals }: Props) => {
  return (
    <Table className="min-w-[900px]">
      <Thead>
        <Tr>
          <Th>Nombre</Th>
          <Th>Email</Th>
          <Th>Teléfono</Th>
          <Th>Estado</Th>
          <Th>Acceso</Th>
          <Th className="text-right">Acciones</Th>
        </Tr>
      </Thead>
      <Tbody>
        {professionals.map((professional) => (
          <Tr key={professional.id} className="hover:bg-gray-50 transition-colors">
            <Td>
              <div className="flex items-center gap-3">
                <ProfessionalAvatar professional={professional} />
                <div className="text-gray-900 font-semibold">{professional.name}</div>
              </div>
            </Td>
            <Td>
              <div className="text-gray-800 font-medium">{professional.email || '—'}</div>
            </Td>
            <Td>
              <div className="text-gray-800">
                {professional.phoneNumber ? formatPhoneForDisplay(professional.phoneNumber, professional.phoneCountryCode ?? '') : '—'}
              </div>
            </Td>
            <Td>
              <Badge variant={professional.isActive ? 'green' : 'gray'}>{professional.isActive ? 'Activo' : 'Inactivo'}</Badge>
            </Td>
            <Td>
              <div className="text-gray-800">
                {!professional.role ? (
                  <span className="text-gray-500 font-medium">Sin acceso</span>
                ) : (
                  <Badge variant={professional.role === 'OWNER' ? 'blue' : professional.role === 'ADMIN' ? 'violet' : 'gray'}>
                    {professional.role === 'OWNER'
                      ? 'Dueño'
                      : professional.role === 'ADMIN'
                        ? 'Admin'
                        : professional.role === 'STAFF'
                          ? 'Staff'
                          : professional.role}
                  </Badge>
                )}
              </div>
            </Td>
            <Td>
              <div className="flex justify-end w-full relative">
                <ProfessionalActions professional={professional} />
              </div>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};
