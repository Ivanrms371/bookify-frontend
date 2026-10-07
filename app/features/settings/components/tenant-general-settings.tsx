import { generalSettingsValues } from '../utils/settings-form-values';
import { can } from '@/core/auth/permissions';
import React, { useRef, useState, useEffect } from 'react';
import { Input } from '@/shared/components/form/input';
import { Select } from '@/shared/components/form/Select';
import { Button } from '@/shared/components/ui/button';
import { CameraIcon, TrashIcon } from '@heroicons/react/24/outline';
import { PhotoIcon } from '@heroicons/react/24/solid';
import { Heading, Text } from '@/shared/components/typography';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { useGetSettings, settingsQueryKey } from '../hooks/use-get-settings';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { tenantGeneralSettingsSchema, type TenantGeneralSettingsFormValues } from '../schemas/tenant-settings-schema';
import { FormField } from '@/shared/components/form/form-field';
import { FloatingSaveBar } from '@/shared/components/form/floating-save-bar';
import { mediaApi } from '@/shared/media/api/media-api';
import type { UploadResult } from '@/shared/media/types';
import { useSettingsDraft } from '../hooks/use-settings-draft';
import type { SettingsFormProps } from '../types/settings-draft.types';
import { SettingsLoadState } from './settings-load-state';
import { isSettingsTenantCurrent, requireSettingsTenant } from '../utils/settings-context';
import { saveGeneralSettings } from '../utils/save-general-settings';
import { useNavigate } from 'react-router';
import { SettingsService } from '../api/settings.service';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { cn } from '@/shared/utils';
import { getInitials } from '@/shared/utils/string';

