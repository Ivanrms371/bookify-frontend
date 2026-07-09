import { Link } from 'react-router';
import { AuthDivider, AuthHeader, GoogleAuthButton, SignupForm } from '@/features/auth';
import { Text } from '@/shared/components/typography';

export default function SignupPage() {
  return (
    <>
      <AuthHeader title="Únete a Bookify hoy" subtitle="Empieza a organizar tu agenda y profesionaliza tu negocio en minutos." />

      <div className="flex flex-col gap-6 mt-8">
        <GoogleAuthButton />

        <AuthDivider />

        <SignupForm />

        <Text className="text-center text-sm">
          ¿Ya tienes una cuenta?
          <Link to="/auth/login" className="ml-1 cursor-pointer text-indigo-600 hover:text-indigo-700">
            Inicia sesión
          </Link>
        </Text>
      </div>
    </>
  );
}
