import { FormField } from '@/shared/components/form/form-field';
import { Input } from '@/shared/components/form/input';
import { Button } from '@/shared/components/ui/button';
import { Text } from '@/shared/components/typography';
import { useForm } from 'react-hook-form';
import { useGetProfile } from '../hooks/use-get-profile';

export const SecurityProfile = () => {
  const { data } = useGetProfile();
  const hasPassword = data?.user?.hasPassword ?? true;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onPasswordSubmit = async (formData: any) => {
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit(onPasswordSubmit)}>
      <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8">
        <div className="pb-6 border-b border-gray-100 mb-8">
          <Text className="text-xl font-bold text-gray-800">Seguridad</Text>
          <Text className="text-gray-500">
            {hasPassword
              ? 'Actualiza tu contraseña. Usa una contraseña segura y larga.'
              : 'Ingresas con Google. Puedes crear una contraseña para ingresar también con tu correo.'}
          </Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {hasPassword && (
            <FormField id="currentPassword" label="Contraseña actual" error={errors.currentPassword?.message as string}>
              <Input type="password" autoComplete="current-password" {...register('currentPassword')} fullWidth />
            </FormField>
          )}

          <FormField id="newPassword" label="Nueva contraseña" error={errors.newPassword?.message as string}>
            <Input type="password" autoComplete="new-password" {...register('newPassword')} fullWidth />
          </FormField>
        </div>

        <div className="flex justify-end mt-8">
          <Button type="submit" variant="primary" isSubmitting={isSubmitting}>
            {hasPassword ? 'Actualizar contraseña' : 'Crear contraseña'}
          </Button>
        </div>
      </div>
    </form>
  );
};
