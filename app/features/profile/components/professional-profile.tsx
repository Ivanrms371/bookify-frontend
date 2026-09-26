import { FormField } from '@/shared/components/form/form-field';
import { Input } from '@/shared/components/form/input';
import { Textarea } from '@/shared/components/form/Textarea';
import { FloatingSaveBar } from '@/shared/components/form/floating-save-bar';
import { Text } from '@/shared/components/typography';
import { useForm } from 'react-hook-form';
import { useGetProfile } from '../hooks/use-get-profile';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export const ProfessionalProfile = () => {
  const { data, isLoading } = useGetProfile();
    const { register, handleSubmit, reset, formState: { errors, isDirty, isSubmitting } } = useForm();

  useEffect(() => {
    if (data?.user?.professional) {
      reset(data.user.professional);
    }
  }, [data, reset]);

  if (isLoading) {
    return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-gray-400" /></div>;
  }

  if (!data?.user?.professional && !isLoading) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center">
        <Text className="text-gray-500">No tienes un perfil profesional asignado en este negocio.</Text>
      </div>
    );
  }

  
  const onSubmit = async (data: any) => {
    console.log(data);
    reset(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
      <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8">
        <div className="pb-6 border-b border-gray-100 mb-6">
          <Text className="text-xl font-bold text-gray-800">Perfil Profesional</Text>
          <Text className="text-gray-500">Esta es la información que verán los clientes al reservar contigo.</Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <FormField id="profession" label="Profesión o Cargo" error={errors.profession?.message as string}>
            <Input {...register('profession')} placeholder="Ej. Barbero Senior" />
          </FormField>
          
          <FormField id="bio" label="Biografía Profesional" error={errors.bio?.message as string}>
            <Textarea {...register('bio')} placeholder="Describe tu experiencia profesional..." rows={3} />
          </FormField>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8">
        <div className="pb-6 border-b border-gray-100 mb-6">
          <Text className="text-xl font-bold text-gray-800">Preferencias de Agenda</Text>
          <Text className="text-gray-500">Configuraciones específicas para tu agenda personal.</Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <FormField id="slotIntervalMinutes" label="Intervalo de turnos (minutos)" error={errors.slotIntervalMinutes?.message as string}>
            <Input type="number" {...register('slotIntervalMinutes')} placeholder="30" />
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
