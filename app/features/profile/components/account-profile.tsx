import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Text } from '@/shared/components/typography';
import { useGetProfile } from '../hooks/use-get-profile';

const formatDate = (date: string) => new Date(date).toLocaleDateString('es-UY', { day: 'numeric', month: 'long', year: 'numeric' });

export const AccountProfile = () => {
  const { data } = useGetProfile();
  const user = data?.user;

  return (
    <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8">
      <div className="pb-6 border-b border-gray-100 mb-2">
        <Text className="text-xl font-bold text-gray-800">Cuenta</Text>
        <Text className="text-gray-500">Información y acciones sobre tu cuenta.</Text>
      </div>

      <div className="divide-y divide-gray-100">
        {user?.createdAt && (
          <div className="flex justify-between items-center py-5 gap-4">
            <Text className="text-gray-800 font-medium">Miembro desde</Text>
            <Text className="text-gray-500">{formatDate(user.createdAt)}</Text>
          </div>
        )}

        <div className="flex justify-between items-center py-5 gap-4">
          <Text className="text-gray-800 font-medium">Cuenta de Google</Text>
          {user?.hasGoogle ? <Badge variant="green">Vinculada</Badge> : <Badge variant="gray">No vinculada</Badge>}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-5 gap-4">
          <div className="flex-1">
            <Text className="text-red-600 font-medium">Eliminar cuenta</Text>
            <Text className="text-sm text-gray-500">Se eliminarán tu cuenta y tus datos. Esta acción no se puede deshacer.</Text>
          </div>
          <Button type="button" variant="danger" className="shrink-0">
            Eliminar mi cuenta
          </Button>
        </div>
      </div>
    </div>
  );
};
