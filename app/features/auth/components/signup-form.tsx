import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupFormValues } from '../schemas/signup.schema';
import { Input } from '@/shared/components/form/input';
import { Label } from '@/shared/components/form/Label';
import { FormField } from '@/shared/components/form/form-field';
import { PhoneCountryCode } from '@/shared/components/form/phone-country-code';
import { Alert } from '@/shared/components/feedback/Alert';
import { Button } from '@/shared/components/ui';
import { useSignup } from '../hooks/useSignup';
import { getApiError } from '@/shared/utils/getApiError';
import { detectCountryDialCode } from '@/shared/utils/detect-country';
import { COUNTRIES } from '@/shared/constants';

const DEFAULT_DIAL_CODE = COUNTRIES[0]?.dialCode ?? '598';

export const SignupForm = () => {
  const { mutateAsync: signup, isPending, error } = useSignup();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, dirtyFields },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      phoneCountryCode: DEFAULT_DIAL_CODE,
      phoneNumber: '',
      password: '',
    },
  });

  const selectedCountryCode = watch('phoneCountryCode');

  useEffect(() => {
    const controller = new AbortController();
    detectCountryDialCode(controller.signal).then((dialCode) => {
      if (controller.signal.aborted) return;
      // Only override if the user hasn't touched the field yet.
      if (dirtyFields.phoneCountryCode) return;
      setValue('phoneCountryCode', dialCode, { shouldValidate: false, shouldDirty: false });
    });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (values: SignupFormValues) => {
    try {
      await signup(values);
    } catch {}
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      {error && <Alert message={getApiError(error)} title="Error al registrar usuario" variant="error" />}

      <FormField>
        <Label htmlFor="name">Nombre Completo</Label>
        <Input type="text" id="name" placeholder="Tu nombre" {...register('name')} error={errors.name?.message} />
      </FormField>

      <FormField>
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" placeholder="Tu email" {...register('email')} error={errors.email?.message} />
      </FormField>

      <FormField>
        <Label htmlFor="phoneNumber">Teléfono</Label>
        <div className="flex gap-2">
          <PhoneCountryCode
            value={selectedCountryCode}
            onChange={(val) => setValue('phoneCountryCode', val, { shouldValidate: true, shouldDirty: true })}
            disabled={isPending}
          />
          <Input
            type="tel"
            id="phoneNumber"
            placeholder="099 123 456"
            fullWidth
            {...register('phoneNumber')}
            error={errors.phoneNumber?.message || errors.phoneCountryCode?.message}
          />
        </div>
      </FormField>

      <FormField>
        <div className="flex justify-between">
          <Label htmlFor="password">Contraseña</Label>
        </div>
        <Input type="password" id="password" placeholder="Crea una contraseña" {...register('password')} error={errors.password?.message} />
      </FormField>

      <Button type="submit" isSubmitting={isPending} disabled={isPending} variant="primary" className="mt-2">
        Registrarse
      </Button>
    </form>
  );
};
