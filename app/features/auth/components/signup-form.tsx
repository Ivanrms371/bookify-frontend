import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupFormValues } from '../schemas/signup.schema';
import { Input } from '@/shared/components/form/Input';
import { Label } from '@/shared/components/form/Label';
import { FormField } from '@/shared/components/form/FormField';
import { Alert } from '@/shared/components/feedback/Alert';
import { Button } from '@/shared/components/ui';
import { useSignup } from '../hooks/useSignup';
import { getApiError } from '@/shared/utils/getApiError';

export const SignupForm = () => {
  const { mutateAsync: signup, isPending, error } = useSignup();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    try {
      await signup(values);
    } catch (error) {}
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      {error && <Alert message={getApiError(error)} title="Error al registrar usuario" variant="error" />}

      <FormField>
        <Label htmlFor="email">Nombre Completo</Label>
        <Input type="name" id="name" placeholder="Tu nombre" {...register('name')} error={errors.name?.message} />
      </FormField>

      <FormField>
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" placeholder="Tu email" {...register('email')} error={errors.email?.message} />
      </FormField>

      <FormField>
        <Label htmlFor="phone">Teléfono</Label>
        <Input type="name" id="phone" placeholder="Tu teléfono" {...register('phone')} error={errors.phone?.message} />
      </FormField>

      <FormField>
        <div className="flex justify-between">
          <Label htmlFor="password">Contraseña</Label>
        </div>
        <Input type="password" id="password" placeholder="Crea una contraseña" {...register('password')} error={errors.password?.message} />
      </FormField>

      <Button type="submit" loading={isPending} disabled={isPending} variant="primary" className="mt-2">
        Registrarse
      </Button>
    </form>
  );
};
