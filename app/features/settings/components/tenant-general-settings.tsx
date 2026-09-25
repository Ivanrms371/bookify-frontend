import React, { useRef, useState, useEffect } from 'react';
import { Input } from '@/shared/components/form/input';
import { Select } from '@/shared/components/form/Select';
import { Button } from '@/shared/components/ui/button';
import { CameraIcon, TrashIcon } from '@heroicons/react/24/outline';
import { PhotoIcon } from '@heroicons/react/24/solid';
import { Text } from '@/shared/components/typography';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { useGetSettings } from '../hooks/use-get-settings';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { tenantGeneralSettingsSchema, type TenantGeneralSettingsFormValues } from '../schemas/tenant-settings-schema';
import { FormField } from '@/shared/components/form/form-field';
import { useMediaDelete, useMediaUpload } from '@/shared/media';
import { SettingsService } from '../api/settings.service';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { cn } from '@/shared/utils';
import { getInitials } from '@/shared/utils/string';

export const TenantGeneralSettings = () => {
  const { session } = useAuthStore();
  const { activeTenant } = session!;

  const { data, isLoading } = useGetSettings();

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();
  const { mutateAsync: uploadMedia } = useMediaUpload();
  const { mutateAsync: deleteMedia } = useMediaDelete();

  const {
    register,
    handleSubmit,
    setValue,
    reset,

    formState: { errors, isSubmitting, isDirty },
  } = useForm<TenantGeneralSettingsFormValues>({
    resolver: zodResolver(tenantGeneralSettingsSchema),
    defaultValues: {
      name: '',
      slug: '',
      timeZone: 'America/Montevideo',
      phoneNumber: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      province: '',
      country: '',
    },
  });

  useEffect(() => {
    if (data) {
      reset({
        name: data.name || activeTenant?.name || '',
        slug: data.slug || activeTenant?.slug || '',
        timeZone: data.settings?.timeZone || 'America/Montevideo',
        phoneNumber: data.phoneNumber || '',
        addressLine1: data.addressLine1 || '',
        addressLine2: data.addressLine2 || '',
        city: data.city || '',
        province: data.province || '',
        country: data.country || '',
      });
      if (data.logoUrl) setLogoPreview(data.logoUrl);
      if (data.coverUrl) setBannerPreview(data.coverUrl);
    }
  }, [data, activeTenant, reset]);

  if (!activeTenant) return null;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const onSubmit = async (values: TenantGeneralSettingsFormValues) => {
    try {
      let newLogoUrl = data?.logoUrl || null;
      let newLogoPublicId = data?.logoPublicId || null;
      let newCoverUrl = data?.coverUrl || null;
      let newCoverPublicId = data?.coverPublicId || null;

      // Subir logo si hay uno nuevo o eliminar si se quitó
      if (values.logoFile === null) {
        if (data?.logoPublicId) {
          await deleteMedia(data.logoPublicId).catch(() => null);
        }
        newLogoUrl = null;
        newLogoPublicId = null;
      } else if (values.logoFile instanceof File) {
        if (data?.logoPublicId) {
          await deleteMedia(data.logoPublicId).catch(() => null);
        }
        const result = await uploadMedia({ file: values.logoFile, type: 'logo' });
        newLogoUrl = result.url;
        newLogoPublicId = result.publicId;
      }

      // Subir banner si hay uno nuevo o eliminar si se quitó
      if (values.coverFile === null) {
        if (data?.coverPublicId) {
          await deleteMedia(data.coverPublicId).catch(() => null);
        }
        newCoverUrl = null;
        newCoverPublicId = null;
      } else if (values.coverFile instanceof File) {
        if (data?.coverPublicId) {
          await deleteMedia(data.coverPublicId).catch(() => null);
        }
        const result = await uploadMedia({ file: values.coverFile, type: 'cover' });
        newCoverUrl = result.url;
        newCoverPublicId = result.publicId;
      }

      const payload = {
        name: values.name,
        slug: values.slug,
        timeZone: values.timeZone,
        phoneNumber: values.phoneNumber,
        addressLine1: values.addressLine1,
        addressLine2: values.addressLine2,
        city: values.city,
        province: values.province,
        country: values.country,
        logoUrl: newLogoUrl,
        logoPublicId: newLogoPublicId,
        coverUrl: newCoverUrl,
        coverPublicId: newCoverPublicId,
      };

      await SettingsService.updateGeneralSettings(payload);

      // Limpiar isDirty y refrescar data
      reset({ ...values, logoFile: undefined, coverFile: undefined });
      queryClient.invalidateQueries({ queryKey: ['tenant-settings'] });

      toast.success('Configuración guardada correctamente');
    } catch (error) {
      toast.error('Ocurrió un error al guardar');
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('logoFile', file, { shouldDirty: true });
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('coverFile', file, { shouldDirty: true });
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Header Visual (Banner & Logo) */}
      <div className="relative mb-20">
        {/* Banner */}
        <div
          onClick={() => {
            if (bannerPreview === null) {
              bannerInputRef.current?.click();
            }
          }}
          className={cn(
            'h-56 md:h-72 w-full  bg-white rounded-2xl overflow-hidden relative group transition-colors duration-300',
            bannerPreview ? 'shadow-md' : 'border border-dashed cursor-pointer border-gray-300 hover:border-indigo-600',
          )}
        >
          {bannerPreview ? (
            <img src={bannerPreview} alt="Banner" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
              <PhotoIcon className="size-12 text-gray-300 mb-2" />
              <Text className=" font-medium text-gray-500">
                <span className="text-indigo-500">Sube una imagen</span> o desliza y suelta
              </Text>
              <Text className="text-sm text-gray-400">PNG, JPG, Heic Hasta 5MB</Text>
            </div>
          )}
          {bannerPreview && (
            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300 flex items-center justify-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="bg-white text-gray-800 hover:bg-gray-100 font-semibold"
                onClick={() => bannerInputRef.current?.click()}
              >
                Cambiar
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                className="bg-red-500 text-white hover:bg-red-600 font-semibold border-0"
                onClick={() => {
                  setBannerPreview(null);
                  setValue('coverFile', null, { shouldDirty: true });
                }}
              >
                Eliminar
              </Button>
            </div>
          )}
        </div>

        {/* Logo overlapping banner */}
        <div className="absolute -bottom-14 left-8 md:left-12 z-10">
          <div
            className={cn(
              'size-28 md:size-36 rounded-full border-4 border-white bg-white shadow-md overflow-hidden relative group/logo',
              !logoPreview && 'cursor-pointer hover:shadow-lg transition-all',
            )}
            onClick={() => {
              if (!logoPreview) logoInputRef.current?.click();
            }}
          >
            {logoPreview ? (
              <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                <div className="text-4xl text-gray-800 font-bold group-hover/logo:opacity-0 transition-opacity duration-300">
                  {getInitials(data?.name ?? '')}
                </div>
              </div>
            )}

            {/* Hover Actions */}
            <div className="absolute inset-0 opacity-0 group-hover/logo:opacity-100 transition-all duration-300 flex items-center justify-center">
              {!logoPreview ? (
                <div className="flex flex-col items-center justify-center text-white/90">
                  <div className="p-2 rounded-full backdrop-blur-xl mb-1">
                    <CameraIcon className="size-5" />
                  </div>
                  <span className="text-[11px] font-medium tracking-wide">Añadir logo</span>
                </div>
              ) : (
                <div className="flex gap-4 items-center">
                  <button
                    type="button"
                    className="bg-gray-950  text-gray-200 backdrop-blur-md p-2 rounded-full transition-all hover:scale-110 shadow-sm cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      logoInputRef.current?.click();
                    }}
                    title="Cambiar"
                  >
                    <CameraIcon className="size-5" />
                  </button>
                  <button
                    type="button"
                    className="bg-red-950 text-red-400 backdrop-blur-md p-2 rounded-full transition-all hover:scale-110 shadow-sm cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLogoPreview(null);
                      setValue('logoFile', null, { shouldDirty: true });
                    }}
                    title="Eliminar"
                  >
                    <TrashIcon className="size-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={handleLogoChange} />
      <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={handleBannerChange} />

      {/* Forms Sections */}
      <div className="space-y-8">
        {/* Info del Negocio */}
        <div className="bg-white rounded-3xl shadow-md p-6 md:p-8">
          <div className="pb-6 border-b border-gray-100 mb-6">
            <Text className="text-xl font-bold text-gray-800">Información del Negocio</Text>
            <Text className="text-gray-500">Configura la identidad y los datos principales de tu negocio.</Text>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField id="name" label="Nombre de tu negocio" error={errors.name?.message}>
              <Input {...register('name')} placeholder="Ej. Barbería Central" />
            </FormField>
            <FormField id="slug" label="URL de tu negocio" error={errors.slug?.message}>
              <div className="input flex justify-center items-center">
                <span className="text-gray-400 select-none whitespace-nowrap">https://www.turnify.com/b/</span>
                <input type="text" {...register('slug')} className="flex-1 border-0 pl-1.5 font-medium focus:ring-0 outline-none" />
              </div>
            </FormField>
            <FormField id="timeZone" label="Zona horaria" error={errors.timeZone?.message}>
              <Select
                {...register('timeZone')}
                options={[
                  { label: '(GMT-03:00) Montevideo', value: 'America/Montevideo' },
                  { label: '(GMT-03:00) Buenos Aires', value: 'America/Argentina/Buenos_Aires' },
                  { label: '(GMT-05:00) Bogotá', value: 'America/Bogota' },
                  { label: '(GMT-06:00) Ciudad de México', value: 'America/Mexico_City' },
                ]}
              />
            </FormField>
          </div>
        </div>

        {/* Dirección y Contacto */}
        <div className="bg-white rounded-3xl  shadow-sm p-6 md:p-8">
          <div className="pb-6 border-b border-gray-100 mb-6">
            <Text className="text-xl font-bold text-gray-800">Dirección y Contacto</Text>
            <Text className="text-gray-500">Agrega la dirección de tu negocio para que tus clientes sepan dónde encontrarte.</Text>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField id="phoneNumber" label="Teléfono de contacto" error={errors.phoneNumber?.message}>
              <Input {...register('phoneNumber')} placeholder="+598 99 123 456" />
            </FormField>
            <div className="hidden md:block"></div> {/* Spacer */}
            <FormField id="addressLine1" label="Dirección Línea 1" error={errors.addressLine1?.message}>
              <Input {...register('addressLine1')} placeholder="Av. 18 de Julio 1234" />
            </FormField>
            <FormField id="addressLine2" label="Dirección Línea 2" error={errors.addressLine2?.message}>
              <Input {...register('addressLine2')} placeholder="Apto 101 (Opcional)" />
            </FormField>
            <FormField id="city" label="Ciudad" error={errors.city?.message}>
              <Input {...register('city')} placeholder="Montevideo" />
            </FormField>
            <FormField id="province" label="Provincia / Departamento" error={errors.province?.message}>
              <Input {...register('province')} placeholder="Montevideo" />
            </FormField>
            <FormField id="country" label="País" error={errors.country?.message}>
              <Input {...register('country')} placeholder="Uruguay" />
            </FormField>
          </div>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div
        className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out-expo ${
          isDirty ? 'translate-y-0 opacity-100 visible' : 'translate-y-10 opacity-0 invisible'
        }`}
      >
        <div className="bg-gray-900  text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-6">
          <Text className="text-sm font-medium text-gray-300">Tienes cambios sin guardar</Text>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              className="rounded-full text-gray-300 hover:text-white hover:bg-gray-800"
              onClick={() => reset()}
            >
              Descartar
            </Button>
            <Button type="submit" variant="primary" isSubmitting={isSubmitting} className="rounded-full">
              Guardar Cambios
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};
