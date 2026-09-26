import { FormField } from '@/shared/components/form/form-field';
import { Input } from '@/shared/components/form/input';
import { PhoneCountryCode } from '@/shared/components/form/phone-country-code';
import { FloatingSaveBar } from '@/shared/components/form/floating-save-bar';
import { Text } from '@/shared/components/typography';
import { useForm, Controller } from 'react-hook-form';
import { useGetProfile } from '../hooks/use-get-profile';
import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { CameraIcon, TrashIcon } from '@heroicons/react/24/outline';
import { cn } from '@/shared/utils';

const getInitials = (name: string) => {
  return name.substring(0, 2).toUpperCase();
};

export const GeneralProfile = () => {
  const { data, isLoading } = useGetProfile();
  const { register, handleSubmit, reset, control, formState: { errors, isDirty, isSubmitting } } = useForm();

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (data?.user) {
      reset(data.user);
      if (data.user.avatarUrl) setAvatarPreview(data.user.avatarUrl);
    }
  }, [data, reset]);

  if (isLoading) {
    return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-gray-400" /></div>;
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // En un form real guardamos el archivo
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
          <Text className="text-xl font-bold text-gray-800">Información Personal</Text>
          <Text className="text-gray-500">Configura tus datos básicos como usuario de Turnify.</Text>
        </div>

        <div className="flex flex-col gap-10">
          
          <div className="flex flex-col md:flex-row gap-6 md:items-center">
            {/* Image Selector igual que settings de negocio */}
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
                    {getInitials(data?.user?.name ?? 'U')}
                  </div>
                </div>
              )}

              {/* Hover Actions */}
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
              <FormField id="name" label="Nombre completo" error={errors.name?.message as string}>
                <Input {...register('name')} placeholder="Ej. Juan Pérez" fullWidth />
              </FormField>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-10">
            <div className="w-full">
              <FormField id="phone" label="Teléfono" error={errors.phoneNumber?.message as string}>
                <div className="flex gap-2 w-full">
                  <Controller
                    name="phoneCountryCode"
                    control={control}
                    defaultValue="+598"
                    render={({ field }) => (
                      <PhoneCountryCode value={field.value} onChange={field.onChange} />
                    )}
                  />
                  <Input {...register('phoneNumber')} placeholder="99 123 456" className="w-full flex-1" fullWidth />
                </div>
              </FormField>
            </div>

            <div className="w-full">
              <FormField id="email" label="Correo electrónico" error={errors.email?.message as string}>
                <Input type="email" {...register('email')} placeholder="juan@ejemplo.com" disabled fullWidth />
              </FormField>
            </div>
          </div>

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
