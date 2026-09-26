import { FormField } from '@/shared/components/form/form-field';
import { Input } from '@/shared/components/form/input';
import { Button } from '@/shared/components/ui/button';
import { Text } from '@/shared/components/typography';
import { useForm } from 'react-hook-form';

export const SecurityProfile = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onPasswordSubmit = async (data: any) => {
    console.log(data);
  };

  return (
    <div className="space-y-12">
      <form onSubmit={handleSubmit(onPasswordSubmit)}>
        <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8">
          <div className="pb-6 border-b border-gray-100 mb-6 flex items-start justify-between">
            <div>
              <Text className="text-xl font-bold text-gray-800">Cambiar Contraseña</Text>
              <Text className="text-gray-500">Asegúrate de usar una contraseña segura y larga.</Text>
            </div>
            <Button type="submit" variant="primary" isSubmitting={isSubmitting}>
              Actualizar
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 max-w-md">
            <FormField id="currentPassword" label="Contraseña actual" error={errors.currentPassword?.message as string}>
              <Input type="password" {...register('currentPassword')} fullWidth />
            </FormField>
            
            <FormField id="newPassword" label="Nueva contraseña" error={errors.newPassword?.message as string}>
              <Input type="password" {...register('newPassword')} fullWidth />
            </FormField>
          </div>
        </div>
      </form>

      <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8">
        <div className="pb-6 border-b border-gray-100 mb-6">
          <Text className="text-xl font-bold text-gray-800">Zona de Peligro</Text>
          <Text className="text-gray-500">Acciones destructivas e irreversibles.</Text>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div>
            <Text className="font-semibold text-gray-800">Eliminar cuenta</Text>
            <Text className="text-sm text-gray-500">Una vez que elimines tu cuenta, no hay vuelta atrás.</Text>
          </div>
          <Button type="button" variant="secondary" className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 font-semibold shrink-0">
            Eliminar mi cuenta
          </Button>
        </div>
      </div>
    </div>
  );
};
