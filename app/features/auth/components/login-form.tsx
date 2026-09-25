import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { loginSchema, type LoginFormValues } from '../schemas/login.schema';
import { useLogin } from '../hooks/useLogin';
import { Input } from '@/shared/components/form/input';
import { Label } from '@/shared/components/form/Label';
import { Alert } from '@/shared/components/feedback/Alert';
import { Link } from 'react-router';
import { Button } from '@/shared/components/ui';
import { getApiError } from '@/shared/utils/getApiError';
import { FormField } from '@/shared/components/form/form-field';
import { toast } from 'sonner';

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { mutateAsync: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values);
    } catch (error) {
      toast.error('Error al iniciar sesión', {
        description: getApiError(error),
      });
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <FormField>
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" placeholder="Tu email" {...register('email')} error={errors.email?.message} />
      </FormField>

      <FormField>
        <div className="flex justify-between">
          <Label htmlFor="password">Contraseña</Label>
          <Link to="/forgot-password" className="text-sm font-medium text-gray-500 dark:text-gray-400">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            id="password"
            placeholder="Tu contraseña"
            className="pr-12 w-full"
            error={errors.password?.message}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            className="absolute right-2 top-1/2 flex -translate-y-1/2 pr-2  text-gray-500 transition-colors  hover:text-gray-700  "
          >
            {showPassword ? <EyeSlashIcon className="size-5" /> : <EyeIcon className="size-5" />}
          </button>
        </div>
        {errors.password?.message && <Alert message={errors.password.message} variant="error" />}
      </FormField>

      <Button type="submit" disabled={isPending} variant="primary" className="mt-2">
        Iniciar sesión
      </Button>
    </form>
  );
};
