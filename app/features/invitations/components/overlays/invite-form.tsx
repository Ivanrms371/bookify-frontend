import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/components/ui/button';
import { FormField } from '@/shared/components/form/FormField';
import { Input } from '@/shared/components/form/input';
import { Select } from '@/shared/components/form/Select';
import { inviteProfessionalSchema, type InviteProfessionalFormData } from '../../schemas/invitation-form-schema';

interface InviteFormProps {
  defaultValues?: Partial<InviteProfessionalFormData>;
  onSubmit: (data: InviteProfessionalFormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  editing?: boolean;
}

export function InviteForm({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel = 'Enviar Invitación',
  editing = false,
}: InviteFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InviteProfessionalFormData>({
    resolver: zodResolver(inviteProfessionalSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      role: 'PROFESSIONAL',
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex flex-col h-full">
      <div className="space-y-4 flex-1">
        <FormField label="Nombre Completo" error={errors.name?.message}>
          <Input placeholder="Ej. Juan Pérez" {...register('name')} />
        </FormField>

        <FormField label="Correo Electrónico" error={errors.email?.message}>
          <Input type="email" placeholder="juan@ejemplo.com" disabled={editing} {...register('email')} />
        </FormField>

        <FormField label="Teléfono (Opcional)" error={errors.phone?.message}>
          <Input placeholder="+1234567890" {...register('phone')} />
        </FormField>

        <FormField label="Rol del Profesional" error={errors.role?.message}>
          <Select
            {...register('role')}
            options={[
              { label: 'Administrador', value: 'ADMIN' },
              { label: 'Profesional', value: 'PROFESSIONAL' },
            ]}
          />
        </FormField>
      </div>

      <div className="flex gap-3 pt-4">
        {onCancel && (
          <Button variant="secondary" type="button" onClick={onCancel} className="flex-1">
            Cancelar
          </Button>
        )}
        <Button variant="primary" type="submit" loading={isSubmitting} className="flex-1">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
