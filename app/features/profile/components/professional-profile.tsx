import { FormField } from '@/shared/components/form/form-field';
import { Input } from '@/shared/components/form/input';
import { Textarea } from '@/shared/components/form/Textarea';
import { ColorPicker } from '@/shared/components/ui/color-picker';
import { FloatingSaveBar } from '@/shared/components/form/floating-save-bar';
import { Text } from '@/shared/components/typography';
import { useForm, Controller } from 'react-hook-form';
import { useGetProfile } from '../hooks/use-get-profile';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { CameraIcon, TrashIcon } from '@heroicons/react/24/outline';
import { cn } from '@/shared/utils';

const getInitials = (name: string) => {
  return name.substring(0, 2).toUpperCase();
};

export const ProfessionalProfile = () => {
  const { data, isLoading } = useGetProfile();
  const session = useAuthStore((state) => state.session);
  const tenantName = session?.activeTenant?.name || 'este negocio';

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, control, formState: { errors, isDirty, isSubmitting } } = useForm();

  useEffect(() => {
    if (data?.user?.professional) {
      reset(data.user.professional);
      if (data.user.professional.avatarUrl) setAvatarPreview(data.user.professional.avatarUrl);
    }
  }, [data, reset]);

  if (isLoading) {
    return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-gray-400" /></div>;
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (formData: any) => {
    console.log(formData);
    reset(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
      <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8">
        <div className="pb-6 border-b border-gray-100 mb-8">
          <Text className="text-xl font-bold text-gray-800">Perfil Profesional en {tenantName}</Text>
          <Text className="text-gray-500">Esto verán tus clientes al reservar.</Text>
        </div>

        <div className="flex flex-col gap-10">
          <div className="flex flex-col md:flex-row gap-6 md:items-center">
            
            <div
              className={cn(
                'size-24 md:size-28 shrink-0 rounded-full border-4 border-white bg-white shadow-md overflow-hidden relative group/logo',
                !avatarPreview && 'cursor-pointer hover:shadow-lg transition-all',
              )}
              onClick={() => {
                if (!avatarPreview) avatarInputRef.current?.click();
              }}
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                  <div className="text-2xl text-gray-800 font-bold group-hover/logo:opacity-0 transition-opacity duration-300">
                    {getInitials(data?.user?.professional?.name ?? 'P')}
                  </div>
                </div>
              )}

              <div className="absolute inset-0 opacity-0 group-hover/logo:opacity-100 transition-all duration-300 flex items-center justify-center">
                {!avatarPreview ? (
                  <div className="flex flex-col items-center justify-center text-gray-800 bg-white/60 w-full h-full">
                    <CameraIcon className="size-6" />
                  </div>
                ) : (
                  <div className="flex gap-2 items-center bg-black/40 w-full h-full justify-center">
                    <button
                      type="button"
                      className="p-2 bg-white/90 rounded-full hover:bg-white text-gray-800 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        avatarInputRef.current?.click();
                      }}
                      title="Cambiar"
                    >
                      <CameraIcon className="size-4" />
                    </button>
                    <button
                      type="button"
                      className="p-2 bg-white/90 rounded-full hover:bg-red-50 text-red-600 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setAvatarPreview(null);
                      }}
                      title="Eliminar"
                    >
                      <TrashIcon className="size-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />

            <div className="w-full">
              <FormField id="name" label="Nombre a mostrar" error={errors.name?.message as string}>
                <Input {...register('name')} placeholder="Ej. Juan Pérez" fullWidth />
              </FormField>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-10">
            <div className="w-full">
              <FormField id="profession" label="Profesión o Cargo" error={errors.profession?.message as string}>
                <Input {...register('profession')} placeholder="Ej. Barbero Senior" fullWidth />
              </FormField>
            </div>

            <div className="w-full">
              <FormField id="colorTheme" label="Color de perfil" error={errors.colorTheme?.message as string}>
                <Controller
                  name="colorTheme"
                  control={control}
                  render={({ field }) => (
                    <ColorPicker value={field.value} onChange={field.onChange} />
                  )}
                />
              </FormField>
            </div>
          </div>

          <FormField id="bio" label="Biografía Profesional" error={errors.bio?.message as string}>
            <Textarea {...register('bio')} placeholder="Describe tu experiencia profesional y lo que te destaca..." rows={4} />
          </FormField>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8">
        <div className="pb-6 border-b border-gray-100 mb-8">
          <Text className="text-xl font-bold text-gray-800">Preferencias de Agenda</Text>
          <Text className="text-gray-500">Configuraciones específicas para tu agenda personal.</Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <FormField id="slotIntervalMinutes" label="Intervalo de turnos" description="En minutos" error={errors.slotIntervalMinutes?.message as string}>
            <Input type="number" {...register('slotIntervalMinutes')} placeholder="30" fullWidth />
          </FormField>
          
          <FormField id="minAdvancedMinutes" label="Anticipación mínima" description="En minutos antes del turno" error={errors.minAdvancedMinutes?.message as string}>
            <Input type="number" {...register('minAdvancedMinutes')} placeholder="30" fullWidth />
          </FormField>

          <FormField id="maxAdvancedDays" label="Anticipación máxima" description="Días disponibles a futuro" error={errors.maxAdvancedDays?.message as string}>
            <Input type="number" {...register('maxAdvancedDays')} placeholder="30" fullWidth />
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
