import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField } from '@/shared/components/form/form-field';
import { Input } from '@/shared/components/form/input';
import { Textarea } from '@/shared/components/form/Textarea';
import { Select } from '@/shared/components/form/Select';
import { PhoneCountryCode } from '@/shared/components/form/phone-country-code';
import type { ProfessionalFormValues } from '../../schemas/professional-form-schema';

interface Props {
  canEditContactData?: boolean;
}

export const ProfessionalInfoForm = ({ canEditContactData = true }: Props) => {
  const {
    register,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<ProfessionalFormValues>();

  const role = getValues('role');

  const [previewImage, setPreviewImage] = useState('');

  return (
    <div className="space-y-5 pt-2 px-1">
      <FormField label="Imagen" id="image" error={errors.avatarUrl?.message}>
        <div className="flex gap-2">
          {previewImage && <img src={previewImage} className=" object-cover size-10 rounded-xl" alt="Preview" />}
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              if (file) {
                // setValue('avatarUrl', file); // if handling file uploads
                setPreviewImage(URL.createObjectURL(file));
              }
            }}
          />
        </div>
      </FormField>

      <FormField label="Nombre" id="name" error={errors.name?.message}>
        <Input type="text" id="name" {...register('name')} />
      </FormField>

      <FormField label="Email" id="email" error={errors.email?.message}>
        <Input type="text" id="email" {...register('email')} disabled={!canEditContactData} />
      </FormField>

      <FormField label="Teléfono" id="phoneNumber" error={errors.phoneNumber?.message || errors.phoneCountryCode?.message}>
        <div className="flex gap-2">
          <PhoneCountryCode
            value={watch('phoneCountryCode') || '598'}
            onChange={(val) => setValue('phoneCountryCode', val, { shouldValidate: true })}
            disabled={!canEditContactData}
          />
          <Input type="text" id="phoneNumber" {...register('phoneNumber')} disabled={!canEditContactData} fullWidth />
        </div>
      </FormField>

      {role !== 'OWNER' && (
        <FormField label="Rol" id="role" error={errors.role?.message}>
          <Select
            id="role"
            {...register('role')}
            options={[
              { value: 'STAFF', label: 'Profesional' },
              { value: 'ADMIN', label: 'Admin' },
            ]}
            value={watch('role')}
            onChange={(e) => setValue('role', e.target.value as 'STAFF' | 'ADMIN', { shouldValidate: true })}
          />
        </FormField>
      )}

      <FormField label="Bio" id="bio" error={errors.bio?.message}>
        <Textarea id="bio" {...register('bio')} placeholder="" />
      </FormField>
    </div>
  );
};
