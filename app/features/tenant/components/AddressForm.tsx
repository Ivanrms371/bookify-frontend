import { StepNavigation } from '@/features/onboarding/components/StepNavigation';
import { FormField } from '@/shared/components/form/FormField';
import { Input } from '@/shared/components/form/Input';
import { Label } from '@/shared/components/form/Label';
import { useForm } from 'react-hook-form';
import type { TenantAddressInput } from '../types/tenant.type';
import { Select } from '@/shared/components/form/Select';
import { URUGUAY_DEPARTMENTS } from '@/shared/constants/provinces';
import { useUpdateTenantAddress } from '../hooks/useUpdateTenantAddress';
import { useParams } from 'react-router';

type AddressFormProps = {
  onSuccess?: () => void;
  onBack?: () => void;
  children: React.ReactNode;

  initialData: TenantAddressInput;
};

export const AddressForm = ({ onSuccess, onBack, initialData, children }: AddressFormProps) => {
  const params = useParams<{ tenantId: string }>();
  const { mutate, isPending } = useUpdateTenantAddress();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<TenantAddressInput>({
    defaultValues: initialData,
  });

  const onSubmit = (data: TenantAddressInput) => {
    mutate(
      { tenantId: params.tenantId ?? '', payload: data },
      {
        onSuccess: () => {
          if (onSuccess) onSuccess();
        },
      },
    );
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <FormField>
        <Label htmlFor="phone">Teléfono</Label>
        <Input id="phone" type="tel" {...register('phone')} placeholder="Ej. 099 123 456" />
      </FormField>

      <FormField>
        <Label htmlFor="addressLine1">Dirección principal</Label>
        <Input id="addressLine1" {...register('addressLine1')} placeholder="Ej. Av. 18 de Julio 1234" />
      </FormField>

      <FormField>
        <Label htmlFor="addressLine2">Dirección 2 / Esquina (Opcional)</Label>
        <Input id="addressLine2" {...register('addressLine2')} placeholder="Ej. esq. Ejido" />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField>
          <Label htmlFor="department">Departamento</Label>
          <Select defaultValue={URUGUAY_DEPARTMENTS[5]}>
            {URUGUAY_DEPARTMENTS.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField>
          <Label htmlFor="city">Ciudad</Label>
          <Input id="city" {...register('city')} placeholder="Ej. Trinidad" />
        </FormField>
      </div>

      {children}
    </form>
  );
};