export const TenantGeneralSettings = ({ active = true }: SettingsFormProps) => {
  const { session } = useAuthStore();
  const { activeTenant } = session!;

  const { data, isPending, isError, refetch } = useGetSettings();
  const navigate = useNavigate();
  const lock = useRef(false);
  const uploads = useRef(new Map<File, UploadResult>());

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();

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

  const draftContext = useSettingsDraft('general', isDirty, isSubmitting);
  const dirtyRef = useRef(isDirty);
  dirtyRef.current = isDirty;
  useEffect(
    () => () => {
      if (logoPreview?.startsWith('blob:')) URL.revokeObjectURL(logoPreview);
    },
    [logoPreview],
  );
  useEffect(
    () => () => {
      if (bannerPreview?.startsWith('blob:')) URL.revokeObjectURL(bannerPreview);
    },
    [bannerPreview],
  );

  useEffect(() => {
    if (data && !dirtyRef.current) {
      reset(generalSettingsValues(data));
      setLogoPreview(data.logoUrl);
      setBannerPreview(data.coverUrl);
    }
  }, [data, reset]);

  if (!activeTenant) return null;

  if (isPending) return <SettingsLoadState loading />;
  if (!data) return <SettingsLoadState retry={() => void refetch()} />;

  const onSubmit = async (values: TenantGeneralSettingsFormValues) => {
    if (lock.current || !can(activeTenant, 'tenant:update')) return;
    lock.current = true;
    const tenantId = activeTenant.id;
    try {
      const { payload, cleanupFailed } = await saveGeneralSettings({
        values,
        previous: data,
        uploads: uploads.current,
        assertCurrent: () => requireSettingsTenant(tenantId, 'tenant:update'),
        upload: (file, type) => mediaApi.upload(file, type, tenantId),
        save: (payload) => SettingsService.updateGeneralSettings(payload, tenantId),
        remove: (publicId) => mediaApi.delete(publicId, tenantId),
      });
      if (!isSettingsTenantCurrent(tenantId)) return;
      reset({ ...values, logoFile: undefined, coverFile: undefined });
      const updated = { ...data, ...payload, settings: data.settings ? { ...data.settings, timeZone: values.timeZone } : null };
      queryClient.setQueryData(settingsQueryKey(tenantId), updated);
      const nextSlug = values.slug;
      const nextPath = `/${nextSlug}/settings`;
      if (nextSlug !== activeTenant.slug) draftContext?.allowNavigation(nextPath);
      const currentSession = useAuthStore.getState().session!;
      useAuthStore.getState().setAuth({
        ...currentSession,
        activeTenant: {
          ...currentSession.activeTenant!,
          name: values.name,
          slug: nextSlug,
          logo: updated.logoUrl,
          timeZone: values.timeZone,
        },
      });
      if (nextSlug !== activeTenant.slug) navigate(nextPath, { replace: true });
      void queryClient.invalidateQueries({ queryKey: settingsQueryKey(tenantId) });
      void queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast.success('Configuración guardada correctamente');
      if (cleanupFailed) toast.warning('Los cambios se guardaron, pero no se pudo eliminar una imagen anterior.');
    } catch (error) {
      if (isSettingsTenantCurrent(tenantId)) toast.error(error instanceof Error ? error.message : 'Ocurrió un error al guardar');
    } finally {
      lock.current = false;
    }
  };
  const discard = () => {
    reset(generalSettingsValues(data));
    setLogoPreview(data.logoUrl);
    setBannerPreview(data.coverUrl);
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
      {isError && (
        <div className="mb-4">
          <SettingsLoadState retry={() => void refetch()} />
        </div>
      )}
      {!can(activeTenant, 'tenant:update') && <p className="text-gray-500 mb-4">No tienes permiso para modificar estos ajustes.</p>}
      <fieldset disabled={isSubmitting || !can(activeTenant, 'tenant:update')}>
        {/* Header Visual (Banner & Logo) */}
        <div className="relative mb-20">
          {/* Banner */}
          <div
            onClick={() => {
              if (bannerPreview === null) {
                bannerInputRef.current?.click();
              }
            }}
            role={!bannerPreview ? 'button' : undefined}
            tabIndex={!bannerPreview && can(activeTenant, 'tenant:update') ? 0 : undefined}
            aria-label={!bannerPreview ? 'Añadir portada' : undefined}
            onKeyDown={(event) => {
              if (!bannerPreview && can(activeTenant, 'tenant:update') && (event.key === 'Enter' || event.key === ' ')) {
                event.preventDefault();
                bannerInputRef.current?.click();
              }
            }}
            className={cn(
              'h-56 md:h-72 w-full  bg-white rounded-lg overflow-hidden relative group transition-colors duration-300',
              bannerPreview ? 'shadow-md' : 'border border-dashed cursor-pointer border-gray-300 hover:border-indigo-600',
            )}
          >
            {bannerPreview ? (
              <img src={bannerPreview} alt="Banner" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                <PhotoIcon className="size-12 text-gray-300 mb-2" />
                <Text className=" font-medium text-gray-500">
                  <span className="text-indigo-500">Sube una imagen</span>
                </Text>
                <Text className="text-sm text-gray-400">Imagen de hasta 5 MB</Text>
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
              role={!logoPreview ? 'button' : undefined}
              tabIndex={!logoPreview && can(activeTenant, 'tenant:update') ? 0 : undefined}
              aria-label={!logoPreview ? 'Añadir logo (hasta 2 MB)' : undefined}
              onKeyDown={(event) => {
                if (!logoPreview && can(activeTenant, 'tenant:update') && (event.key === 'Enter' || event.key === ' ')) {
                  event.preventDefault();
                  logoInputRef.current?.click();
                }
              }}
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
        <div className="space-y-12">
          {/* Info del Negocio */}
          <div className="bg-white rounded-3xl shadow-md p-6 md:p-8">
            <div className="pb-6 border-b border-gray-100 mb-6">
              <Heading as="h2" className="text-xl md:text-2xl font-bold text-gray-800">
                Información del Negocio
              </Heading>
              <Text size="base" className="text-gray-500">
                Configura la identidad y los datos principales de tu negocio.
              </Text>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
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
              <Heading as="h2" className="text-xl md:text-2xl font-bold text-gray-800">
                Dirección y Contacto
              </Heading>
              <Text size="base" className="text-gray-500">
                Agrega la dirección de tu negocio para que tus clientes sepan dónde encontrarte.
              </Text>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
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
      </fieldset>
      {active && can(activeTenant, 'tenant:update') && <FloatingSaveBar isDirty={isDirty} isSubmitting={isSubmitting} onReset={discard} />}
    </form>
  );
};
