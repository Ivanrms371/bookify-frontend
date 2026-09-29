import { FormField } from '@/shared/components/form/form-field';
import { Input } from '@/shared/components/form/input';
import { PhoneCountryCode } from '@/shared/components/form/phone-country-code';
import { FloatingSaveBar } from '@/shared/components/form/floating-save-bar';
import { Text } from '@/shared/components/typography';
import { useForm, Controller } from 'react-hook-form';
import { useGetProfile } from '../hooks/use-get-profile';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { ProfileAvatar } from './profile-avatar';
import { VerificationBadge } from './verification-badge';

export const GeneralProfile = () => {
  const { data, isLoading } = useGetProfile();
  const user = data?.user;
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty, isSubmitting },
  } = useForm();

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        phoneCountryCode: user.phoneCountryCode ?? '+598',
        phoneNumber: user.phoneNumber ?? '',
      });
      setAvatarPreview(user.avatarUrl);
    }
  }, [user, reset]);

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="animate-spin text-gray-400" />
      </div>
    );
  }

  const onSubmit = async (formData: any) => {
    console.log(formData);
    reset(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8">
        <div className="pb-6 border-b border-gray-100 mb-8">
          <Text className="text-xl font-bold text-gray-800">Información Personal</Text>
          <Text className="text-gray-500">Tus datos como usuario de Turnify.</Text>
        </div>

        <div className="flex flex-col gap-10">
          <div className="flex flex-col md:flex-row gap-6 md:items-center">
            <ProfileAvatar
              name={user?.name ?? 'U'}
              preview={avatarPreview}
              onChange={(file) => setAvatarPreview(URL.createObjectURL(file))}
              onRemove={() => setAvatarPreview(null)}
            />

            <div className="w-full">
              <FormField id="name" label="Nombre completo" error={errors.name?.message as string}>
                <Input {...register('name')} placeholder="Ej. Juan Pérez" fullWidth />
              </FormField>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="flex flex-col gap-2">
              <FormField id="email" label="Correo electrónico" error={errors.email?.message as string}>
                <Input type="email" {...register('email')} disabled fullWidth />
              </FormField>
              <div className="flex items-center gap-2">
                <VerificationBadge verifiedAt={user?.emailVerifiedAt} />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <FormField id="phoneNumber" label="Teléfono" error={errors.phoneNumber?.message as string}>
                <div className="flex gap-2 w-full">
                  <Controller
                    name="phoneCountryCode"
                    control={control}
                    render={({ field }) => <PhoneCountryCode value={field.value} onChange={field.onChange} />}
                  />
                  <Input {...register('phoneNumber')} placeholder="99 123 456" className="w-full flex-1" fullWidth />
                </div>
              </FormField>
              {user?.phoneNumber && (
                <div className="flex items-center gap-2">
                  <VerificationBadge verifiedAt={user.phoneVerifiedAt} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <FloatingSaveBar isDirty={isDirty} isSubmitting={isSubmitting} onReset={() => reset()} />
    </form>
  );
};
