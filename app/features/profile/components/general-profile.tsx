import { FormField } from '@/shared/components/form/form-field';
import { Input } from '@/shared/components/form/input';
import { Textarea } from '@/shared/components/form/Textarea';
import { FloatingSaveBar } from '@/shared/components/form/floating-save-bar';
import { Text } from '@/shared/components/typography';
import { useForm } from 'react-hook-form';
import { useGetProfile } from '../hooks/use-get-profile';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export const GeneralProfile = () => {
  const { data, isLoading } = useGetProfile();
  const { register, handleSubmit, reset, formState: { errors, isDirty, isSubmitting } } = useForm();

  useEffect(() => {
    if (data?.user) {
      reset(data.user);
    }
  }, [data, reset]);

  if (isLoading) {
    return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-gray-400" /></div>;
  }

  
  const onSubmit = async (data: any) => {
    // TODO: Connect API
    console.log(data);
    reset(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
      <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8">
        <div className="pb-6 border-b border-gray-100 mb-6">
          <Text className="text-xl font-bold text-gray-800">Información Personal</Text>
          <Text className="text-gray-500">Configura tus datos básicos como usuario de Turnify.</Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <FormField id="name" label="Nombre completo" error={errors.name?.message as string}>
            <Input {...register('name')} placeholder="Ej. Juan Pérez" />
          </FormField>
          
          <FormField id="email" label="Correo electrónico" error={errors.email?.message as string}>
            <Input type="email" {...register('email')} placeholder="juan@ejemplo.com" disabled />
          </FormField>
          
          <FormField id="phone" label="Teléfono" error={errors.phone?.message as string}>
            <Input {...register('phone')} placeholder="+598 99 123 456" />
          </FormField>

          <FormField id="bio" label="Biografía" error={errors.bio?.message as string}>
            <Textarea {...register('bio')} placeholder="Cuéntanos un poco sobre ti..." rows={3} />
          </FormField>
        </div>
      </div>

      <FloatingSaveBar 
        isDirty={isDirty} 
        isSubmitting={isSubmitting} 
        onReset={() => reset()} 
      />
    </form>
  );
};
