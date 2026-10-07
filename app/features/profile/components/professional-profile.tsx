import { can } from '@/core/auth/permissions';
import { FormField } from '@/shared/components/form/form-field';
import { Input } from '@/shared/components/form/input';
import { Textarea } from '@/shared/components/form/Textarea';
import { FloatingSaveBar } from '@/shared/components/form/floating-save-bar';
import { Text } from '@/shared/components/typography';
import { useForm, Controller } from 'react-hook-form';
import { useGetProfile } from '../hooks/use-get-profile';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { PhoneCountryCode } from '@/shared/components/form/phone-country-code';
import { Badge } from '@/shared/components/ui/badge';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { ProfileAvatar } from './profile-avatar';
import { ScheduleForm } from '@/features/schedule/components/schedule-form';
import { mapWorkingHoursToForm } from '../utils/map-working-hours';
import { Card } from '@/shared/components/ui';

export const ProfessionalProfile = () => {
  const { data, isLoading } = useGetProfile();
  const session = useAuthStore((state) => state.session);
  const tenantName = session?.activeTenant?.name || 'este negocio';

  const professional = data?.user?.professional;
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (professional) {
      reset(professional);
      setAvatarPreview(professional.avatarUrl);
    }
  }, [professional, reset]);

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (!professional) {
    return (
      <div className="bg-white rounded-3xl shadow-sm p-10 flex flex-col items-center text-center gap-3">
        <UserCircleIcon className="size-12 text-gray-300" />
        <Text className="text-lg font-bold text-gray-800">No eres profesional en {tenantName}</Text>
        <Text className="text-gray-500 max-w-md">
          Cuando un administrador te agregue como profesional, aquí podrás editar lo que ven tus clientes al reservar.
        </Text>
      </div>
    );
  }

  if (!can(session?.activeTenant, 'professional:update_self')) {
    return <Card className="p-6 space-y-2">
      <Text className="text-lg font-semibold">{professional.name}</Text>
      <Text className="text-gray-600">{professional.profession || 'Perfil profesional'}</Text>
      <Text className="text-sm text-gray-500">Un administrador puede actualizar tu perfil profesional y tus horarios.</Text>
    </Card>;
  }

  const onSubmit = async (formData: any) => {
    console.log(formData);
    reset(formData);
  };

  return (
    <div className="space-y-12">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
        <Card className="p-6 md:p-8">
          <div className="pb-6 border-b border-gray-100 mb-8">
            <div className="flex items-center gap-3">
              <Text className="text-xl font-bold text-gray-800">Perfil Profesional en {tenantName}</Text>
              {professional.isActive ? <Badge variant="green">Activo</Badge> : <Badge variant="red">Inactivo</Badge>}
            </div>
            <Text className="text-gray-500">Esto verán tus clientes al reservar.</Text>
          </div>

          <div className="flex flex-col gap-10">
            <div className="flex flex-col md:flex-row gap-6 md:items-center">
              <ProfileAvatar
                name={professional?.name ?? 'P'}
                preview={avatarPreview}
                onChange={(file) => setAvatarPreview(URL.createObjectURL(file))}
                onRemove={() => setAvatarPreview(null)}
              />

              <div className="w-full">
                <FormField id="name" label="Nombre a mostrar" error={errors.name?.message as string}>
                  <Input {...register('name')} placeholder="Ej. Juan Pérez" fullWidth />
                </FormField>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-10">
              <div className="w-full">
                <FormField id="professionalEmail" label="Correo de contacto" error={errors.email?.message as string}>
                  <Input type="email" {...register('email')} placeholder="juan@ejemplo.com" fullWidth />
                </FormField>
              </div>

              <div className="w-full">
                <FormField id="professionalPhone" label="Teléfono de contacto" error={errors.phoneNumber?.message as string}>
                  <div className="flex gap-2 w-full">
                    <Controller
                      name="phoneCountryCode"
                      control={control}
                      render={({ field }) => <PhoneCountryCode value={field.value} onChange={field.onChange} />}
                    />
                    <Input {...register('phoneNumber')} placeholder="99 123 456" className="w-full flex-1" fullWidth />
                  </div>
                </FormField>
              </div>
            </div>

            <FormField id="profession" label="Profesión o Cargo" error={errors.profession?.message as string}>
              <Input {...register('profession')} placeholder="Ej. Barbero Senior" fullWidth />
            </FormField>

            <FormField id="bio" label="Biografía Profesional" error={errors.bio?.message as string}>
              <Textarea {...register('bio')} placeholder="Describe tu experiencia profesional y lo que te destaca..." rows={4} />
            </FormField>
          </div>
        </Card>

        <Card className="p-6 md:p-8">
          <div className="pb-6 border-b border-gray-100 mb-8">
            <Text className="text-xl font-bold text-gray-800">Preferencias de Agenda</Text>
            <Text className="text-gray-500">Configuraciones específicas para tu agenda personal.</Text>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FormField
              id="slotIntervalMinutes"
              label="Intervalo de turnos"
              description="En minutos"
              error={errors.slotIntervalMinutes?.message as string}
            >
              <Input type="number" {...register('slotIntervalMinutes')} placeholder="30" fullWidth />
            </FormField>

            <FormField
              id="minAdvancedMinutes"
              label="Anticipación mínima"
              description="En minutos antes del turno"
              error={errors.minAdvancedMinutes?.message as string}
            >
              <Input type="number" {...register('minAdvancedMinutes')} placeholder="30" fullWidth />
            </FormField>

            <FormField
              id="maxAdvancedDays"
              label="Anticipación máxima"
              description="Días disponibles a futuro"
              error={errors.maxAdvancedDays?.message as string}
            >
              <Input type="number" {...register('maxAdvancedDays')} placeholder="30" fullWidth />
            </FormField>
          </div>
        </Card>

        <FloatingSaveBar isDirty={isDirty} isSubmitting={isSubmitting} onReset={() => reset()} />
      </form>

      <Card className="p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div className="pb-6 border-b border-gray-100 mb-8">
            <Text className="text-xl font-bold text-gray-800">Tus Horarios</Text>
            <Text className="text-gray-500">Por el momento usamos horarios del negocio, puedes cambiarlos y tener los tuyos propios.</Text>
          </div>
        </div>

        <ScheduleForm
          id="professional-schedule-form"
          defaultValues={mapWorkingHoursToForm(professional.workingHours)}
          onSubmit={(values) => console.log(values)}
        />
      </Card>
    </div>
  );
};
